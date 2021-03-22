<script>
  import Icon from "./Icon.svelte";
  import {
    getCodeIssuesDescriptions,
    getCodeSummary,
    getHtmlIssuesDescriptions,
  } from "../utils/utils.js";
  export let value = {};

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $: codeSummary = getCodeSummary(value);
</script>

<div class="grid grid-cols-2 lg:grid-cols-4">
  {#if codeSummary.cloc}
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">TOTAL FILES</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of files">
        {codeSummary.totalFiles}
      </span>
    </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">TOTAL LINES</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of lines of codes">
        {codeSummary.totalLines}
      </span>
    </div>
  {/if}

  {#if codeSummary.html || codeSummary.code}
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">CODE ERRORS</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
        {numberWithCommas((codeSummary.htmlErrors || 0) + (codeSummary.codeErrors || 0))}
      </span>
    </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">CODE WARNINGS</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
        {numberWithCommas((codeSummary.htmlWarnings || 0) + (codeSummary.codeWarnings || 0))}
      </span>
    </div>
  {/if}
</div>
