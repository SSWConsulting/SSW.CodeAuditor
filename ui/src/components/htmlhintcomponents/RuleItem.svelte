<script>
  import { CONSTS, RuleType, customOptionInputType } from '../../utils/utils';
  import { createEventDispatcher } from 'svelte';

  export let rule;
  export let customHtmlRuleOptions;
  export let user;
  export let url;
  export let isEditing;

  let ignoredUrls = [''];
  let customOptionInput = '';
  let multiInputValues = [''];

  const dispatch = createEventDispatcher();
  const updateHtmlHintCustomOption = () =>
    dispatch('updateHtmlHintCustomOption');

  const toggleCustomOption = (editing, ruleSetting) => {
    customOptionInput = null;
    multiInputValues = [''];
    ignoredUrls = [''];
    dispatch('updateCurrentlyEditingRule', editing);
    if (ruleSetting) {
      populateCustomOptions(ruleSetting);
    }
  };

  const populateCustomOptions = (ruleSetting) => {
    if (customHtmlRuleOptions?.optionValue) {
      if (
        ruleSetting.customOptionInputType ===
        customOptionInputType.multipleTextBoxes
      ) {
        multiInputValues = customHtmlRuleOptions.optionValue.split(',');
      } else {
        customOptionInput = customHtmlRuleOptions.optionValue;
      }
    }

    if (customHtmlRuleOptions?.ignoredUrls) {
      ignoredUrls = customHtmlRuleOptions.ignoredUrls.split(',');
    }
  };

  const addCustomRuleOptions = async (
    optionValue,
    ignoredUrls,
    { rule: ruleId }
  ) => {
    dispatch('updateHtmlHintCustomOption', true);
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

    if (res.ok) {
      dispatch('updateHtmlHintCustomOption', false);
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
      multiInputValues.length > 0 && multiInputValues.every((i) => i)
        ? multiInputValues.toString()
        : customOptionInput;
    addCustomRuleOptions(optionValueInput, ignoredUrls.toString(), rule);
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
  <span class="cursor-pointer">
    <button
      class="textred px-2 py-1"
      style="border: none"
      on:click={() => toggleCustomOption(!isEditing, rule)}
      on:keypress={undefined}><i class="fas fa-pen-to-square" /> Edit</button
    >
  </span>
  <div class="bggrey ml-4 mr-5">
    {#if customHtmlRuleOptions?.optionValue || customHtmlRuleOptions?.ignoredUrls}
      <div class="p-3">
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
        {#if customHtmlRuleOptions?.ignoredUrls}
          <div>
            <span class="font-sans font-bold"> Ignored URLs: </span>
            <span class="textred">
              {customHtmlRuleOptions.ignoredUrls.split(',').length}
            </span>
          </div>
        {/if}
      </div>
    {/if}
    {#if isEditing}
      <div class="p-3">
        <form on:submit|preventDefault={handleOnSubmit(rule.rule)}>
          <div class="pb-3">
            <div>
              <span>Ignore on the following URLs:</span>
            </div>
            {#each ignoredUrls as v, i}
              <div>
                <input id={i} type="text" bind:value={v} />
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
              <select bind:value={customOptionInput}>
                {#each rule.customOptionDropdownValues as country}
                  <option value={country.code}>
                    {country.name} ({country.code})
                  </option>
                {/each}
              </select>
            {/if}
            {#if rule.customOptionInputType === customOptionInputType.singleTextBox}
              <input
                type={rule.customOptionInputValueType}
                on:input={(e) => (customOptionInput = e.target.value)}
              />
            {/if}
            {#if rule.customOptionInputType === customOptionInputType.multipleTextBoxes}
              {#each multiInputValues as v, i}
                <div>
                  <input id={i} type="text" bind:value={v} />
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
            <button class="text-white bgred px-2 py-1" type="submit"
              >Save</button
            >
            <button
              class="text-white bgdark px-2 py-1"
              on:click|preventDefault={() => {
                toggleCustomOption(false);
              }}
              on:keypress={undefined}>Cancel</button
            >
            <button
              class="px-2 py-1"
              style="border: none"
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
