<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import addDays from "date-fns/addDays";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { fade, fly } from "svelte/transition";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import LinkSummary from "./LinkSummary.svelte";
  import CodeSummary from "./CodeSummary.svelte";
  import Icon from "./Icon.svelte";
  import { printTimeDiff } from "../utils/utils";
  export let builds = [];
  export let lastBuild;

  $: numberOfBuilds = builds.length;
  let count = builds.filter(
    x => new Date(x.buildDate) > addDays(new Date(), -30)
  ).length;
</script>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6">You have 0 scans!</div>
{:else}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      {#if lastBuild}
        <label
          class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          {count} builds in last 30 days, last build: {formatDistanceToNow(lastBuild, { addSuffix: true })}
        </label>
      {/if}
    </div>
  </div>
  <table class="table-auto mb-6">
    <thead>
      <tr class="flex">
        <th class="w-1/12 px-4 py-2">Build #</th>
        <th class="w-5/12 py-2 px-5">Url</th>
        <th class="w-3/12 px-4 py-2 font-mono">Links</th>
        <th class="w-3/12 px-4 py-2 font-mono">Html</th>
        <th class="w-3/12 px-4 py-2 font-mono">Lighthouse</th>
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr class="flex cursor-pointer">
          <td
            class="border py-2 w-1/12 mx-auto hover:bg-gray-100"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <span class="block align-middle hover:text-blue-800 text-center">
              <Icon
                cssClass={val.totalBrokenLinks === 0 ? 'inline-block text-green-600' : 'inline-block text-red-600'}>
                {#if val.totalBrokenLinks === 0}
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                {:else}
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                {/if}
              </Icon>
            </span>
            <span class="block text-center text-sm truncate">
              {val.buildId}
            </span>
          </td>
          <td
            class="border px-4 py-2 w-5/12 hover:bg-gray-100"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <a
              class="inline-block align-baseline link truncate max-w-xs text-sm"
              target="_blank"
              href={val.url}>
              {val.url}
            </a>
            <div class="text-sm pt-2">
              {formatDistanceToNow(new Date(val.buildDate), {
                addSuffix: true
              })}, took
              <span class="font-bold">{printTimeDiff(+val.scanDuration)}</span>
            </div>

          </td>
          <td
            class="border px-4 py-2 text-right w-3/12 hover:bg-gray-100"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <LinkSummary value={val} />
          </td>
          <td
            class="border px-4 py-2 text-center w-3/12 hover:bg-gray-100"
            on:click={() => navigateTo(`/htmlhint/${val.runId}`)}>
            <CodeSummary value={val} />
          </td>
          <td
            class="border px-4 py-2 text-center w-3/12 hover:bg-gray-100"
            on:click={() => navigateTo(`/lighthouse/${val.runId}`)}>
            <LighthouseSummary value={val} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
