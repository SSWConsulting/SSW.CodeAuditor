<script>
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";
  import { htmlHintRules, customHtmlHintRules, RuleType } from "../../utils/utils";

  export let build = {};
  export let htmlRules;
  let val = build.summary;

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
      <div class="grid auto-rows-auto col-span-6 md:col-span-4">
        <div class="md:row-span-1 text-sm my-2">
          <h2><span class="font-bold font-sans text-gray-600">LINKS</span></h2>
          <LinkSummary value={val} />
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

    <div class="font-sans text-lg pt-2">
      {#if htmlRules?.selectedRules}
        <p class="inline">HTML Rules Scanned: {htmlRules.selectedRules.split(/[,]+/).length}</p>
        <span type="button" class="inline cursor-pointer" on:click={handleClick} on:keydown={handleClick}>
          <i class="fas fa-angle-down"></i>
        </span>
        {#if isCollapsedRules}
        <ol class="ml-10 list-decimal">
        {#each htmlRules.selectedRules.split(/[,]+/) as rule}
          <li>
          {#if customHtmlHintRules.some(x => x.rule === rule)}
            <i 
              class="{customHtmlHintRules.find(x => x.rule === rule).type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}"
              style="{customHtmlHintRules.find(x => x.rule === rule).type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"
            ></i>
            <a
              target="_blank"
              class="{(customHtmlHintRules.find(x => x.rule === rule)).ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline"  
              href="{(customHtmlHintRules.find(x => x.rule === rule)).ruleLink}"
            >
              {customHtmlHintRules.find(x => x.rule === rule).displayName}
            </a>
          {:else if htmlHintRules.some(x => x.rule === rule)}
            <i
              class="{htmlHintRules.find(x => x.rule === rule).type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}"
              style="{htmlHintRules.find(x => x.rule === rule).type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"
            ></i>
            <a 
              target="_blank"
              class="{(htmlHintRules.find(x => x.rule === rule)).ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline"  
              href="{(htmlHintRules.find(x => x.rule === rule)).ruleLink}"
            >
              {htmlHintRules.find(x => x.rule === rule).displayName}
            </a>
          {/if}
          </li>
        {/each}
        </ol>
        {/if}
      {/if}
    </div>

    <div class="py-4">
      <p>Build Version: {val.buildVersion}</p>
    </div>

  </div>
</div>
