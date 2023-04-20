<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored } from "../../utils/utils.js";
  import { ignoredUrls$ } from "../../stores.js";
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Icon from "../misccomponents/Icon.svelte";
  export let builds = [];
  const dispatch = createEventDispatcher();
  const ignore = url => dispatch("ignore", url);

  let reasons;
  let reasonsKeys = [];
  let hiddenRows = {};

  $: if (builds.length > 0) {
    reasons = groupBy(props(["statusmsg"]))(builds);
    reasonsKeys = Object.keys(reasons);
  }
  let ignoredPatterns = [];
  ignoredUrls$.subscribe(x => (ignoredPatterns = x));

  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);
</script>

{#each reasonsKeys as reason}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        cssClass="inline-block cursor-pointer"
        on:click={() => hideShow(reason)}>
        {#if !hiddenRows[reason]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
      Failure reason:
    </span>
    <span class="inline-block align-baseline textgrey">{reason}</span>
  </div>

  {#if !hiddenRows[reason]}
    <table
      class="table-fixed w-full md:table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-4/12 px-4 py-2">Source ({reasons[reason].length})</th>
          <th class="w-5/12 px-4 py-2">Destination</th>
          <th class="w-2/12 px-4 py-2">Anchor Text</th>
          <th class="w-1/12 px-4 py-2 text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each reasons[reason] as val}
          <tr>
            <td class="w-4/12 border px-4 py-2 break-all">
              <a
                class="inline-block align-baseline link"
                target="_blank"
                href={val.src}>
                {val.src}
              </a>
            </td>
            <td class="w-5/12 border px-4 py-2">
              <a
                class="inline-block align-baseline"
                target="_blank"
                href={val.dst}>
                {val.dst.length < 70 ? val.dst : val.dst.substring(0, 70) + '...'}
              </a>
              {#if isInIgnored(val.dst, ignoredPatterns)}
                <span
                  class="inline-block align-middle"
                  title="This is URL is in the ignored lists. Go to Settings to
                  remove it">
                  <Icon cssClass="textred">
                    <path
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0
                      015.636 5.636m12.728 12.728L5.636 5.636" />
                  </Icon>
                </span>
              {:else}
                <button
                  title="Ignore this broken link in the next scan"
                  on:click={() => ignore(val.dst)}
                  class="bg-gray-200 hover:bg-gray-400 rounded inline-flex
                  align-middle mr-3">
                  <Icon>
                    <path
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0
                      015.636 5.636m12.728 12.728L5.636 5.636" />
                  </Icon>
                </button>
              {/if}
            </td>
            <td class="w-2/12 border px-4 py-2 break-all">{val.link || ''}</td>
            <td class="w-1/12 border px-4 py-2 text-right">
              {val.statuscode || '0'}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
