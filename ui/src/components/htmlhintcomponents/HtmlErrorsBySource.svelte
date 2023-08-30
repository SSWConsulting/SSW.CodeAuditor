<script>
  import { slice } from "ramda";
  import {
    isInIgnored,
    HTMLERRORS,
    getHtmlHintIssues,
    getCodeErrorRules,
    getCodeErrorsByFile,
    getRuleLink,
    getDisplayText,
  } from "../../utils/utils.js";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Icon from "../misccomponents/Icon.svelte";

  export let errors = [];
  export let codeIssues = [];
  let showAllErrorLocations = false;
  let currentlySelectedUrl = '';
  let currentlySelectedKey = '';
  
  $: allErrors = errors.concat(getCodeErrorsByFile(codeIssues));
  $: htmlHintIssues = getHtmlHintIssues(errors);
  
  const dispatch = createEventDispatcher();
  const viewSource = (url, location, key) => {
    console.log(url, location);

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

  $: ERRORS =
    codeIssues && codeIssues.length > 0
      ? (getCodeErrorRules(codeIssues) || []).concat(HTMLERRORS)
      : HTMLERRORS;

  let hiddenRows = {};
  const viewRule = k => {
    window.open();
  };
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

{#each allErrors as url}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        on:click={() => hideShow(url.url)}
        cssClass="inline-block cursor-pointer">
        {#if !hiddenRows[url]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
      Issues found on:
    </span>
    <a class="inline-block align-baseline link" target="_blank" href={url.url}>
      {url.url}
    </a>
  </div>
  {#if !hiddenRows[url.url]}
    <table
      class="table-fixed w-full md:table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-2/12 px-4 py-2">
            Issues ({Object.keys(url.errors).length})
          </th>
          <th class="w-10/12 px-4 py-2">Locations</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.keys(url.errors) as key}
          <tr>
            <td
              class="whitespace-no-wrap break-all w-2/12 border px-4 py-2
              break-all">
              <i class="{ERRORS.indexOf(key) >= 0 ? 'fas fa-exclamation-circle fa-lg' : 'fas fa-exclamation-triangle fa-lg'}" style="{ERRORS.indexOf(key) >= 0 ? 'color: red' : 'color: #d69e2e'}"></i> 
              <a
                class="hidden md:inline-block align-baseline link"
                target="_blank"
                href={getRuleLink(key)}>
                {getDisplayText(key)}
              </a>

            </td>
            <td class="w-10/12 border px-4 py-2 break-all">
              <div class="flex flex-wrap">
                {#each slice(0, 49, url.errors[key]) as item}
                  <div
                    class="text-xs mr-2 my-1 uppercase tracking-wider border
                    px-2 border-red-600 hover:bg-red-600 hover:text-white
                    cursor-default whitespace-no-wrap">
                    <a
                      on:click={() => viewSource(url.url, item, key)}
                      href="javascript:void(0)"
                      title="View source">
                      {item}
                    </a>
                  </div>
                {/each}
                {#if showAllErrorLocations}
                  {#each url.errors[key].slice(49) as item}
                    {#if url.url === currentlySelectedUrl && key === currentlySelectedKey}
                      <div
                        class="text-xs mr-2 my-1 uppercase tracking-wider border
                        px-2 border-red-600 hover:bg-red-600 hover:text-white
                        cursor-default whitespace-no-wrap">
                        <a
                          on:click={() => viewSource(url.url, item, key)}
                          href="javascript:void(0)"
                          title="View source">
                          {item}
                        </a>
                      </div>
                    {/if}
                  {/each}
                {/if}
              </div>
              {#if url.errors[key].length > 50 && key !== currentlySelectedKey}
                <a
                  class="text-xs mr-2 my-1 tracking-wider px-2 cursor-pointer link"
                  on:click={() => {showAllErrorLocations = true, currentlySelectedUrl = url.url, currentlySelectedKey = key}}
                  href="javascript:void(0)">
                  {url.errors[key].length - 50} more..
                </a>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
