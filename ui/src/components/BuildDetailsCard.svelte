<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../utils/utils";
  import Modal from "./Modal.svelte";
  import { navigateTo } from "svelte-router-spa";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import Icon from "./Icon.svelte";
  import Toastr from "./Toastr.svelte";

  export let build = {};

  $: totalHtmlIssues = (build.htmlErrors || 0) + (build.htmlWarnings || 0);
</script>

<div
  class="mx-5 bg-gray-200 pb-3 my-3 w-full justify-center items-center
  overflow-hidden rounded-lg shadow-sm mx-auto">
  <div class="mt-8 mb-4 text-center">
    <span class="text-3xl font-semibold">
      <a href={build.url} target="_blank">{build.url}</a>
    </span>

    {#if build.performanceScore}
      <div class="mx-auto px-12 pt-3">
        <LighthouseSummary value={build} showLabel={true} />
      </div>
    {/if}
  </div>
  <div class="flex flex-wrap mx-6 border-t justify-center items-center">
    {#if build.buildDate}
      <div
        class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
        text-green-600 border-green-600 cursor-default">
        {formatDistanceToNow(new Date(build.buildDate), { addSuffix: true })}
      </div>
    {/if}
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-green-600 border-green-600 cursor-default">
      Scanned: {build.totalScanned}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 cursor-default">
      Duration: {printTimeDiff(+build.scanDuration)}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 cursor-default">
      Broken: {build.totalBrokenLinks}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-red-600
      border-red-600 cursor-default">
      404 URL: {build.totalUnique404}
    </div>
    <div
      class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
      text-indigo-600 border-indigo-600 cursor-default">
      Unique Bad: {build.uniqueBrokenLinks}
    </div>
    {#if build.whiteListed}
      <div
        class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
        text-indigo-600 border-indigo-600 cursor-default">
        Whitelisted: {build.whiteListed.length}
      </div>
    {/if}
    {#if build.htmlIssuesList}
      <div
        class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
        text-red-600 border-red-600 cursor-default">
        Html Errors: {build.htmlErrors || 0}
      </div>
      <div
        class="text-xs mr-2 my-1 uppercase tracking-wider border px-2
        text-orange-600 border-orange-600 cursor-default">
        Html Warnings: {build.htmlWarnings || 0}
      </div>
    {/if}

  </div>
</div>
