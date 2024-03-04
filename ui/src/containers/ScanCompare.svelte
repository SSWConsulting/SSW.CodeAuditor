<script>
  import { getAllScanSummaryFromUrl, getBuildDetails } from "../stores";
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import ScanCompareListItem from "../components/scancomparecomponents/ScanCompareListItem.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { navigateTo } from "svelte-router-spa";
  import Breadcrumbs from "../components/misccomponents/Breadcrumbs.svelte";
  import { revertSpecialCharUrl } from "../utils/utils";
  import { mkConfig, generateCsv, download } from "export-to-csv";
  import Icon from "../components/misccomponents/Icon.svelte";

  export let currentRoute;
  let allScans = [];
  let selectedScan;
  let comparisonDifferences = {};
  let loading = true;
  let latestScanBrokenLinks = [];
  let secondLatestScanBrokenLinks = [];
  let isLoading = true;
  let isLoading2 = true;

  onMount(async () => {
    allScans = await getAllScanSummaryFromUrl(
      currentRoute.namedParams.api,
      revertSpecialCharUrl(currentRoute.namedParams.url)
    );

    if (allScans.length > 0) {
      selectedScan = 
        // selected scan should not compare to itself (the latest one)
        currentRoute.namedParams.buildDate && allScans[0].buildDate !== currentRoute.namedParams.buildDate ? 
        allScans.filter(scan => scan.buildDate === currentRoute.namedParams.buildDate)[0] : 
        allScans[1];
      getDifferences();
      loading = false;
    } else {
      navigateTo('/404')
    }
  });

  const getDifferences = () => {
    if (allScans.length > 0 && selectedScan) {
      comparisonDifferences = {
        brokenLinksDifference:
          allScans[0].uniqueBrokenLinks - selectedScan.uniqueBrokenLinks,
        codeWarningDifference:
          allScans[0].htmlWarnings - selectedScan.htmlWarnings,
        codeErrorDifference: allScans[0].htmlErrors - selectedScan.htmlErrors,
      };
    }
  }

  const checkExistingBrokenLinks = (latestScans, secondLatestScans) => {
    return latestScans.filter(({ dst: id1 }) => secondLatestScans.some(({ dst: id2 }) => id2 === id1));
  }

  const checkNewBrokenLinks = (latestScans, secondLatestScans) => {
    return latestScans.filter(({ dst: id1 }) => !secondLatestScans.some(({ dst: id2 }) => id2 === id1));
  }

  const downloadCSV = data => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true
    });

    const csv = generateCsv(csvConfig)(
      data.map(x => {
        delete x["etag"];
        delete x["buildId"];
        delete x["partitionKey"];
        delete x["rowKey"];
        delete x["timestamp"];
        delete x["runId"];
        delete x["buildDate"];
        delete x["apiKey"];
        delete x["daysUnfixed"];
        return x;
      })
    );
    download(csvConfig)(csv);
  };
</script>

<style>
  .select-scan {
    border: none;
    height: 27px;
  }
</style>

{#if loading}
  <LoadingFlat />
{:else}
  <div class="container mx-auto px-8 pt-6">
    <Breadcrumbs displayMode="Scan Compare" />
    <br>
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
    <div class="grid grid-cols-7 text-left my-8">
      <div class="col-start-2 col-span-2 border-black border border-opacity-25 hover:border-opacity-50 rounded px-4">
        <div class="text-lg textgrey mb-2 mt-4">Select past scan to compare:</div>
        <div class="text-lg">
          <select
            bind:value={selectedScan}
            on:change={() => getDifferences()}
            class="mb-4 p-0 textgrey text-lg font-sans font-bold cursor-pointer select-scan"
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
            <ScanCompareListItem 
              value={selectedScan} 
              on:getBrokenLinkDetails={(e) => {
                isLoading = true;
                getBuildDetails(e.detail.runId).then(res => {
                  isLoading = false; 
                  secondLatestScanBrokenLinks = res.brokenLinks
                })
              }}
            />
          {/if}
        </div>
      </div>
      <div class="flex items-center justify-center text-5xl textgrey"><i class="fas fa-angles-right"></i></div>
      <div class="col-span-2 border-black border border-opacity-25 hover:border-opacity-50 rounded px-4">
        <div class="text-lg textgrey mb-2 mt-4">Latest scan</div>
        <div
          on:click={() => navigateTo(`/build/${allScans[0].runId}`)}
          on:keydown={undefined}
          class="font-sans font-bold text-lg textgrey mb-4 p-0 cursor-pointer">
          {
            allScans.length > 0
            ? `${format(new Date(allScans[0].buildDate), "dd LLL y")} at ${format(new Date(allScans[0].buildDate), "h:mm bbb")}`
            : ""
          }
        </div>
        <hr class="mb-4">
        <div>
          {#if allScans.length > 0}
            <ScanCompareListItem 
              value={allScans[0]} 
              {comparisonDifferences} 
              on:getBrokenLinkDetails={(e) => {
                getBuildDetails(e.detail.runId).then(res => {
                  isLoading2 = false; 
                  latestScanBrokenLinks = res.brokenLinks
                })
              }} 
            />
          {/if}
        </div>
      </div>
    </div>
    {#if isLoading || isLoading2}
      <LoadingFlat />
    {:else}
    <div class="grid grid-cols-1 gap-y-4 py-6">
      <div class="float-left">
        The Latest Scan contains <strong>{checkExistingBrokenLinks(latestScanBrokenLinks, secondLatestScanBrokenLinks).length}</strong> unfixed broken links 
        and <strong>{checkNewBrokenLinks(latestScanBrokenLinks, secondLatestScanBrokenLinks).length}</strong> new broken links
      </div>
      <div class="float-left">
        <button
          on:click={() => downloadCSV(checkExistingBrokenLinks(latestScanBrokenLinks, secondLatestScanBrokenLinks))}
          title="Download CSV"
          class="bg-gray-300 hover:bg-gray-400 textdark font-bold py-1 px-1
          rounded-lg inline-flex items-center mr-4">
          <Icon cssClass="">
            <path
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </Icon>
        </button>
        <span>Download unfixed broken links from latest scan</span>
      </div>
      <div class="float-left">
        <button
          on:click={() => downloadCSV(checkNewBrokenLinks(latestScanBrokenLinks, secondLatestScanBrokenLinks))}
          title="Download CSV"
          class="bg-gray-300 hover:bg-gray-400 textdark font-bold py-1 px-1
          rounded-lg inline-flex items-center mr-4">
          <Icon cssClass="">
            <path
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </Icon>
        </button>
        <span>Download new broken links found from latest scan</span>
      </div>
    </div>
    {/if}
  </div>
{/if}