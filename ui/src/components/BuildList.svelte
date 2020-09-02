<script>
  import TextField from "./TextField.svelte";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import addDays from "date-fns/addDays";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { fade, fly } from "svelte/transition";
  import LightHouseAverageCard from "./LightHouseAverageCard.svelte";
  import LinkSummaryCard from "./LinkSummaryCard.svelte";
  import CodeSummaryCard from "./CodeSummaryCard.svelte";
  import DetailListCard from "./DetailListCard.svelte";
  import Icon from "./Icon.svelte";
  import { printTimeDiff } from "../utils/utils";
  import HistoryChart from "./HistoryChart.svelte";
  import UrlSummary from "./UrlSummary.svelte";
  import { groupBy, props } from "ramda";

  export let builds = [];
  export let lastBuild;
  
  let groupUrlKey = [];
  let groupUrl;
  groupUrl = groupBy(props(["url"]))(builds);
  groupUrlKey = Object.keys(groupUrl);

  $: numberOfBuilds = builds.length;
  let count = builds.filter(
    x => new Date(x.buildDate) > addDays(new Date(), -30)
  ).length;

  let mostCurrentBuild = {
    firstBuild: builds[0],
    secondBuild: builds[1],
    thirdBuild: builds[2],
    fourthBuild: builds[3],
    fifthBuild: builds[4],
  }

  let showDetailList;
  let currCard;
  function toggle(n) {
    currCard = n;
    showDetailList = !showDetailList
  }

</script>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6">You have 0 scans!</div>
{:else}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      {#if lastBuild}
        <label
          class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          {count} builds in last 30 days, last build: {formatDistanceToNow(lastBuild, { addSuffix: true })}
        </label>
      {/if}
    </div>
  </div>

  {#each groupUrlKey as url, i}
  <div class="flex mb-4">
    <div class="flex-1 rounded overflow-hidden shadow-lg">
      <div class="flex content-center mb-4 px-6 py-4">
      <div class="w-5/6 h-12">
        <UrlSummary value={builds} url={url} />
      </div>

      <!-- <div class="w-1/6 h-12">
      <span class="font-sans">History</span>
      <br>
      <HistoryChart value={mostCurrentBuild} /> 
      </div> -->

      <div class="w-1/6 h-12">
        <LinkSummaryCard value={builds.filter(function(values) {
          return values.url == url})} />
      </div>

      <div class="w-1/6 h-12">
        <CodeSummaryCard value={builds.filter(function(values) {
          return values.url == url})} />
      </div>

      <div class="w-1/6 h-12">
        <LightHouseAverageCard value={builds.filter(function(values) {
          return values.url == url})} />
      </div>

      <div class="w-1/6 text-center h-12">
        <i class="fa fa-angle-down fa-2x" aria-hidden="true" on:click={() => toggle(i)}></i>
      </div>
  </div>

    {#if showDetailList}
    {#if currCard == i}
      <DetailListCard value={builds.filter(function(values) {
        return values.url == url})} {url} />
    {/if}
    {/if}
  
</div>
</div>
{/each}

<!-- {#each builds.filter(function(values) {
  return values.url == "https://htmlhint.com/"}) as val}
  <LinkSummary value={val} />
{/each} -->

{/if}
