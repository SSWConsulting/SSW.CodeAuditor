<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { fade, fly } from "svelte/transition";
  import LighthouseSummary from "./LighthouseSummary.svelte";
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
        <th class="w-3/12 px-4 py-2">Links</th>
        <th class="w-3/12 px-4 py-2">Performance</th>
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
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </Icon>
              </Navigate>
            </span>
            <span class="block text-center">{val.buildId}</span>
          </td>
          <td class="border px-4 py-2 w-5/12">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
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
            <div class="grid grid-cols-3 gap-2 row-gap-2">
              <div class="text-center">
                <span class="block font-mono">Scanned</span>
                <span class="font-bold text-xl block">{val.totalScanned}</span>
              </div>
              <div class="text-center">
                <span class="block whitespace-no-wrap font-mono">Bad</span>
                <span
                  class="font-bold text-xl whitespace-no-wrap"
                  class:text-red-600={val.totalBrokenLinks > 0}
                  class:text-green-600={val.totalBrokenLinks === 0}>
                  {val.uniqueBrokenLinks} / {val.totalBrokenLinks}
                </span>
              </div>
              <div class="text-center">
                <span class="block whitespace-no-wrap font-mono">404</span>
                <span
                  class="font-bold text-xl"
                  class:text-red-600={val.totalUnique404 > 0}
                  class:text-green-600={val.totalUnique404 === 0}>
                  {val.totalUnique404}
                </span>
              </div>
            </div>
          </td>
          <td class="border px-4 py-2 text-center w-3/12">
            <LighthouseSummary value={val} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
