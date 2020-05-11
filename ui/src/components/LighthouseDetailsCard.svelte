<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import Icon from "./Icon.svelte";
  import { navigateTo } from "svelte-router-spa";
  import { printTimeDiff } from "../utils/utils";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  export let build = {};

  const download = id => {
    window.location.href = `https://urlchecker.blob.core.windows.net/lhr/${id}.json`;
  };
</script>

<div
  class="mx-5 bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden rounded-lg shadow-sm mx-auto">
  <div class="m-8">
    <a href={build.url} target="_blank">
      <h1 class="text-3xl text-center font-semibold">{build.url}</h1>
    </a>
    {#if build.buildDate}
      <div class="text-center pt-6">
        <button
          on:click={() => download(build.runId)}
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4
          rounded inline-flex items-center text-center">
          <Icon>
            <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </Icon>
          <span class="ml-2">Download Lighthouse Report</span>
        </button>

        {#if build.htmlIssuesList}
          <button
            on:click={() => navigateTo('/htmlhint/' + build.runId)}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center ml-2">
            <Icon cssClass="text-red-500">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Icon>
            <span class="ml-2">
              View {build.htmlErrors || 0} Errors, {build.htmlWarnings || 0}
              Warnings
            </span>
          </button>
        {/if}

        {#if build.totalBrokenLinks > 0}
          <button
            on:click={() => navigateTo('/build/' + build.runId)}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center">
            <Icon cssClass="text-red-500">
              <path
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656
                5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0
                00-5.656-5.656l-1.1 1.1" />
            </Icon>
            <span class="ml-2">
              View {build.uniqueBrokenLinks} Broken Links
            </span>
          </button>
        {/if}
      </div>
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

  </div>
</div>
