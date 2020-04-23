<script>
  import TextField from "./TextField.svelte";
  import { fade, fly } from "svelte/transition";

  export let builds = [];

  $: numberOfBuilds = builds.length;
</script>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6 italic">You have 0 scans!</div>
{:else}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      <label
        class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
        for="inline-full-name">
        Number of Builds:
      </label>
    </div>
    <div class="w-1/8">{numberOfBuilds}</div>
  </div>
  <table class="table-auto">
    <thead>
      <tr>
        <th class="px-4 py-2">Build #</th>
        <th class="px-4 py-2">Url</th>
        <th class="px-4 py-2">Duration (sec)</th>
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
          <td class="border px-4 py-2 text-center">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.url}>
              {val.url}
            </a>
          </td>
          <td class="border px-4 py-2 text-right">{val.scanDuration}</td>
          <td class="border px-4 py-2 text-right">{val.totalScanned}</td>
          <td class="border px-4 py-2 text-right">
            {val.uniqueBrokenLinks} / {val.totalBrokenLinks}
          </td>
          <td class="border px-4 py-2 text-right">{val.totalUnique404}</td>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-baseline font-bold text-blue-600
              hover:text-blue-800"
              href={`/build/${val.PartitionKey}/${val.RowKey}`}>
              View
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
