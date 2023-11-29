<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored, getMatchingIgnoredRules } from "../../utils/utils.js";
  import { ignoredUrls$, deleteIgnoreUrl, userSession$ } from "../../stores.js";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import Icon from "../misccomponents/Icon.svelte";
  import LoadingCircle from "../misccomponents/LoadingCircle.svelte";
  import Toastr from "../misccomponents/Toastr.svelte";
  import { tooltip } from '../misccomponents/tooltip';
  export let builds = [];
  const dispatch = createEventDispatcher();
  const ignore = url => dispatch("ignore", url);

  let reasons;
  let reasonsKeys = [];
  let hiddenRows = {};
  let ignoredChecks = {};
  let loadingChecks = {};
  let deleteUrl = '';
  let addedFailedToast = false;

  $: if (builds.length > 0) {
    reasons = groupBy(props(["statusmsg"]))(builds);
    reasonsKeys = Object.keys(reasons);

    ignoredChecks = builds.reduce((acc, val) => {
      acc[val.dst] = isInIgnored(val, $ignoredUrls$);
      return acc;
    }, {});
  }

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
      class="w-full table-auto mb-8"
      in:fade={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 200 }}>
      <thead>
        <tr>
          <th class="w-4/12 px-2 py-2">Source ({reasons[reason].length})</th>
          <th class="w-3/12 px-2 py-2">Destination</th>
          <th class="w-2/12 px-2 py-2">Anchor Text</th>
          <th class="w-1/12 px-2 py-2 text-right">Status</th>
          <th class="w-1/12 px-2 py-2 text-right">Days Unfixed</th>
          <th class="hidden md:table-cell w-1/12 px-2 py-2" title="Ignore URL in future scans" use:tooltip>Ignore</th>
        </tr>
      </thead>
      <tbody>
        {#each reasons[reason] as val}
          <tr>
            <td class="w-4/12 border px-2 py-2 break-all">
              <a
                class="inline-block align-baseline link"
                target="_blank"
                href={val.src}>
                {val.src}
              </a>
            </td>
            <td class="w-3/12 border px-2 py-2 break-all">
              <a
                class="inline-block align-baseline link"
                target="_blank"
                href={val.dst}>
                {val.dst.length < 70 ? val.dst : val.dst.substring(0, 70) + '...'}
              </a>
            </td>
            <td class="w-2/12 border px-2 py-2 break-all">{val.link || ''}</td>
            <td class="w-1/12 border px-2 py-2 text-right">
              {val.statuscode || '0'}
            </td>
            <td class="w-1/12 border px-2 py-2 text-right">
              {formatDaysUnfixed(val.daysUnfixed)}
            </td>
            <td class="hidden md:table-cell w-1/12 border px-2 py-2 text-center">
              {#if loadingChecks[val.dst]}
                <LoadingCircle />
              {:else}
                <input type="checkbox" on:click={() => toggleIgnore(val.dst)} bind:checked={ignoredChecks[val.dst]} />
              {/if}
            </td>
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