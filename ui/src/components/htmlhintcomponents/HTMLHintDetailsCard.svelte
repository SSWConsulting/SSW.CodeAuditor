<script>
  import { createEventDispatcher } from "svelte";
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";
  import ScanSummary from "../summaryitemcomponents/ScanSummary.svelte";
  import { htmlHintRules } from "../../utils/utils";

  export let build = {};
  export let htmlRules;
  let val = build;

  const dispatch = createEventDispatcher();
  const htmlHintThreshold = () => dispatch("htmlHintThreshold");

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
    <div class="grid grid-rows-2 grid-flow-col">
      <div class="row-span-4 col-span-2">
        <ScanSummary {val} />
        <br />
        <span class="font-sans text-base pt-2">
          {#if htmlRules}
            <p class="inline">HTML Rules Scanned: {htmlRules.selectedRules.split(/[,]+/).length}</p>
            <span type="button" class="inline cursor-pointer" on:click={handleClick}>
              <i class="fas fa-angle-down"></i>
            </span>
              {#if isCollapsedRules}
                {#each htmlRules.selectedRules.split(/[,]+/) as rule}
                  <div class="ml-3 underline">
                    <a href="{(htmlHintRules.find(x => x.rule === rule)).ruleLink}">{(htmlHintRules.find(x => x.rule === rule)).displayName}</a>
                  </div>
                {/each}
              {/if}
          {/if}
        </span>
        <br />
        <br />
        {#if val.buildDate}
          <button
            on:click={htmlHintThreshold}
            class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
            border hover:border-transparent rounded">
            <span class="ml-2">Set HTML Rules For Next Scan</span>
          </button>
        {/if}
      </div>

      <div class="row-span-1 text-sm my-2">
        <h2><span class="font-bold font-sans text-gray-600">LINKS</span></h2>
        <LinkSummary value={val} />
      </div>

      <div class="row-span-1 text-sm my-2">
        <h2><span class="font-bold font-sans text-gray-600">CODE</span></h2>
        <CodeSummary value={val} />
      </div>

      {#if val.performanceScore}
        <div class="row-span-1 text-sm my-2">
          <h2>
            <span class="font-bold font-sans text-gray-600">LIGHTHOUSE</span>
          </h2>
          <LighthouseSummary value={val} />
        </div>
      {/if}

      <div class="row-span-1 text-sm my-2">
        <h2>
          <span class="font-bold font-sans text-gray-600">LOAD TEST</span>
        </h2>
        <ArtillerySummary value={val} />
      </div>
    </div>
  </div>
</div>
