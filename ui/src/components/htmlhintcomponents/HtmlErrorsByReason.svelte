<script>
  import { slice } from "ramda";
  import {
    getHtmlErrorsByReason,
    truncate,
    getCodeErrorRules,
    getHtmlHintIssues,
    getCodeErrorsByRule,
    HTMLERRORS,
    getRuleLink,
    getDisplayText,
  } from "../../utils/utils.js";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Icon from "../misccomponents/Icon.svelte";
  import { htmlHintRules, customHtmlHintRules } from "../../utils/utils.js";

  export let errors = [];
  export let codeIssues = [];

  let showAllErrorLocations = false;
  let currentlySelectedUrl;

  const dispatch = createEventDispatcher();

  const viewSource = (url, location, key) => {
    if (htmlHintIssues.indexOf(key) >= 0) {
      dispatch("viewSource", {
        url,
        key,
        location
      });
    } else {
      const snippet = codeIssues.filter(
        x => x.file === url && x.line === location
      )[0].snippet;

      dispatch("viewCode", {
        snippet: `// ..........\n${snippet}\n// ..........`,
        url,
        key,
        location
      });
    }
  };

  const getTotalHtmlErrorsOccurence = (pages) => {
    var sum = 0;
    for (let i = 0; i < pages.length; i++) {
      sum += pages[i].locations.length
    }
    return sum
  }

  $: reasons = getHtmlErrorsByReason(errors);
  $: allErrors = reasons.concat(getCodeErrorsByRule(codeIssues));
  $: htmlHintIssues = getHtmlHintIssues(errors);
  $: ERRORS =
    codeIssues && codeIssues.length > 0
      ? (getCodeErrorRules(codeIssues) || []).concat(HTMLERRORS)
      : HTMLERRORS;

  // Assigning key values to each rules to collapse reason line by default
  var arr = htmlHintRules.map(x => ({[x.rule]: true})).concat(customHtmlHintRules.map(x => ({[x.rule]: true})))
  let hiddenRows = {}  
  arr.forEach((x, i) => {
    Object.assign(hiddenRows, arr[i]);
  })

  const hideShow = (key) => {
    return hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true;
  }
</script>

{#each allErrors as error}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        on:click={() => hideShow(error.error)}
        cssClass="inline-block cursor-pointer">
        {#if !hiddenRows[error.error]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
    </span>
    <i class="{ERRORS.indexOf(error.error) >= 0 ? 'fas fa-exclamation-circle fa-lg' : 'fas fa-exclamation-triangle fa-lg'}" style="{ERRORS.indexOf(error.error) >= 0 ? 'color: red' : 'color: #d69e2e'}"></i> 
    <a
      class="{getRuleLink(error.error) ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline" 
      target="_blank"
      href={getRuleLink(error.error)}>
      {getDisplayText(error.error)} 
    </a>
    <span class="font-bold">({getTotalHtmlErrorsOccurence(error.pages)})</span>
  </div>
  {#if !hiddenRows[error.error]}
    <table
      class="table-fixed w-full md:table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-2/12 px-4 py-2">Page ({error.pages.length})</th>
          <th class="w-10/12 px-4 py-2">Locations (line:col)</th>
        </tr>
      </thead>
      <tbody>
        {#each error.pages as page}
          <tr>
            <td
              class="whitespace-no-wrap break-all w-2/12 border px-4 py-2
              break-all"
              title={page.url}>
              <a class="link" href={page.url}>{truncate(80)(page.url)}</a>
            </td>
            <td class="w-10/12 border px-4 py-2 break-all">
              <div class="flex flex-wrap">
                {#each slice(0, 49, page.locations) as item}
                  <div
                    class="text-xs mr-2 my-1 uppercase tracking-wider border
                    px-2 border-red-600 hover:bg-red-600 hover:text-white
                    cursor-default whitespace-no-wrap">
                    <a
                      on:click={() => viewSource(page.url, item, error.error)}
                      href="javascript:void(0)"
                      title="View source">
                      {item}
                    </a>
                  </div>
                {/each}
                {#if showAllErrorLocations}
                  {#each page.locations.slice(49) as item}
                    {#if page.url === currentlySelectedUrl}
                      <div
                        class="text-xs mr-2 my-1 uppercase tracking-wider border
                        px-2 border-red-600 hover:bg-red-600 hover:text-white
                        cursor-default whitespace-no-wrap">
                        <a
                          on:click={() => viewSource(page.url, item, error.error)}
                          href="javascript:void(0)"
                          title="View source">
                          {item}
                        </a>
                      </div>
                    {/if}
                  {/each}
                {/if}
              </div>
              {#if page.locations.length > 50 && currentlySelectedUrl !== page.url}
                <a
                  class="text-xs mr-2 my-1 tracking-wider px-2 cursor-pointer link"
                  on:click={() => {showAllErrorLocations = true, currentlySelectedUrl = page.url}}
                  href="javascript:void(0)">
                  {page.locations.length - 50} more..
                </a>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
