<script>
  import { CONSTS, RuleType, customOptionInputType } from '../../utils/utils';
  import { createEventDispatcher } from 'svelte';

  export let rule;
  export let customHtmlRuleOptions;
  export let index;
  export let user;
  export let url;
  export let currSelectedCustomOption;

  let customOptionInput = '';
  let multiInputValues = [''];

  const dispatch = createEventDispatcher();
  const updateHtmlHintCustomOption = () =>
    dispatch('updateHtmlHintCustomOption');

  const toggleCustomOption = (i, ruleSetting) => {
    customOptionInput = null;
    multiInputValues = [''];
    dispatch('updateSelectedCustomOption', i);
    if (ruleSetting) {
      populateCustomOptions(ruleSetting);
    }
  };

  const populateCustomOptions = (ruleSetting) => {
    if (customHtmlRuleOptions && customHtmlRuleOptions.length > 0) {
      customHtmlRuleOptions.forEach((option) => {
        if (option.ruleId === ruleSetting.rule) {
          if (
            ruleSetting.customOptionInputType ===
            customOptionInputType.multipleTextBoxes
          ) {
            multiInputValues = option.optionValue.split(',');
          } else {
            customOptionInput = option.optionValue;
          }
        }
      });
    }
  };

  const addCustomRuleOptions = async (optionValue, ruleSetting) => {
    dispatch('updateHtmlHintCustomOption', true);
    const res = await fetch(
      `${CONSTS.API}/api/config/addCustomHtmlRuleOptions/${user.apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          ruleId: ruleSetting.rule,
          url,
          optionValue,
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (res.ok) {
      dispatch('updateHtmlHintCustomOption', false);
      addedSuccess = true;
      customOptionInput = null;
      multiInputValues = [''];
      toggleCustomOption(-1);
      updateHtmlHintCustomOption();
    } else {
      throw new Error('Failed to load');
    }
  };

  const handleOnSubmit = (ruleSetting) => {
    const optionValueInput =
      multiInputValues.length > 0 && multiInputValues.every((i) => i)
        ? multiInputValues.toString()
        : customOptionInput;
    addCustomRuleOptions(optionValueInput, ruleSetting);
  };

  const addField = () => {
    multiInputValues = [...multiInputValues, ''];
  };

  const removeField = (index) => {
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
      on:click={() =>
        toggleCustomOption(
          currSelectedCustomOption !== index ? index : -1,
          rule
        )}
      on:keypress={undefined}><i class="fas fa-pen-to-square" /> Edit</button
    >
  </span>
  <div class="bggrey ml-4 mr-5">
    {#if customHtmlRuleOptions && customHtmlRuleOptions.length > 0 && customHtmlRuleOptions.find((x) => x.ruleId === rule.rule)?.optionValue.length > 0}
      <div class="p-3">
        <span class="font-sans font-bold"> Applied custom option value: </span>
        <span class="textred">
          {customHtmlRuleOptions.find((x) => x.ruleId === rule.rule)
            ?.optionValue}
        </span>
      </div>
    {/if}
    {#if currSelectedCustomOption === index}
      <div class="p-3">
        <form on:submit|preventDefault={handleOnSubmit(rule)}>
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
                      on:click|preventDefault={() => removeField(i)}
                      ><i class="fas fa-minus" /></button
                    >
                  {/if}
                </div>
              {/each}
              <button
                class="textred px-2 py-1"
                style="border: none"
                on:click|preventDefault={() => addField()}>Add</button
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
                toggleCustomOption(-1);
              }}
              on:keypress={undefined}>Cancel</button
            >
            <button
              class="px-2 py-1"
              style="border: none"
              on:click|preventDefault={() => {
                addCustomRuleOptions('', rule);
              }}
              on:keypress={undefined}>Reset to default</button
            >
          </div>
        </form>
      </div>
    {/if}
  </div>
</div>
