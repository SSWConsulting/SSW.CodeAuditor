<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { fade, fly } from "svelte/transition";
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
        <th class="px-4 py-2">Time</th>
        <th class="px-4 py-2">Url</th>
        <th class="px-4 py-2">Duration</th>
        <th class="px-4 py-2">Scanned</th>
        <th
          class="px-4 py-2"
          title="number of unique broken links out of all broken links found">
          Broken / Total
        </th>
        <th class="px-4 py-2">404</th>
        <th class="px-4 py-2" />
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-middle hover:text-blue-800"
              href={`/build/${val.runId}`}>
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
            </a>
            {val.buildId}
          </td>
          <td class="border px-4 py-2">
            {formatDistanceToNow(new Date(val.buildDate), { addSuffix: true })}
          </td>
          <td class="border px-4 py-2 text-center">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.url}>
              {val.url}
            </a>
          </td>
          <td class="border px-4 py-2 text-right">
            {printTimeDiff(+val.scanDuration)}
          </td>
          <td class="border px-4 py-2 text-right">{val.totalScanned}</td>
          <td
            class="border px-4 py-2 text-right text-red-600"
            class:text-red-600={val.totalBrokenLinks > 0}
            class:text-green-600={val.totalBrokenLinks === 0}>
            {val.uniqueBrokenLinks} / {val.totalBrokenLinks}
          </td>
          <td
            class="border px-4 py-2 text-right text-red-600"
            class:text-red-600={val.totalUnique404 > 0}
            class:text-green-600={val.totalUnique404 === 0}>
            {val.totalUnique404}
          </td>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-middle hover:text-blue-800"
              href={`/build/${val.runId}`}>
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0
                  002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2
                  2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2
                  2 0 01-2-2z" />
              </svg>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
