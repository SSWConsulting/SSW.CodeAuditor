<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../utils/utils";
  import Modal from "./Modal.svelte";
  import { navigateTo } from "svelte-router-spa";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import Icon from "./Icon.svelte";
  import Toastr from "./Toastr.svelte";
  import { createEventDispatcher } from "svelte";

  export let build = {};
  export let mode = 'url';

  const dispatch = createEventDispatcher();
  const download = () => dispatch("download");
  const perfThreshold = () => dispatch("perfThreshold");
  
</script>

<div
  class="mx-5 bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden rounded-lg shadow-sm mx-auto">
  <div class="m-8">
    <a href={build.url} target="_blank">
      <h1 class="text-3xl text-center font-semibold py-4">{build.url}</h1>
    </a>
    {#if build.buildDate}
      {#if build.totalBrokenLinks > 0}
        <p class="text-sm text-gray-600 text-center py-6">
          <button
            on:click={download}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center">
            <Icon cssClass="">
              <path
                d="M8 16a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002
                0 0116 16m-7 3l3 3m0 0l3-3m-3 3V10" />
            </Icon>
            <span class="ml-2">Download CSV</span>
          </button>
        </p>
      {/if}

      {#if build.htmlIssuesList}
        <p class="text-sm text-gray-600 text-center py-6">
          <button
            on:click={() => navigateTo('/htmlhint/' + build.runId)}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center">
            <Icon cssClass="text-red-500">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Icon>
            <span class="ml-2">
              View {build.htmlErrors || 0} Errors, {build.htmlWarnings || 0}
              Warnings
            </span>
          </button>
        </p>
      {/if}
      {#if build.performanceScore}
        <div class="mx-auto px-12 pb-8">
          <LighthouseSummary value={build} showLabel={true} />
          <div class="text-center pt-4">
            <button
              on:click={() => navigateTo('/lighthouse/' + build.runId)}
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
              px-4 rounded inline-flex items-center text-center">
              <Icon cssClass="">
                <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </Icon>
              <span class="ml-2">Lighthouse Report</span>
            </button>
            <button
              on:click={perfThreshold}
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
              mx-2 px-4 rounded inline-flex items-center text-center">
              <Icon cssClass="">
                <path
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6
                  2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3
                  9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </Icon>
              <span class="ml-2">Performance Threshold</span>
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
  <div
    class="mt-3 pt-1 flex flex-wrap mx-6 border-t justify-center items-center">
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
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 hover:bg-indigo-600
      hover:text-indigo-100 cursor-default">
      Whitelisted: {build.whiteListed.length}
    </div>

  </div>
</div>
