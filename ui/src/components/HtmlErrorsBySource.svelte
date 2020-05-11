<script>
  import { groupBy, props, slice } from "ramda";
  import { isInIgnored } from "../utils/utils.js";
  import { fade, fly } from "svelte/transition";
  import { ignoredUrls$ } from "../stores.js";
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  export let errors = [];

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

{#each errors as url}
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
    <a
      class="inline-block align-baseline text-blue-600 hover:text-blue-800"
      target="_blank"
      href={url.url}>
      {url.url}
    </a>
  </div>
  {#if !hiddenRows[url.url]}
    <table
      class="table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-2/12 px-4 py-2">
            Issues ({Object.keys(url.errors).length})
          </th>
          <th class="w-10/12 px-4 py-2">Locations (line:col)</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.keys(url.errors) as key}
          <tr>
            <td
              class="whitespace-no-wrap break-all w-2/12 border px-4 py-2
              break-all">
              <a
                class="inline-block align-baseline text-blue-600
                hover:text-blue-800"
                target="_blank"
                href={'https://github.com/htmlhint/HTMLHint/wiki/' + key}>
                {key}
              </a>

            </td>
            <td class="w-10/12 border px-4 py-2 break-all">
              <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
                {#each slice(0, 49, url.errors[key]) as item}
                  <div
                    class="text-xs mr-2 my-1 uppercase tracking-wider border
                    px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600
                    hover:text-indigo-100 cursor-default">
                    {item}
                  </div>
                {/each}
              </div>
              {#if url.errors[key].length > 50}
                <div
                  class="text-xs mr-2 my-1 tracking-wider px-2 text-indigo-600
                  cursor-default">
                  {url.errors[key].length - 50} more..
                </div>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
