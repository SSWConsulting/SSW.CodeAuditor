<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
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
</script>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6">You have 0 scans!</div>
{:else}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      {#if lastBuild}
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          Last build: {formatDistanceToNow(lastBuild, { addSuffix: true })}
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
        <th class="w-3/12 px-4 py-2 font-mono">Code</th>
        <th class="w-3/12 px-4 py-2 font-mono">Performance</th>
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr
          class="flex hover:bg-gray-200 cursor-pointer"
          on:click={() => navigateTo(`/build/${val.runId}`)}>
          <td class="border py-2 w-1/12 mx-auto">
            <span class="block align-middle hover:text-blue-800 text-center">
              <Navigate to={`/build/${val.runId}`}>
                <Icon
                  cssClass={val.totalBrokenLinks === 0 ? 'inline-block text-green-600' : 'inline-block text-red-600'}>
                  {#if val.totalBrokenLinks === 0}
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  {:else}
                    <path
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  {/if}
                </Icon>
              </Navigate>
            </span>
            <span class="block text-center text-sm truncate">
              {val.buildId}
            </span>
          </td>
          <td class="border px-4 py-2 w-5/12">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800 truncate max-w-xs text-sm"
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
          <td class="border px-4 py-2 text-right w-3/12">
            <LinkSummary value={val} />
          </td>
          <td class="border px-4 py-2 text-center w-3/12">
            <CodeSummary value={val} />
          </td>
          <td class="border px-4 py-2 text-center w-3/12">
            <LighthouseSummary value={val} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
