<script>
  import { CONSTS } from '../../utils/utils';
  import { RuleType, customOptionInputType } from '../../../../docker/rules.js';
  import { createEventDispatcher } from 'svelte';
  import LoadingCircle from '../misccomponents/LoadingCircle.svelte';

  export let rule;
  export let customHtmlRuleOptions;
  export let user;
  export let url;
  export let isEditing;

  let ignoredUrls = [''];
  let customOptionInput = '';
  let multiInputValues = [''];
  let loading = false;

  const dispatch = createEventDispatcher();
  const updateHtmlHintCustomOption = () =>
    dispatch('updateHtmlHintCustomOption');

  const toggleCustomOption = (editing) => {
    customOptionInput = null;
    multiInputValues = [''];
    ignoredUrls = [''];
    dispatch('updateCurrentlyEditingRule', editing);
    if (editing) {
      populateCustomOptions();
    }
  };

  const populateCustomOptions = () => {
    if (rule.customOptionInputType === customOptionInputType.multipleTextBoxes) {
      const customOptions = customHtmlRuleOptions?.optionValue ? customHtmlRuleOptions.optionValue.split(',') : (rule.customOptionDefaultValue || ['']);
      multiInputValues = [...customOptions];
    } else {
      customOptionInput = customHtmlRuleOptions?.optionValue || rule.customOptionDefaultValue || '';
    }

    ignoredUrls = customHtmlRuleOptions?.ignoredUrls ? customHtmlRuleOptions.ignoredUrls.split(',') : [''];
  };

  const addCustomRuleOptions = async (
    optionValue,
    ignoredUrls,
    { rule: ruleId }
  ) => {
    loading = true;
    const res = await fetch(
      `${CONSTS.API}/api/config/addCustomHtmlRuleOptions/${user.apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          ruleId,
          url,
          optionValue,
          ignoredUrls,
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    loading = false;

    if (res.ok) {
      customOptionInput = null;
      multiInputValues = [''];
      toggleCustomOption(false);
      updateHtmlHintCustomOption();
    } else {
      throw new Error('Failed to load');
    }
  };

  const handleOnSubmit = (rule) => {
    const optionValueInput =
      rule.customOptionInputType === customOptionInputType.multipleTextBoxes
        ? multiInputValues.filter((i) => i).toString()
        : customOptionInput;
    addCustomRuleOptions(
      optionValueInput,
      ignoredUrls.filter((i) => i).toString(),
      rule
    );
  };

  const addIgnoredUrl = () => {
    ignoredUrls = [...ignoredUrls, ''];
  };

  const removeIgnoredUrl = (index) => {
    ignoredUrls.splice(index, 1);
    ignoredUrls = ignoredUrls;
  };

  const addCustomField = () => {
    multiInputValues = [...multiInputValues, ''];
  };

  const removeCustomField = (index) => {
    multiInputValues.splice(index, 1);
    multiInputValues = multiInputValues;
  };
</script>

<div class="">
  <input type="checkbox" bind:checked={rule.isChecked} value={rule.rule} />
  <i
    class={rule.type === RuleType.Error
      ? 'fas fa-exclamation-circle fa-md'
      : 'fas fa-exclamation-triangle fa-md'}
    style={rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}
  />
  <a
    target="_blank"
    class="{rule.ruleLink
      ? 'link'
      : 'hover:no-underline cursor-text'} inline-block align-baseline"
    href={rule.ruleLink}
  >
    {rule.displayName}
  </a>
  <button
    style="border: none"
    class="textred p-0 cursor-pointer ml-1"
    on:click={() => toggleCustomOption(!isEditing)}
    on:keypress={undefined}
  >
    {#if rule.isEnableCustomOptions}
      <i class="fas fa-gear" title="Options" />
    {/if}
    <i class="fas fa-filter-circle-xmark" title="Ignore URLs" />
  </button>
  <div class="bggrey ml-4 mr-5">
    {#if !isEditing && (customHtmlRuleOptions?.optionValue || customHtmlRuleOptions?.ignoredUrls)}
      <div class="p-3">
        {#if customHtmlRuleOptions?.ignoredUrls}
          <div>
            <span class="font-sans font-bold"> Ignored URLs: </span>
            <span class="textred">
              {customHtmlRuleOptions.ignoredUrls.split(',').length}
            </span>
          </div>
        {/if}
        {#if customHtmlRuleOptions?.optionValue}
          <div>
            <span class="font-sans font-bold">
              Applied custom option value:
            </span>
            <span class="textred">
              {customHtmlRuleOptions.optionValue}
            </span>
          </div>
        {/if}
      </div>
    {/if}
    {#if isEditing}
      <div class="p-3">
        <form on:submit|preventDefault={handleOnSubmit(rule)}>
          <div class="pb-3">
            <div>
              <span>Ignore on the following URLs:</span>
            </div>
            {#each ignoredUrls as v, i}
              <div>
                <input id={i} type="url" class="w-4/5" bind:value={v} />
                {#if ignoredUrls.length > 1}
                  <button
                    class="textred px-2 py-1"
                    style="border: none"
                    on:click|preventDefault={() => removeIgnoredUrl(i)}
                    ><i class="fas fa-minus" /></button
                  >
                {/if}
              </div>
            {/each}
            <button
              class="textred px-2 py-1"
              style="border: none"
              on:click|preventDefault={() => addIgnoredUrl()}>Add</button
            >
          </div>
          {#if rule.isEnableCustomOptions}
            <div>
              {rule.customOptionsMessage}
            </div>
            {#if rule.customOptionInputType === customOptionInputType.dropDown}
              <select class="w-4/5" bind:value={customOptionInput}>
                {#each rule.customOptionDropdownValues as country}
                  <option value={country.code}>
                    {country.name} ({country.code})
                  </option>
                {/each}
              </select>
            {/if}
            {#if rule.customOptionInputType === customOptionInputType.singleTextBox}
              <input
                class="w-4/5"
                type={rule.customOptionInputValueType}
                value={customOptionInput}
                on:input={(e) => (customOptionInput = e.target.value)}
              />
            {/if}
            {#if rule.customOptionInputType === customOptionInputType.multipleTextBoxes}
              {#each multiInputValues as v, i}
                <div>
                  <input id={i} type="text" class="w-4/5" bind:value={v} />
                  {#if multiInputValues.length > 1}
                    <button
                      class="textred px-2 py-1"
                      style="border: none"
                      on:click|preventDefault={() => removeCustomField(i)}
                      ><i class="fas fa-minus" /></button
                    >
                  {/if}
                </div>
              {/each}
              <button
                class="textred px-2 py-1"
                style="border: none"
                on:click|preventDefault={() => addCustomField()}>Add</button
              >
            {/if}
          {/if}
          <div class="py-2">
            <button
              class="text-white bgred px-2 py-1"
              type="submit"
              disabled={loading}
              >Save
              {#if loading}
                <LoadingCircle />
              {/if}</button
            >
            <button
              disabled={loading}
              class="text-white bgdark px-2 py-1"
              on:click|preventDefault={() => {
                toggleCustomOption(false);
              }}
              on:keypress={undefined}>Cancel</button
            >
            <button
              class="px-2 py-1"
              style="border: none"
              disabled={loading}
              on:click|preventDefault={() => {
                addCustomRuleOptions('', '', rule);
              }}
              on:keypress={undefined}>Reset to default</button
            >
          </div>
        </form>
      </div>
    {/if}
  </div>
</div>
