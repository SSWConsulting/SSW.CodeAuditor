<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored } from "../../utils/utils.js";
  import { fade, fly } from "svelte/transition";
  import { ignoredUrls$ } from "../../stores.js";
  import { createEventDispatcher } from "svelte";
  import Icon from "../misccomponents/Icon.svelte";
  export let builds = [];
  const dispatch = createEventDispatcher();
  const ignore = url => dispatch("ignore", url);

  let sources;
  let sourcesKeys = [];

  $: if (builds.length > 0) {
    sources = groupBy(props(["src"]))(builds);
    sourcesKeys = Object.keys(sources);
  }

  let ignoredPatterns = [];
  ignoredUrls$.subscribe(x => (ignoredPatterns = x));

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

<style>
  .truncate {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

{#each sourcesKeys as url}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        on:click={() => hideShow(url)}
        cssClass="inline-block cursor-pointer">
        {#if !hiddenRows[url]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
      Broken links on:
    </span>
    <a class="inline-block align-baseline link" target="_blank" href={url}>
      {url}
    </a>
  </div>
  {#if !hiddenRows[url]}
    <table
      class="table-fixed w-full md:table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-6/12 px-4 py-2">Broken Link ({sources[url].length})</th>
          <th class="hidden md:table-cell w-3/12 px-4 py-2">Anchor Text</th>
          <th class="w-1/12 px-4 py-2 text-right">Status</th>
          <th class="hidden md:table-cell w-2/12 px-4 py-2 text-right">Message</th>
        </tr>
      </thead>
      <tbody>
        {#each sources[url] as val}
          <tr>
            <td class="w-6/12 border px-4 py-2 break-all">
              {#if isInIgnored(val.dst, ignoredPatterns)}
                <span
                  class="text-red-600 inline-block align-middle"
                  title="This is URL is in the ignored lists. Go to Settings to
                  remove it">
                  <Icon>
                    <path
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0
                      015.636 5.636m12.728 12.728L5.636 5.636" />
                  </Icon>
                </span>
              {:else}
                <button
                  title="Ignore this broken link in the next scan"
                  on:click={() => ignore(val.dst)}
                  class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
                  <Icon>
                    <path
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0
                      015.636 5.636m12.728 12.728L5.636 5.636" />
                  </Icon>
                </button>
              {/if}
              <a
                class="inline-block align-baseline link md:truncate"
                target="_blank"
                href={val.dst}>
                {val.dst.length < 70 ? val.dst : val.dst.substring(0, 70) + '...'}
              </a>

            </td>
            <td class="hidden md:table-cell w-3/12 border px-4 py-2 break-all">{val.link || ''}</td>
            <td class="w-1/12 border px-4 py-2 text-right">
              {val.statuscode || '0'}
            </td>
            <td class="hidden md:table-cell w-2/12 border px-4 py-2 text-right">
              {val.statusmsg || ''}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
