<script>
  import { slice, groupBy, props } from "ramda";
  import { isInIgnored, getHtmlErrorsByReason } from "../utils/utils.js";
  import { fade, fly } from "svelte/transition";
  import { ignoredUrls$ } from "../stores.js";
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  export let errors = [];

  let reasons;
  $: {
    reasons = getHtmlErrorsByReason(errors);
    console.log(reasons);
  }

  let hiddenRows = {};
  const hideShow = key => {
    if (key in hiddenRows) {
      hiddenRows[key] = !hiddenRows[key];
    } else {
      hiddenRows[key] = true;
    }
  };
</script>

{#each reasons as error}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        on:click={() => hideShow(error.error)}
        cssClass="inline-block cursor-pointer">
        {#if hiddenRows[error.error]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
    </span>
    <span class="inline-block align-baseline text-blue-600 hover:text-blue-800">
      {error.error}
    </span>
  </div>
  {#if hiddenRows[error.error]}
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
              <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
                {#each slice(0, 49, page.locations) as item}
                  <div
                    class="text-xs mr-2 my-1 uppercase tracking-wider border
                    px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600
                    hover:text-indigo-100 cursor-default">
                    {item}
                  </div>
                {/each}
              </div>
              {#if page.locations.length > 50}
                <div
                  class="text-xs mr-2 my-1 tracking-wider px-2 text-indigo-600
                  cursor-default">
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
