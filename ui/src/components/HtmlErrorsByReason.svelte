<script>
  import { slice, groupBy, props } from "ramda";
  import {
    isInIgnored,
    getHtmlErrorsByReason,
    HTMLERRORS
  } from "../utils/utils.js";
  import { fade, fly } from "svelte/transition";
  import { ignoredUrls$ } from "../stores.js";
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  export let errors = [];
  const dispatch = createEventDispatcher();
  const viewSource = (url, location) =>
    dispatch("viewSource", {
      url,
      location
    });

  $: reasons = getHtmlErrorsByReason(errors);

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

{#each reasons as error}
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
    <Icon
      title={HTMLERRORS.indexOf(error.error) >= 0 ? 'Error' : 'Warning'}
      cssClass={`inline-block cursor-pointer ${HTMLERRORS.indexOf(error.error) >= 0 ? 'text-red-600' : 'text-orange-600'}`}>
      {#if HTMLERRORS.indexOf(error.error) >= 0}
        <path d="M6 18L18 6M6 6l12 12" />
      {:else}
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      {/if}
    </Icon>
    <a
      class="inline align-baseline text-blue-600 hover:text-blue-800"
      target="_blank"
      href={'https://htmlhint.com/docs/user-guide/rules/' + error.error}>
      {error.error}
    </a>
  </div>
  {#if !hiddenRows[error.error]}
    <table
      class="table-auto mb-8"
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
              break-all">
              {page.url}
            </td>
            <td class="w-10/12 border px-4 py-2 break-all">
              <div class="flex flex-wrap">
                {#each slice(0, 49, page.locations) as item}
                  <div
                    class="text-xs mr-2 my-1 uppercase tracking-wider border
                    px-2 border-red-600 hover:bg-red-600 hover:text-white
                    cursor-default whitespace-no-wrap">
                    <a
                      on:click={() => viewSource(page.url, item)}
                      href="javascript:void(0)"
                      title="View source">
                      {item}
                    </a>
                  </div>
                {/each}
              </div>
              {#if page.locations.length > 50}
                <div
                  class="text-xs mr-2 my-1 tracking-wider px-2 cursor-default">
                  {page.locations.length - 50} more..
                </div>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
