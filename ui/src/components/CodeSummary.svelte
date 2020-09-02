<script>
  import {
    getCodeIssuesDescriptions,
    getCodeSummary,
    getHtmlIssuesDescriptions
  } from "../utils/utils.js";
  import { Navigate, navigateTo } from "svelte-router-spa";
  export let value = {};

  $: codeSummary = getCodeSummary(value[0]);
</script>

  {#if codeSummary.html || codeSummary.code}
    <div class="text-center" on:click={() => navigateTo(`/build/${value[0].runId}`)}>
      <span class="font-sans">Code Errors</span>
      <br>
      <span
        class="font-sans font-bold block lg:inline-block m-2"
        title={(codeSummary.codeIssueList || '') + '\n\n\n' + (codeSummary.htmlIssueList || '')}>
        {(codeSummary.htmlErrors || 0) + (codeSummary.codeErrors || 0)}
      </span>
    </div>
  {/if}

