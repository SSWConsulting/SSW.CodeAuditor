<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored, getMatchingIgnoredRules } from "../../utils/utils.js";
  import { fade } from "svelte/transition";
  import { ignoredUrls$, deleteIgnoreUrl, userSession$ } from "../../stores.js";
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "../misccomponents/Icon.svelte";
  import LoadingCircle from "../misccomponents/LoadingCircle.svelte";
  import Toastr from "../misccomponents/Toastr.svelte";
  import { tooltip } from '../misccomponents/tooltip';

  export let builds = [];
  export let scanUrl;
  export let isIgnoredHidden;

  const dispatch = createEventDispatcher();
  const ignore = url => dispatch("ignore", url);

  let sources;
  let sourcesKeys = [];
  let ignoredChecks = {};
  let loadingChecks = {};
  let deleteUrl = '';
  let addedFailedToast = false;

  $: {
    sources = groupBy(props(["src"]))(builds);
    sourcesKeys = Object.keys(sources);

    ignoredChecks = builds.reduce((acc, val) => {
        acc[val.dst] = isInIgnored(val, scanUrl, $ignoredUrls$);
        return acc;
      }, {});
  }

  let hiddenRows = {};
  const hideShow = key =>
    (hiddenRows[key] = key in hiddenRows ? !hiddenRows[key] : true);

  const formatDaysUnfixed = (daysNum) => {
    if (daysNum === 0) {
      return '<1';
    } else if (daysNum > 0) {
      return daysNum.toString();
    } else {
      return '-';
    }
  };

  const deleteIgnore = async (url) => {
    deleteUrl = url;
    loadingChecks[url.dst] = true;
    const rules = getMatchingIgnoredRules(url, scanUrl, $ignoredUrls$);
    try {
      for await (const rule of rules) {
        await deleteIgnoreUrl(rule, $userSession$);
      }
    } catch (error) {
      addedFailedToast = true;
    } finally {
      loadingChecks[url.dst] = false;
    }
  };

  const toggleIgnore = async (url) => {
    if (ignoredChecks[url.dst]) {
      await deleteIgnore(url);
    } else {
      ignore(url.dst);
    }
  };
</script>

{#each sourcesKeys as url}
  {#if !(isIgnoredHidden && sources[url].every((val) => ignoredChecks[val.dst]))}
    <div class="mb-3">
      <span class="font-bold">
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
      <a class="inline-block align-baseline link" target="_blank" href={url}>{url}</a>
    </div>
    {#if !hiddenRows[url]}
      <table
        class="table-fixed w-full table-auto mb-8"
        in:fade={{ y: 100, duration: 400 }}
        out:fade={{ y: -100, duration: 200 }}>
        <thead>
          <tr>
            <th class="w-5/12 px-2 py-2">Broken Link ({sources[url].length})</th>
            <th class="hidden md:table-cell w-2/12 px-2 py-2">Anchor Text</th>
            <th class="w-1/12 px-2 py-2 text-right">Status</th>
            <th class="hidden md:table-cell w-2/12 px-2 py-2 text-right">Message</th>
            <th class="hidden md:table-cell w-1/12 px-2 py-2 text-right">Days Unfixed</th>
            <th class="hidden md:table-cell w-1/12 px-2 py-2" title="Ignore URL in future scans" use:tooltip>Ignore</th>
          </tr>
        </thead>
        <tbody>
          {#each sources[url] as val}
            {#if !(isIgnoredHidden && ignoredChecks[val.dst])}
              <tr>
                <td class="w-5/12 border px-2 py-2 break-all">
                  <a
                    class="inline-block align-baseline link"
                    target="_blank"
                    href={val.dst}>
                    {val.dst.length < 70 ? val.dst : val.dst.substring(0, 70) + '...'}
                  </a>

                </td>
                <td class="hidden md:table-cell w-2/12 border px-2 py-2 break-all">{val.link || ''}</td>
                <td class="w-1/12 border px-2 py-2 text-right">
                  {val.statuscode || '0'}
                </td>
                <td class="hidden md:table-cell w-2/12 border px-2 py-2 text-right">
                  {val.statusmsg || ''}
                </td>
                <td class="hidden md:table-cell w-1/12 border px-2 py-2 text-right">
                  {formatDaysUnfixed(val.daysUnfixed)}
                </td>
                <td class="hidden md:table-cell w-1/12 border px-2 py-2 text-center">
                  {#if loadingChecks[val.dst]}
                    <LoadingCircle />
                  {:else}
                  <input type="checkbox" on:click={() => toggleIgnore(val)} bind:checked={ignoredChecks[val.dst]} />
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
{/each}

<Toastr bind:show={addedFailedToast} mode="error">
  <p class="font-bold">Failure</p>
  <p class="text-sm">
    Failed to remove
    <span class="font-bold">{deleteUrl}</span>
  </p>
</Toastr>