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
        <th class="px-4 py-2">Total Scanned</th>
        <th class="px-4 py-2">Uniq Broken / Total</th>
        <th class="px-4 py-2">404 Links</th>
        <th class="px-4 py-2" />
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr>
          <td class="border px-4 py-2">{val.buildId}</td>
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
            class="border px-4 py-2 text-right text-red-600 font-bold"
            class:text-red-600={val.totalBrokenLinks > 0}
            class:text-green-600={val.totalBrokenLinks === 0}>
            {val.uniqueBrokenLinks} / {val.totalBrokenLinks}
          </td>
          <td
            class="border px-4 py-2 text-right text-red-600 font-bold"
            class:text-red-600={val.totalUnique404 > 0}
            class:text-green-600={val.totalUnique404 === 0}>
            {val.totalUnique404}
          </td>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-baseline font-bold text-blue-600
              hover:text-blue-800"
              href={`/build/${val.RowKey}`}>
              View
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
