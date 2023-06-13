<script>
  import { getAllScanSummaryFromUrl } from "../stores";
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import ScanCompareListItem from "../components/scancomparecomponents/ScanCompareListItem.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { navigateTo } from "svelte-router-spa";

  export let currentRoute;
  let allScans = [];
  let selectedScan;
  let comparisonDifferences = {};
  let loading = true;

  onMount(async () => {
    allScans = await getAllScanSummaryFromUrl(
      currentRoute.namedParams.api,
      currentRoute.namedParams.url
    );

    if (allScans.length > 0) {
      selectedScan = currentRoute.namedParams.buildDate ? allScans.filter(scan => scan.buildDate === currentRoute.namedParams.buildDate)[0] : allScans[1];
      getDifferences();
      loading = false;
    } else {
      navigateTo('/error')
    }
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

{#if loading}
  <LoadingFlat />
{:else}
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
      <div class="col-start-2 col-span-2 border-2 rounded px-4 border-black">
        <div class="text-lg textgrey mb-2 mt-4">Select past scan to compare:</div>
        <div>
          <select
            bind:value={selectedScan}
            on:change={() => getDifferences()}
            class="mb-4 textgrey text-lg font-sans font-bold cursor-pointer"
            style="border: none"
          >
            {#each allScans as scan}
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
      <div class="flex items-center justify-center text-5xl textgrey"><i class="fas fa-angles-right"></i></div>
      <div class="col-span-2 border-2 border-black rounded px-4">
        <div class="text-lg textgrey mb-2 mt-4">Latest scan</div>
        <div class="font-sans font-bold text-lg textgrey mb-4">
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
{/if}