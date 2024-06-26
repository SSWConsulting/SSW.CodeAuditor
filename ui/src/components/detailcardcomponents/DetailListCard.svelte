<script>
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import K6Summary from "../summaryitemcomponents/K6Summary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";
  import { navigateTo } from "svelte-router-spa";
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../../utils/utils";

  export let value = {};

  function numberWithCommas(x) {
    return x.toLocaleString()
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

  .container {
    transition: 0.3s;
  }

  .container:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
</style>

{#each value as val}
  <div class="container overflow-hidden shadow-lg my-2">
    {#if val.finalEval === 'FAIL'}
      <div class="bgred h-2" />
    {:else if val.finalEval === 'PASS'}
      <div class="bg-green-500 h-2" />
    {:else}
      <div class="bg-orange-500 h-2" />
    {/if}

    <div class="px-6 py-2">
      <div
        class="grid auto-rows-auto sm:gap-auto lg:grid-flow-col sm:grid-cols-3 ml-4"
        on:click={() => navigateTo(`/build/${val.runId}`)}
        on:keydown={undefined}>
        <div class="row-span-1 lg:row-span-4 col-span-4">
          <span class="font-sans text-base font-bold textdark underline text-lg">
            {format(new Date(val.buildDate), 'dd MMM yyyy')}
          </span>
          <br />
          <span class="font-sans text-base pt-2 text-lg">
            Last scanned:
            {formatDistanceToNow(new Date(val.buildDate), { addSuffix: true })}
            at
            {format(new Date(val.buildDate), 'hh:mm aaaa')}
          </span>
          <br />
          <span class="font-sans text-base pt-2 text-lg">
            Duration:
            {printTimeDiff(+val.scanDuration)}
          </span>
          <br />
          <span class="font-sans text-base pt-2 text-lg">
            Scanned:
            {numberWithCommas(val.totalScanned)}
            items
          </span>
        </div>

        <div
          class="row-span-1 col-span-4 text-sm my-2">
          <h2>
            <span class="font-bold font-sans textgrey">LINKS</span>
          </h2>
          <LinkSummary value={val}/>
        </div>

        <div
          class="row-span-1 col-span-4 text-sm my-2">
          <h2>
            <span class="font-bold font-sans textgrey">CODE</span>
          </h2>
          <CodeSummary value={val} />
        </div>

        {#if val.k6Count !== undefined}
          <div
            class="row-span-1 col-span-4 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">K6 LOAD TEST</span>
            </h2>
            <K6Summary value={val} />
          </div>
        {/if}
        
        {#if val.latencyP95 !== undefined}
          <div
            class="row-span-1 col-span-4 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">ARTILLERY LOAD TEST</span>
            </h2>
            <ArtillerySummary value={val} />
          </div>
        {/if}

        {#if val.performanceScore}
          <div
            class="row-span-1 col-span-4 text-sm my-2">
            <h2>
              <span class="font-bold font-sans textgrey">LIGHTHOUSE</span>
            </h2>
            <LighthouseSummary value={val} />
          </div>
        {/if}
      </div>      
    </div>
  </div>
{/each}
