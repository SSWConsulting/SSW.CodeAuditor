<script>
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import CodeSummary from "./CodeSummary.svelte";
  import LinkSummary from "./LinkSummary.svelte";
  import K6Summary from "./K6Summary.svelte";
  import ArtillerySummary from "./ArtillerySummary.svelte";
  import { htmlHintRules, customHtmlHintRules, RuleType } from "../../../../docker/rules.js";

  export let build = {};
  export let htmlRules;
  let val = build.summary;

  let isCollapsedRules = false

  let totalRulesCount = htmlHintRules.length + customHtmlHintRules.length;
  let enabledRules = [];
  let disabledRules = [];

  $: if (htmlRules?.selectedRules) {
    initSelectedRules();
  }

  function handleClick() {
    isCollapsedRules = !isCollapsedRules
	}

  const formatHtmlRule = (rules) => {
    let selectedHtmlHintRules = rules.map(rule => htmlHintRules.find(x => x.rule === rule));
    let selectedCustomHtmlHintRules = rules.map(rule => customHtmlHintRules.find(x => x.rule === rule));
    let allSelectedRuleLog = selectedHtmlHintRules.concat(selectedCustomHtmlHintRules).filter(x => x);
    let allHtmlRules = htmlHintRules.concat(customHtmlHintRules)
    return allHtmlRules.map(rule => ({...rule, isRuleEnabled: allSelectedRuleLog.includes(rule)}));
  };

  const initSelectedRules = () => {
    const rules = formatHtmlRule(htmlRules.selectedRules.split(/[,]+/));
    enabledRules = rules.filter(rule => rule.isRuleEnabled);
    disabledRules = rules.filter(rule => !rule.isRuleEnabled);
  };
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

  .status-icon {
    width: 15px;
  }

  .disabled-link {
    text-decoration-color: rgb(218 187 187);
  }
  
  .disabled-link:hover {
    text-decoration-color: #cc4141;
  }
</style>

<div class="overflow-hidden shadow-lg my-5">
  {#if val.finalEval == 'FAIL'}
    <div class="bgred h-2" />
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
          <h2><span class="font-bold font-sans textgrey">LINKS</span></h2>
          <LinkSummary value={val} />
        </div>
  
        <div class="md:row-span-1 text-sm my-2">
          <h2><span class="font-bold font-sans textgrey">CODE</span></h2>
          <CodeSummary value={val} />
        </div>
  
        {#if val.performanceScore}
          <div class="md:row-span-1 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">LIGHTHOUSE AUDIT</span>
            </h2>
            <LighthouseSummary value={val} />
          </div>
        {/if}
        
        {#if val.k6Count !== undefined}
          <div class="md:row-span-1 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">K6 LOAD TEST</span>
            </h2>
            <K6Summary value={val} />
          </div>
        {/if}
        
        {#if val.latencyP95 !== undefined}
          <div class="md:row-span-1 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">ARTILLERY LOAD TEST</span>
            </h2>
            <ArtillerySummary value={val} />
          </div>
        {/if}
      </div>
      <div></div>
    </div>

    <div class="font-sans text-lg pt-3 pb-3">
      {#if htmlRules?.selectedRules}
        <div class="mb-2">
          <span class="cursor-pointer" on:click={handleClick} on:keydown={handleClick}>
            <p class="inline">HTML Rules Scanned: {enabledRules.length} / {totalRulesCount}</p>
            <span type="button" class="inline" >
            {#if isCollapsedRules}
              <i class="fas fa-angle-up"></i>
            {:else}
              <i class="fas fa-angle-down"></i>
            {/if}
            </span>
          </span>
        </div>
        {#if isCollapsedRules}
          <ul>
            <li class="mt-2 font-bold">Enabled:</li>

          {#each enabledRules as rule}
            <li>
              <i class="status-icon fas fa-check"></i>
              <i 
                class="fas fa-md {rule.type === RuleType.Error ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"
                style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"
              ></i>
              <a
                target="_blank"
                class="{rule.ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline"  
                href="{rule.ruleLink}"
              >
                {rule.displayName}
              </a>
            </li>
          {/each}

          <li class="mt-2 font-bold">Disabled:</li>

          {#each disabledRules as rule}
          <li>
            <i class="status-icon fas fa-xmark" style="color: red"></i>
            <i 
              class="fas fa-md {rule.type === RuleType.Error ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"
              style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"
            ></i>
            <a
              target="_blank"
              class="{rule.ruleLink ? 'link' : 'hover:no-underline cursor-text'} textred disabled-link inline-block align-baseline"  
              href="{rule.ruleLink}"
            >
              {rule.displayName}
            </a>
          </li>
        {/each}
          </ul>
        {/if}
      {/if}
    </div>
  </div>
</div>
