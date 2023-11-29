<script>
  import { fade } from "svelte/transition";
  import Icon from "../misccomponents/Icon.svelte";
  import { groupBy, props } from "ramda";
  import { ignoredUrls$, deleteIgnoreUrl, userSession$ } from "../../stores.js";
  import { isInIgnored, getMatchingIgnoredRules } from "../../utils/utils.js";
  import { createEventDispatcher } from "svelte";
  import LoadingCircle from "../misccomponents/LoadingCircle.svelte";
  import Toastr from "../misccomponents/Toastr.svelte";
  import { tooltip } from '../misccomponents/tooltip';
  const dispatch = createEventDispatcher();

  export let builds = [];

  const ignore = url => dispatch("ignore", url);
  let destinations;
  let destinationsKeys = [];
  let ignoredChecks = {};
  let loadingChecks = {};
  let deleteUrl = '';
  let addedFailedToast = false;

  $: if (builds.length > 0) {
    destinations = groupBy(props(["dst"]))(builds);
    destinationsKeys = Object.keys(destinations);

    ignoredChecks = builds.reduce((acc, val) => {
      acc[val.dst] = isInIgnored(val, $ignoredUrls$);
      return acc;
    }, {});
  }

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

  const deleteIgnore = async (url) => {
    deleteUrl = url;
    loadingChecks[url] = true;
    const rules = getMatchingIgnoredRules(url, $ignoredUrls$);
    try {
      for await (const rule of rules) {
        await deleteIgnoreUrl(rule, $userSession$);
      }
    } catch (error) {
      addedFailedToast = true;
    } finally {
      loadingChecks[url] = false;
    }
  };

  const toggleIgnore = async (url) => {
    if (ignoredChecks[url]) {
      await deleteIgnore(url);
    } else {
      ignore(url);
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
  </div>
  {#if !hiddenRows[url]}
    <div class="font-bold textgrey ml-2">
      <i class="fas fa-ban"></i>
      <span title="Ignore URL in future scans" use:tooltip>Ignore: </span>
      {#if loadingChecks[url]}
        <LoadingCircle />
      {:else}
        <input type="checkbox" on:click={() => toggleIgnore(url)} bind:checked={ignoredChecks[url]} />
      {/if}
    </div>
    {#if destinations[url][0].daysUnfixed > -1}
      <div class="font-bold text-yellow-600 ml-2">
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

<Toastr bind:show={addedFailedToast} mode="error">
  <p class="font-bold">Failure</p>
  <p class="text-sm">
    Failed to remove
    <span class="font-bold">{deleteUrl}</span>
  </p>
</Toastr>