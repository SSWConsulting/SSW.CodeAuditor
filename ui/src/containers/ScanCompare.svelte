<script>
  import { getAllScanSummaryFromUrl } from "../stores";
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import ScanCompareListItem from "../components/scancomparecomponents/ScanCompareListItem.svelte";

  export let currentRoute;
  let allScans = [];
  let selectedScan;
  let comparisonDifferences = {};

  onMount(async () => {
    allScans = await getAllScanSummaryFromUrl(
      currentRoute.namedParams.api,
      currentRoute.namedParams.url
    );
  });

  function getDifferences() {
    if (allScans.length > 0 && selectedScan) {
      comparisonDifferences = {
        brokenLinksDifference:
          allScans[0].totalUnique404 - selectedScan.totalUnique404,
        codeWarningDifference:
          allScans[0].htmlWarnings - selectedScan.htmlWarnings,
        codeErrorDifference: allScans[0].htmlErrors - selectedScan.htmlErrors,
      };
    }
  }
</script>

<div class="container mx-auto mt-8">
  <div class="text-center text-xl font-sans mb-2">
    Comparing Scans for URL:
    <a
      href={allScans[0]?.url}
      target="_blank"
      class="underline font-bold text-gray-800 hover:text-red-600"
      >{allScans[0]?.url}</a
    >
  </div>
  <div class="grid grid-cols-2 gap-x-6 text-center mt-8">
    <div class="text-lg mb-5">Select Past Scan to compare:</div>
    <div class="text-lg mb-5">Latest Scan at</div>
    <div>
      <select
        bind:value={selectedScan}
        on:change={() => getDifferences()}
        class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500"
      >
        {#each allScans.slice(1) as scan}
          <option value={scan}>
            {format(new Date(scan.buildDate), "dd LLL y")} at {format(
              new Date(scan.buildDate),
              "h:mm bbb"
            )}
          </option>
        {/each}
      </select>
    </div>
    <div class="font-sans font-bold text-xl text-gray-900">
      {allScans.length > 0
        ? format(new Date(allScans[0].buildDate), "dd LLL y, h:mm bbb")
        : ""}
    </div>
    <div>
      {#if selectedScan}
        <ScanCompareListItem value={selectedScan} />
      {/if}
    </div>
    <div>
      {#if allScans.length > 0}
        <ScanCompareListItem value={allScans[0]} {comparisonDifferences} />
      {/if}
    </div>
  </div>
</div>
