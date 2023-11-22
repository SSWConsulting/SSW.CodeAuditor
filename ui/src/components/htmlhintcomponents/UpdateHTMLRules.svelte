<script>
  import Toastr from '../misccomponents/Toastr.svelte';
  import {
    CONSTS,
    htmlHintRules,
    customHtmlHintRules,
    rulePresets,
    PresetType,
  } from '../../utils/utils';
  import Modal from '../misccomponents//Modal.svelte';
  import LoadingFlat from '../misccomponents/LoadingFlat.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import slug from 'slug';
  import RuleItem from './RuleItem.svelte';

  export let url;
  export let show;
  export let loading;
  export let user;
  export let htmlRules;
  export let threshold;
  export let customHtmlRuleOptions = [];

  let saving;
  let addedSuccess;
  let addedFail;

  let presetSelection = [];

  // Check all selected htmlhint rules
  let htmlHintSelectedRules = [];
  let customHtmlHintSelectedRules = [];

  let showHistory = false;
  let historyLog = [];
  let currentlyEditingRule = '';

  $: htmlHintSelectedRules, handleSelectionChange();
  $: customHtmlHintSelectedRules, handleSelectionChange();
  $: customHtmlRuleOptions;

  const dispatch = createEventDispatcher();
  const updateHtmlRules = () => dispatch('updateHtmlRules');
  const updateHtmlHintCustomOption = () => dispatch('htmlHintThreshold');

  onMount(() => {
    initSelectedRules();
  });

  const initSelectedRules = () => {
    if (threshold?.selectedRules) {
      setSelectedRules(threshold?.selectedRules);
    } else if (htmlRules?.selectedRules) {
      setSelectedRules(htmlRules?.selectedRules);
    } else {
      htmlHintSelectedRules = htmlHintRules.map((htmlRule) => ({
        ...htmlRule,
        isChecked: true,
      }));
      customHtmlHintSelectedRules = customHtmlHintRules.map((htmlRule) => ({
        ...htmlRule,
        isChecked: true,
      }));
    }
  };

  const setSelectedRules = (rulesString) => {
    let selectedHTMLRules = rulesString.split(/[,]+/);
    htmlHintSelectedRules = htmlHintRules.map((htmlRule) => ({
      ...htmlRule,
      isChecked: selectedHTMLRules.includes(htmlRule.rule),
    }));
    customHtmlHintSelectedRules = customHtmlHintRules.map((htmlRule) => ({
      ...htmlRule,
      isChecked: selectedHTMLRules.includes(htmlRule.rule),
    }));
  };

  const selectPreset = (presetName) => {
    const preset = rulePresets.find((preset) => preset.name === presetName);
    const isWhitelist = preset.type === PresetType.Whitelist;

    htmlHintSelectedRules = htmlHintSelectedRules.map((rule) => ({
      ...rule,
      isChecked: isWhitelist
        ? preset.rules.includes(rule.rule)
        : !preset.rules.includes(rule.rule),
    }));
    customHtmlHintSelectedRules = customHtmlHintSelectedRules.map((rule) => ({
      ...rule,
      isChecked: isWhitelist
        ? preset.rules.includes(rule.rule)
        : !preset.rules.includes(rule.rule),
    }));
  };

  const getPresetSelections = (presetName) => {
    const preset = rulePresets.find((preset) => preset.name === presetName);
    const isWhitelist = preset.type === PresetType.Whitelist;
    return [
      ...htmlHintSelectedRules
        .filter((rule) => {
          return isWhitelist
            ? preset.rules.includes(rule.rule)
            : !preset.rules.includes(rule.rule);
        })
        .map((rule) => rule.rule),
      ...customHtmlHintSelectedRules
        .filter((rule) => {
          return isWhitelist
            ? preset.rules.includes(rule.rule)
            : !preset.rules.includes(rule.rule);
        })
        .map((rule) => rule.rule),
    ];
  };

  const deselectAllRules = () => {
    htmlHintSelectedRules = htmlHintSelectedRules.map((rule) => ({
      ...rule,
      isChecked: false,
    }));
    customHtmlHintSelectedRules = customHtmlHintSelectedRules.map((rule) => ({
      ...rule,
      isChecked: false,
    }));
  };

  const getSelectedRules = () => {
    return [
      ...htmlHintSelectedRules
        .filter((rule) => rule.isChecked)
        .map((rule) => rule.rule),
      ...customHtmlHintSelectedRules
        .filter((rule) => rule.isChecked)
        .map((rule) => rule.rule),
    ];
  };

  const dismiss = () => {
    show = false;
    currentlyEditingRule = '';
    initSelectedRules();
  };

  const updateCustomHtmlRules = async () => {
    const selection = getSelectedRules();
    const selectedRules = selection.toString();
    saving = true;
    if (selection.length > 0) {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules`,
        {
          method: 'POST',
          body: JSON.stringify({
            url,
            selectedRules,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        saving = false;
        show = false;
        addedSuccess = true;
        currentlyEditingRule = '';
        updateHtmlRules();
      } else {
        throw new Error('Failed to load');
      }
    } else {
      addedFail = true;
      saving = false;
    }
  };

  const handlePresetInput = (event) => {
    const value = event.target.value;

    if (presetSelection[0] === value) {
      presetSelection = [];
      deselectAllRules();
    } else {
      presetSelection = [value];
      selectPreset(value);
    }
  };

  const handleSelectionChange = () => {
    let selection = [];

    for (let i = 0; i < rulePresets.length; i++) {
      const presetName = rulePresets[i].name;
      const presetSelections = getPresetSelections(presetName);
      const selectedRules = getSelectedRules();

      if (JSON.stringify(presetSelections) === JSON.stringify(selectedRules)) {
        selection = [presetName];
        break;
      }
    }

    presetSelection = selection;
  };

  const showHistoryLog = async () => {
    showHistory = !showHistory;
    // Get all change records
    if (showHistory) {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules/${slug(
          url
        )}?isGetAllRecords=true`
      );
      historyLog = await res.json();
      // Reverse array order so latest date comes first
      historyLog.reverse();
    }
  };

  let currSelectedLog = -1;
  const toggleViewChanges = (index) => {
    currSelectedLog = index;
  };

  const formatHtmlRule = (rules) => {
    let selectedHtmlHintRules = rules.map((rule) =>
      htmlHintRules.find((x) => x.rule === rule)
    );
    let selectedCustomHtmlHintRules = rules.map((rule) =>
      customHtmlHintRules.find((x) => x.rule === rule)
    );
    let allSelectedRuleLog = selectedHtmlHintRules
      .concat(selectedCustomHtmlHintRules)
      .filter((x) => x);
    let allHtmlRules = htmlHintRules.concat(customHtmlHintRules);
    return allHtmlRules.map((rule) => ({
      ...rule,
      isRuleEnabled: allSelectedRuleLog.includes(rule),
    }));
  };
</script>

<Modal
  bind:show
  bind:loading={saving}
  header="Enable/Disable Rules:"
  mainAction="Save"
  on:action={updateCustomHtmlRules}
  on:dismiss={dismiss}
>
  {#if loading}
    <LoadingFlat />
  {:else}
    <!-- else content here -->
    {#if showHistory}
      <div
        class="mb-4 link cursor-pointer"
        on:click={() => showHistoryLog()}
        on:keypress
      >
        <i class="fas fa-arrow-left" />
        Back
      </div>
      {#each historyLog as log, index}
        <div class="mb-4 overflow-hidden border">
          <div class="content-center px-6 py-4">
            <div class="font-sans font-bold">
              Changes made on {new Date(log.timestamp).toLocaleString()}
            </div>
            {#if currSelectedLog !== index}
              <div
                class="link cursor-pointer"
                on:click={() => toggleViewChanges(index)}
                on:keypress
              >
                View Changes
              </div>
            {/if}
            {#if currSelectedLog === index}
              <div
                class="link cursor-pointer"
                on:click={() => (currSelectedLog = -1)}
                on:keypress
              >
                Hide Changes
              </div>
              <div>
                {#each formatHtmlRule(log.selectedRules.split(/[,]+/)) as rule}
                  <div
                    class={rule.isRuleEnabled ? 'text-green-600' : 'textred'}
                  >
                    <i
                      class={rule.isRuleEnabled
                        ? 'fas fa-plus'
                        : 'fas fa-minus'}
                    />
                    {rule.displayName}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    {:else}
      <div
        class="mb-4 link cursor-pointer"
        on:click={() => showHistoryLog()}
        on:keypress
      >
        <i class="fas fa-history" />
        History
      </div>
      <div class="option">
        {#each rulePresets as presetOption, index}
          <label class="inline-block mr-2">
            <input
              type="checkbox"
              name="presets"
              value={presetOption.name}
              id="option{index}"
              on:input={handlePresetInput}
              bind:group={presetSelection}
            />
            <p class="inline-block align-baseline">{presetOption.name}</p>
          </label>
        {/each}
      </div>
      <h3 class="font-bold mb-2">HTML Hint Rules:</h3>
      {#each htmlHintSelectedRules as rule}
        <RuleItem
          {rule}
          customHtmlRuleOptions={customHtmlRuleOptions.find((x) => x.ruleId === rule.rule)}
          {user}
          {url}
          isEditing={currentlyEditingRule === rule.rule}
          on:updateHtmlHintCustomOption={updateHtmlHintCustomOption}
          on:saving={(e) => (saving = e.detail)}
          on:updateCurrentlyEditingRule={(e) =>
            (currentlyEditingRule = e.detail ? rule.rule : '')}
        />
      {/each}
      <br />
      <h3 class="font-bold mb-2">Custom HTML Rules:</h3>
      {#each customHtmlHintSelectedRules as rule}
        <RuleItem
          {rule}
          customHtmlRuleOptions={customHtmlRuleOptions.find((x) => x.ruleId === rule.rule)}
          {user}
          {url}
          isEditing={currentlyEditingRule === rule.rule}
          on:updateHtmlHintCustomOption={updateHtmlHintCustomOption}
          on:saving={(e) => (saving = e.detail)}
          on:updateCurrentlyEditingRule={(e) =>
            (currentlyEditingRule = e.detail ? rule.rule : '')}
        />
      {/each}
    {/if}
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">HTML Rules updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>

<Toastr bind:show={addedFail}>
  <p class="font-bold">Please select at least one rule to check</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
