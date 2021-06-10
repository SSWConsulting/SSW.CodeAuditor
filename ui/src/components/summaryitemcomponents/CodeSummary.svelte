<script>
  import {
   getCodeSummary,
  } from "../../utils/utils";
  export let value = {};

  function numberWithCommas(x) {
    return x.toLocaleString()
  }

  $: codeSummary = getCodeSummary(value);
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-5">
  {#if codeSummary.cloc}
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">Total Files</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of files">
        {codeSummary.totalFiles}
      </span>
    </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">Total Lines</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of lines of codes">
        {codeSummary.totalLines}
      </span>
    </div>
  {/if}

  {#if codeSummary.htmlWarnings || codeSummary.htmlErrors}
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">Warnings</span>
    <span
      class="font-sans font-bold block lg:inline-block"
      class:text-red-600={codeSummary.htmlWarnings > 0}
      class:text-black={codeSummary.htmlWarnings == 0}
      title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
      {numberWithCommas((codeSummary.htmlWarnings || 0) + (codeSummary.codeWarnings || 0))}
    </span>
  </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">Errors</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        class:text-red-600={codeSummary.htmlErrors > 0}
        class:text-black={codeSummary.htmlErrors === 0}
        title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
        {numberWithCommas((codeSummary.htmlErrors || 0) + (codeSummary.codeErrors || 0))}
      </span>
    </div>
    {:else}
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">Errors</span>
      <span
        class="font-sans font-bold block lg:inline-block">
        N/A
      </span>
    </div>
      <div class="col-span-1 text-start">
        <span class="block whitespace-no-wrap font-sans">Warnings</span>
        <span
          class="font-sans font-bold block lg:inline-block">
          N/A
        </span>
      </div>
  {/if}
</div>
