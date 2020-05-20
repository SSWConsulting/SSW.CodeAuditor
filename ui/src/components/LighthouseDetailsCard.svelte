<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import Icon from "./Icon.svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { printTimeDiff, CONSTS } from "../utils/utils";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import { createEventDispatcher } from "svelte";

  export let build = {};

  $: totalHtmlIssues = (build.htmlErrors || 0) + (build.htmlWarnings || 0);

  const dispatch = createEventDispatcher();
  const perfThreshold = () => dispatch("perfThreshold");
</script>

<div
  class="mx-5 bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden rounded-lg shadow-sm mx-auto">
  <div class="m-8 text-center">
    <span class="text-3xl font-semibold">
      <a href={build.url} target="_blank">{build.url}</a>
    </span>
    {#if build.buildDate}
      <div>
        <div class="text-center pt-6">
          <button
            on:click={perfThreshold}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center text-center">
            <Icon cssClass="">
              <path
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6
                2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3
                9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </Icon>
            <span class="ml-2">Set Performance Threshold</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
  <div class="mt-3 pt-1 flex flex-wrap mx-6 justify-center items-center">
    {#if build.buildDate}
      <div
        class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
        text-green-600 border-green-600 hover:bg-green-600 hover:text-green-100
        cursor-default">
        {formatDistanceToNow(new Date(build.buildDate), { addSuffix: true })}
      </div>
    {/if}
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-green-600 border-green-600 hover:bg-green-600 hover:text-green-100
      cursor-default">
      Scanned: {build.totalScanned}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 hover:bg-indigo-600
      hover:text-indigo-100 cursor-default">
      Duration: {printTimeDiff(+build.scanDuration)}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 hover:bg-indigo-600
      hover:text-indigo-100 cursor-default">
      Broken: {build.totalBrokenLinks}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-red-600
      border-red-600 hover:bg-red-600 hover:text-red-100 cursor-default">
      404 URL: {build.totalUnique404}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 hover:bg-indigo-600
      hover:text-indigo-100 cursor-default">
      Unique Bad: {build.uniqueBrokenLinks}
    </div>
  </div>
</div>
