<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { fade, fly } from "svelte/transition";
  import LighthouseSummary from "./LighthouseSummary.svelte";
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
      <tr>
        <th class="px-4 py-2">Build #</th>
        <th class="px-4 py-2">Url</th>
        <th class="px-4 py-2">Links</th>
        <th class="px-4 py-2">Performance</th>
        <th class="px-4 py-2" />
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr>
          <td class="border px-4 py-2">
            <span class="inline-block align-middle hover:text-blue-800">
              <Navigate to={`/build/${val.runId}`}>
                <svg
                  fill="none"
                  height="25"
                  width="25"
                  class:text-green-600={val.totalBrokenLinks === 0}
                  class:text-red-600={val.totalBrokenLinks > 0}
                  class="inline-block"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Navigate>
            </span>
            {val.buildId}
          </td>
          <td class="border px-4 py-2">
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
          <td class="border px-4 py-2 text-right">
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
          <td class="border px-4 py-2 text-center">
            <LighthouseSummary value={val} />
          </td>
          <td class="border px-4 py-2">
            <span class="inline-block align-middle hover:text-blue-800">
              <Navigate to={`/build/${val.runId}`}>
                <svg
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  class="align-middle">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2
                    0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002
                    2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0
                    01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Navigate>
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
