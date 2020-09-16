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
  import UrlSummaryCard from "./UrlSummaryCard.svelte";
  import { forEach, groupBy, props } from "ramda";

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

  let showDetailList;
  let currCard;
  function toggle(n) {
    currCard = n;
    showDetailList = !showDetailList
  }

</script>

<style>
  .btn {
    border: none;
    color: black;
    padding: 5px 10px;
    transition: 0.3s;
  }
  
  .btn:hover {
    background-color: #D5D5D5;
    color: white;
  }
  .container {
  transition: 0.3s;
  }

  .container:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
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
          {count} builds in last 30 days, last build: {formatDistanceToNow(lastBuild, { addSuffix: true })}
        </label>
      {/if}
    </div>
  </div>

  {#each groupUrlKey as url, i}
  <div class="grid grid-rows-2 gap-y-1">

  <div class="row-span-2">
    <div class="container">
    <div class="flex mb-4">
      <div class="flex-1 overflow-hidden shadow-lg">
      <div class="flex content-center mb-4 px-6 py-4">
      
      <div class="w-5/6 h-12">
          <UrlSummaryCard value={groupUrl[url]} {url}/>
      </div>

      <div class="w-1/6 h-12">
          <HistoryChart value={groupUrl[url]} />      
      </div>

      <div class="w-1/6 h-12 text-base text-gray-700">
          <LinkSummaryCard value={groupUrl[url]} />
      </div>

      <div class="w-1/6 h-12 text-base text-gray-700">
          <CodeSummaryCard value={groupUrl[url]} />
      </div>

      <div class="w-1/6 h-12 text-base text-gray-700">
          <LightHouseAverageCard value={groupUrl[url]} />
      </div>

      <div class="w-0.9/6 text-center h-12">
        <button class="btn" on:click={() => toggle(i)}><i class="fa fa-angle-down fa-2x" aria-hidden="true"></i></button>
      </div>

    </div>
    </div>
    </div>
    </div>
  </div>
 
  {#if showDetailList}
  {#if currCard == i}
    <div class="row-span-2">
      <div class="grid grid-rows-2 gap-y-5">
      <DetailListCard value={groupUrl[url]}/> 
      </div>
    </div>
  {/if}
  {/if}
    
</div>
{/each}
{/if}
