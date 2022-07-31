<script>
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";
  import { htmlHintRules, customHtmlHintRules } from "../../utils/utils";

  export let build = {};
  export let htmlRules;
  let val = build.summary;
  let brokenLinks = build.brokenLinks;

  let isCollapsedRules = false
  function handleClick() {
    isCollapsedRules = !isCollapsedRules
	}
</script>

<style>
  h2 {
    text-align: left;
    border-bottom: 1px dotted #000;
    line-height: 0.1em;
    margin-bottom: 15px;
  }

  h2 span {
    background: #fff;
    padding-left: 0px;
    padding-right: 10px;
  }
</style>

<div class="overflow-hidden shadow-lg my-5">
  {#if val.finalEval == 'FAIL'}
    <div class="bg-red-500 h-2" />
  {:else if val.finalEval == 'PASS'}
    <div class="bg-green-500 h-2" />
  {:else}
    <div class="bg-orange-500 h-2" />
  {/if}

  <div class="px-6 py-2">
    <div class="grid grid-cols-6">
      <div></div>
      <div class="grid grid-rows-3 col-span-4">
        <div class="md:row-span-1 text-sm my-2">
          <h2><span class="font-bold font-sans text-gray-600">LINKS</span></h2>
          <LinkSummary value={val} brokenLinks={brokenLinks.length}/>
        </div>
  
        <div class="md:row-span-1 text-sm my-2">
          <h2><span class="font-bold font-sans text-gray-600">CODE</span></h2>
          <CodeSummary value={val} />
        </div>
  
        {#if val.performanceScore}
          <div class="md:row-span-1 text-sm my-2">
            <h2>
              <span class="font-bold font-sans text-gray-600">LIGHTHOUSE</span>
            </h2>
            <LighthouseSummary value={val} />
          </div>
        {/if}
  
        <div class="md:row-span-1 text-sm my-2">
          <h2>
            <span class="font-bold font-sans text-gray-600">LOAD TEST</span>
          </h2>
          <ArtillerySummary value={val} />
        </div>
      </div>
      <div></div>
    </div>

    <!-- <span class="font-sans text-lg pt-2">
      {#if htmlRules}
        <p class="inline">HTML Rules Scanned: {htmlRules.selectedRules.split(/[,]+/).length}</p>
        <span type="button" class="inline cursor-pointer" on:click={handleClick}>
          <i class="fas fa-angle-down"></i>
        </span>
          {#if isCollapsedRules}
            {#each htmlRules.selectedRules.split(/[,]+/) as rule}
              <div class="ml-3 underline">
                {#if customHtmlHintRules.some(x => x.rule === rule)}
                  <a href="{(customHtmlHintRules.find(x => x.rule === rule)).ruleLink}">{customHtmlHintRules.find(x => x.rule === rule).displayName}</a>
                {:else if htmlHintRules.some(x => x.rule === rule)}
                  <a href="{(htmlHintRules.find(x => x.rule === rule)).ruleLink}">{htmlHintRules.find(x => x.rule === rule).displayName}</a>
                {/if}
              </div>
            {/each}
          {/if}
      {/if}
    </span> -->

    <div class="text-left">
      <span class="font-sans text-lg pt-2">
        Build Version: {val.buildVersion}
      </span>
    </div>

  </div>
</div>
