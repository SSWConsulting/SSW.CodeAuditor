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
  <div class="text-center text-3xl font-sans font-bold mb-2">
    Compare Scans:
  </div>
  <div class="text-center">
    <a
      href={allScans[0]?.url}
      target="_blank"
      class="link"
      >{allScans[0]?.url}
    </a>
  </div>
  <div class="grid grid-cols-7 text-left mt-8">
    <div class="col-start-2 col-span-2 border-2 px-4">
      <div class="text-lg text-gray-600 mb-2 mt-4">Select past scan to compare:</div>
      <div>
        <select
          bind:value={selectedScan}
          on:change={() => getDifferences()}
          class="mb-4 text-gray-900 text-lg font-sans font-bold"
          style="border: none"
        >
          {#each allScans.slice(1) as scan}
            <option value={scan}>
              {format(new Date(scan.buildDate), "dd LLL y")} at
              {format(new Date(scan.buildDate), "h:mm bbb")}
            </option>
          {/each}
        </select>
      </div>
      <hr class="mb-4">
      <div>
        {#if selectedScan}
          <ScanCompareListItem value={selectedScan} />
        {/if}
      </div>
    </div>
    <div class="flex items-center justify-center text-5xl"><i class="fas fa-angle-right"></i></div>
    <div class="col-span-2 border-2 px-4">
      <div class="text-lg text-gray-600 mb-2 mt-4">Latest scan</div>
      <div class="font-sans font-bold text-lg text-gray-900 mb-4">
        {allScans.length > 0
          ? `${format(new Date(allScans[0].buildDate), "dd LLL y")} at ${format(new Date(allScans[0].buildDate), "h:mm bbb")}`
          : ""}
      </div>
      <hr class="mb-4">
      <div>
        {#if allScans.length > 0}
          <ScanCompareListItem value={allScans[0]} {comparisonDifferences} />
        {/if}
      </div>
    </div>
  </div>
</div>
