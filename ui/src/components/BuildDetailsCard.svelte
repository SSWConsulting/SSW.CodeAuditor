<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../utils/utils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const download = () => dispatch("download");

  export let build = {};
</script>

<!-- eslint-disable -->

<div
  class="mx-5 bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden rounded-lg shadow-sm mx-auto">
  <div class="my-4">
    <h1 class="text-3xl text-center font-semibold">{build.url}</h1>
    {#if build.buildDate}
      {#if build.totalBrokenLinks > 0}
        <p class="text-sm text-gray-600 text-center py-3">
          <button
            on:click={download}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2
            px-4 rounded inline-flex items-center">
            <svg
              fill="none"
              stroke-linecap="round"
              width="24"
              height="24"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                d="M8 16a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002
                0 0116 16m-7 3l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span class="ml-2">Download CSV</span>
          </button>
        </p>
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

  </div>
</div>
