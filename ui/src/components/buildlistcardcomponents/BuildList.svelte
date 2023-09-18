<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import addDays from "date-fns/addDays";
  import DetailListCard from "../detailcardcomponents/DetailListCard.svelte";
  import HistoryChart from "./HistoryChart.svelte";
  import UrlSummaryCard from "./UrlSummaryCard.svelte";
  import { groupBy, props } from "ramda";
  import { historyChartType } from "../../utils/utils";

  export let builds = [];
  export let lastBuild;

  let showTotalBuild = false;
  let groupUrlKey = [];
  let groupUrl;
  groupUrl = groupBy(props(["url"]))(builds);
  groupUrlKey = Object.keys(groupUrl);

  $: numberOfBuilds = builds.length;
  let count = builds.filter(
    x => new Date(x.buildDate) > addDays(new Date(), -30)
  ).length;

  let currCard;
  function toggle(n) {
    currCard = n;
    showTotalBuild = !showTotalBuild;
    const x = document.getElementById("detailCard");

    if (x) {
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
  }
</script>

<style>
  .container {
    transition: 0.3s;
  }

  .container:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
</style>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6">You have 0 scans!</div>
{:else}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      {#if lastBuild}
        <label
          class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          {count} builds in last 30 days, last build: {formatDistanceToNow(
            lastBuild,
            { addSuffix: true }
          )}
        </label>
      {/if}
    </div>
  </div>

  {#each groupUrlKey as url, i}
    <div class="grid grid-rows-2 gap-y-1">
      <div class="row-span-2">
        <div class="container flex-wrap mb-4 overflow-hidden border">
          <div
            class="sm:flex-1 md:flex-1 lg:flex xl:flex content-center mb-4 px-6
            py-4">
            <div class="xl:w-3/6 lg:w-4/6 text-center">
              <div>
                <UrlSummaryCard value={groupUrl[url]} {url} />
              </div>
              <div>
                <span
                type="button"
                class="hover:bg-gray-300 border-0 rounded-md px-3 py-1"
                on:click={() => toggle(i)}
                on:keydown>
                {#if showTotalBuild}
                  <i class="fas fa-angle-up"></i>
                {:else}
                  <i class="fas fa-angle-down"></i>
                {/if}
              </span>
              <p class="truncate font-sans font-bold text-xs">
                Scan History:
                {groupUrl[url].length}
              </p>
              </div>
            </div>

            <div
              class="xl:w-1/4 lg:w-1/4 h-20 hidden sm:hidden md:hidden lg:block
              xl:block">
              <HistoryChart value={groupUrl[url]} dataType={historyChartType.BadLinks} />
            </div>

            <div
              class="xl:w-1/4 lg:w-1/4 h-20 hidden sm:hidden md:hidden lg:block
              xl:block ml-5 mr-5">
              <HistoryChart value={groupUrl[url]} dataType={historyChartType.ErrorCode} />
            </div>

            <div
              class="xl:w-1/4 lg:w-1/4 h-20 hidden sm:hidden md:hidden lg:block
              xl:block ml-5">
              <HistoryChart value={groupUrl[url]} dataType={historyChartType.WarningCode} />
            </div>
          </div>
        </div>
      </div>
      {#if currCard == i}
        <div id="detailCard">
          <DetailListCard value={groupUrl[url]} />
        </div>
      {/if}
    </div>
  {/each}
{/if}
