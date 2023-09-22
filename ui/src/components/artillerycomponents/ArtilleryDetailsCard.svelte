<script>
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";

  export let build = {};
  let val = build.summary;
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
          <LinkSummary value={val}/>
        </div>
  
        <div class="md:row-span-1 text-sm my-2">
          <h2><span class="font-bold font-sans textgrey">CODE</span></h2>
          <CodeSummary value={val} />
        </div>
  
        {#if val.performanceScore}
          <div class="md:row-span-1 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">LIGHTHOUSE</span>
            </h2>
            <LighthouseSummary value={val} />
          </div>
        {/if}
  
        <div class="md:row-span-1 text-sm my-2">
          <h2>
            <span class="font-bold font-sans textgrey">LOAD TEST</span>
          </h2>
          <ArtillerySummary value={val} />
        </div>
      </div>
      <div></div>
    </div>

    <div class="text-left">
      <span class="font-sans text-lg pt-2">
        Build Version: {val.buildVersion}
      </span>
    </div>
    
  </div>
</div>
