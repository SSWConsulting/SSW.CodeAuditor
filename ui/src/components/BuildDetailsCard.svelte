<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../utils/utils";
  export let build = {};
  $: {
    console.log(build);
  }
</script>

<!-- eslint-disable -->

<div
  class="bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden max-w-2xl rounded-lg shadow-sm mx-auto">
  <div class="my-4">
    <h1 class="text-3xl text-center font-semibold">{build.url}</h1>
    {#if build.buildDate}
      <!-- content here -->
      <p class="text-sm text-gray-600 text-center py-3">
        Completed {formatDistanceToNow(new Date(build.buildDate), { addSuffix: true })}
      </p>
    {/if}
  </div>
  <div class="mt-2 pt-1 flex flex-wrap mx-6 border-t">
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
