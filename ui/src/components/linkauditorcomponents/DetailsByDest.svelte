<script>
  import { fade } from "svelte/transition";
  import Icon from "../misccomponents/Icon.svelte";
  import { groupBy, props } from "ramda";
  import { ignoredUrls$ } from "../../stores.js";
  import { isInIgnored } from "../../utils/utils.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let builds = [];

  const ignore = url => dispatch("ignore", url);
  let destinations;
  let destinationsKeys = [];

  $: if (builds.length > 0) {
    destinations = groupBy(props(["dst"]))(builds);
    destinationsKeys = Object.keys(destinations);
  }

  let ignoredPatterns = [];
  ignoredUrls$.subscribe(x => (ignoredPatterns = x));

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);

  const formatDaysUnfixed = (daysNum) => {
    if (daysNum === 0) {
      return 'Unfixed for <1 day';
    } else if (daysNum > 0) {
      return `Unfixed for ${daysNum} days`;
    } else {
      return '';
    }
  };
</script>

{#each destinationsKeys as url}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <Icon
        cssClass="inline-block cursor-pointer"
        on:click={() => hideShow(url)}>
        {#if !hiddenRows[url]}
          <path d="M19 9l-7 7-7-7" />
        {:else}
          <path d="M9 5l7 7-7 7" />
        {/if}
      </Icon>
      {destinations[url][0].statusmsg} ({destinations[url][0].statuscode || 0})
      :
    </span>
    <a class="mr-2 inline-block align-baseline link" target="_blank" href={url}>
      {url}
    </a>
    {#if isInIgnored(url, ignoredPatterns)}
      <span
        title="This is URL is in the ignored lists. Go to Settings to remove it">
        <Icon cssClass="text-red-600 inline-block">
          <path
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636
            5.636m12.728 12.728L5.636 5.636" />
        </Icon>
      </span>
    {:else}
      <button
        title="Ignore this broken link in the next scan"
        on:click={() => ignore(url)}
        class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
        <Icon>
          <path
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636
            5.636m12.728 12.728L5.636 5.636" />
        </Icon>
      </button>
    {/if}
  </div>
  {#if !hiddenRows[url]}
    {#if destinations[url][0].daysUnfixed > -1}
    <div class="font-bold textgrey ml-2">
      <i class="fas fa-exclamation-triangle"></i>
      {formatDaysUnfixed(destinations[url][0].daysUnfixed)}
    </div>
    {/if}
    <table
      class="table-fixed w-full md:table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-6/12 px-4 py-2">
            Found on Page ({destinations[url].length})
          </th>
          <th class="w-6/12 px-4 py-2">Anchor Text</th>
        </tr>
      </thead>
      <tbody>
        {#each destinations[url] as val}
          <tr>
            <td class="w-6/12 border px-4 py-2 break-all">
              <a
                class="link inline-block align-baseline link"
                target="_blank"
                href={val.src}>
                {val.src}
              </a>
            </td>
            <td class="w-6/12 border px-4 py-2 break-all">{val.link || ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/each}
