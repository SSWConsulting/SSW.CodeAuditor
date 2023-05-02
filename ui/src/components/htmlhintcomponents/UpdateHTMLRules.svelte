<script>
  import Toastr from "../misccomponents/Toastr.svelte";
  import { CONSTS, htmlHintRules, customHtmlHintRules, RuleType } from "../../utils/utils";
  import Modal from "../misccomponents//Modal.svelte";
  import LoadingFlat from "../misccomponents/LoadingFlat.svelte";
  import { onMount, createEventDispatcher } from "svelte";

  export let url;
  export let show;
  export let loading;
  export let user;
  export let htmlRules;
  export let threshold;

  let saving;
  let addedSuccess;
  let addedFail;

	let selection = [];

  let selectOption = []

  $: selectOption, selectOption[0] === true ? selectAllRules() : deselectAllRules()
  
  // Check all selected htmlhint rules
  let htmlHintSelectedRules = []
  let customHtmlHintSelectedRules = []

  const dispatch = createEventDispatcher();
  const updateHtmlRules = () => dispatch("updateHtmlRules");
  
  onMount(() => {
    if (htmlRules) {
      let selectedHTMLRules = htmlRules.selectedRules.split(/[,]+/)
      htmlHintSelectedRules = htmlHintRules.map(htmlRule => ({...htmlRule, isChecked: selectedHTMLRules.includes(htmlRule.rule)}))
      customHtmlHintSelectedRules = customHtmlHintRules.map(htmlRule => ({...htmlRule, isChecked: selectedHTMLRules.includes(htmlRule.rule)}))
    } else {
      if (threshold) {
        let selectedHTMLRules = threshold.selectedRules.split(/[,]+/)
        htmlHintSelectedRules = htmlHintRules.map(htmlRule => ({...htmlRule, isChecked: selectedHTMLRules.includes(htmlRule.rule)}))
        customHtmlHintSelectedRules = customHtmlHintRules.map(htmlRule => ({...htmlRule, isChecked: selectedHTMLRules.includes(htmlRule.rule)}))
      }
    }
  })

  const selectAllRules = () => {
    htmlHintSelectedRules = htmlHintSelectedRules.map(rule => ({...rule, isChecked: true}))
    customHtmlHintSelectedRules = customHtmlHintSelectedRules.map(rule => ({...rule, isChecked: true}))

    htmlHintSelectedRules.forEach(htmlRule => {
      selection.push(htmlRule.rule)
    })

    customHtmlHintSelectedRules.forEach(customRule => {
      selection.push(customRule.rule)
    })
  }

  const deselectAllRules = () => {
    htmlHintSelectedRules = htmlHintSelectedRules.map(rule => ({...rule, isChecked: false}))
    customHtmlHintSelectedRules = customHtmlHintSelectedRules.map(rule => ({...rule, isChecked: false}))
    selection = []
  }
  
  const dismiss = () => (show = false);

  const updateCustomHtmlRules = async () => {
    const selectedRules = selection.toString()
    saving = true;
    if (selection.length > 0) {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules`,
        {
          method: "PUT",
          body: JSON.stringify({
            url,
            selectedRules,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (res.ok) {
        saving = false;
        show = false;
        addedSuccess = true;
        updateHtmlRules()
      } else {
        throw new Error("Failed to load");
      }
    } else {
      addedFail = true;
      saving = false
    }
  };
  
</script>

<Modal
  bind:show
  bind:loading={saving}
  header="Enabled Rules:"
  mainAction="Save"
  on:action={updateCustomHtmlRules}
  on:dismiss={dismiss}>
  {#if loading}
    <LoadingFlat />
  {:else}
    <!-- else content here -->
    <label>
      <input type="checkbox" bind:group={selectOption} value={true}/>
      <p class="inline-block align-baseline">Select All</p>
    </label>
    <h3 class="font-bold">HTML Hint Rules: </h3>
    {#each htmlHintSelectedRules as rule}
      <label>
        <input type="checkbox" bind:group={selection} bind:checked={rule.isChecked} value={rule.rule} /> 
          <a 
          class="inline-block align-baseline link" 
          href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">
            <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i> 
            {rule.displayName}
          </a>
      </label>
    {/each}
    <br />
    <h3 class="font-bold">Custom HTML Rules: </h3>
    {#each customHtmlHintSelectedRules as rule}
      <label>
        <input type="checkbox" bind:group={selection} bind:checked={rule.isChecked} value={rule.rule} /> 
          <a 
          class="{rule.ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline" 
          href={rule.ruleLink}>
            <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i> 
            {rule.displayName}
          </a>
      </label>
    {/each}
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
