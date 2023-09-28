<script>
  import {
   getCodeSummary,
  } from "../../utils/utils";
  import { tooltip } from '../misccomponents/tooltip';
  export let value = {};

  function numberWithCommas(x) {
    return x.toLocaleString()
  }

  $: codeSummary = getCodeSummary(value);
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 text-center text-lg">
  {#if codeSummary.cloc}
    <div class="col-span-1">
      <span class="block whitespace-nowrap font-sans">Total Files</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of files">
        {codeSummary.totalFiles}
      </span>
    </div>
    <div class="col-span-1">
      <span class="block whitespace-nowrap font-sans">Total Lines</span>
      <span
        class="font-sans font-bold block lg:inline-block"
        title="Number of lines of codes">
        {codeSummary.totalLines}
      </span>
    </div>
  {/if}

  {#if codeSummary.htmlWarnings || codeSummary.htmlErrors}
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">
      <i class="fas fa-exclamation-triangle" style="color: #d69e2e"></i>
      Warnings
    </span>
    <span
      class="font-sans font-bold block lg:inline-block"
      class:text-yellow-600={codeSummary.htmlWarnings > 0}
      class:textgrey={codeSummary.htmlWarnings == 0}
      title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
      {numberWithCommas((codeSummary.htmlWarnings || 0) + (codeSummary.codeWarnings || 0))}
      {#if codeSummary.htmlWarnings == 0}
        <i class="fas fa-check"></i>
      {/if}
    </span>
  </div>
    <div class="col-span-1">
      <span class="block whitespace-nowrap font-sans">
        <i class="textred fas fa-exclamation-circle"></i>
        Errors
      </span>
      <span
        class="font-sans font-bold block lg:inline-block"
        class:text-red-600={codeSummary.htmlErrors > 0}
        class:textgrey={codeSummary.htmlErrors === 0}
        title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
        {numberWithCommas((codeSummary.htmlErrors || 0) + (codeSummary.codeErrors || 0))}
        {#if codeSummary.htmlErrors == 0}
          <i class="fas fa-check"></i>
        {/if}
      </span>
    </div>
    {:else}
    <div class="col-span-1">
      <span class="block whitespace-nowrap font-sans">Warnings
        <i class="fas fa-info-circle" title="😵" use:tooltip></i>
      </span>
      <span
        class="font-sans font-bold block lg:inline-block">
        N/A
      </span>
    </div>
    <div class="col-span-1">
      <span class="block whitespace-nowrap font-sans">Errors
        <i class="fas fa-info-circle" title="😡" use:tooltip></i>
      </span>
      <span
        class="font-sans font-bold block lg:inline-block">
        N/A
      </span>
    </div>
  {/if}
</div>
