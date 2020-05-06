<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored } from "../utils/utils.js";
  import { fade, fly } from "svelte/transition";
  import { ignoredUrlsList$ } from "../stores.js";
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";
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
  ignoredUrlsList$.subscribe(x => (ignoredPatterns = x));

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

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
    <a
      class="inline-block align-baseline text-blue-600 hover:text-blue-800"
      target="_blank"
      href={url}>
      {url}
    </a>
  </div>
  {#if !hiddenRows[url]}
    <table
      class="table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-6/12 px-4 py-2">Broken Link ({sources[url].length})</th>
          <th class="w-3/12 px-4 py-2">Anchor Text</th>
          <th class="w-1/12 px-4 py-2 text-right">Status</th>
          <th class="w-2/12 px-4 py-2 text-right">Message</th>
        </tr>
      </thead>
      <tbody>
        {#each sources[url] as val}
          <tr>
            <td
              class="whitespace-no-wrap break-all w-6/12 border px-4 py-2
              break-all">
              {#if isInIgnored(val.dst, ignoredPatterns)}
                <span
                  class="text-red-600 inline-block align-middle"
                  title="This is URL is in the ignored lists. Go to Settings to
                  remove it">
                  <Icon>
                    <path
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0
                      011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0
                      .891-1.077 1.337-1.707.707L5.586 15z"
                      clip-rule="evenodd" />
                    <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </Icon>
                </span>
              {:else}
                <button
                  title="Ignore this broken link in the next scan"
                  on:click={() => ignore(val.dst)}
                  class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
                  <Icon>
                    <path
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010
                      12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0
                      011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0
                      .891-1.077 1.337-1.707.707L5.586 15z" />
                  </Icon>
                </button>
              {/if}
              <a
                class="inline-block align-baseline text-blue-600
                hover:text-blue-800"
                target="_blank"
                href={val.dst}>
                {val.dst}
              </a>

            </td>
            <td class="w-3/12 border px-4 py-2 break-all">{val.link || ''}</td>
            <td class="w-1/12 border px-4 py-2 text-right">
              {val.statuscode || '0'}
            </td>
            <td class="w-2/12 border px-4 py-2 text-right">
              {val.statusmsg || ''}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
