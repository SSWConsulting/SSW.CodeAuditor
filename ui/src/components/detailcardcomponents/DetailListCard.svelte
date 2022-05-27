<script>
  import CodeSummary from "../summaryitemcomponents/CodeSummary.svelte";
  import LinkSummary from "../summaryitemcomponents/LinkSummary.svelte";
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import ArtillerySummary from "../summaryitemcomponents/ArtillerySummary.svelte";
  import { navigateTo } from "svelte-router-spa";
  export let value = {};

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
      <div class="bg-red-500 h-2" />
    {:else if val.finalEval === 'PASS'}
      <div class="bg-green-500 h-2" />
    {:else}
      <div class="bg-orange-500 h-2" />
    {/if}

    <div class="px-6 py-2">
      <div class="grid grid-cols-6">
        <div></div>
        <div class="grid grid-rows-3 col-span-4"
          on:click={() => navigateTo(`/build/${val.runId}`)}>
          <div
            class="row-span-1 col-span-4 text-sm my-2"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <h2>
              <span class="font-bold font-sans text-gray-600">LINKS</span>
            </h2>
            <LinkSummary value={val} />
          </div>
  
          <div
            class="row-span-1 col-span-4 text-sm my-2"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <h2>
              <span class="font-bold font-sans text-gray-600">CODE</span>
            </h2>
            <CodeSummary value={val} />
          </div>
  
          <div
            class="row-span-1 col-span-4 text-sm my-2"
            on:click={() => navigateTo(`/build/${val.runId}`)}>
            <h2>
              <span class="font-bold font-sans text-gray-600">LOAD TEST</span>
            </h2>
            <ArtillerySummary value={val} />
          </div>
  
          {#if val.performanceScore}
            <div
              class="row-span-1 col-span-4 text-sm my-2"
              on:click={() => navigateTo(`/build/${val.runId}`)}>
              <h2>
                <span class="font-bold font-sans text-gray-600">LIGHTHOUSE</span>
              </h2>
              <LighthouseSummary value={val} />
            </div>
          {/if}
        </div>
        <div></div>
      </div>

      <div class="text-left">
        <span class="font-sans text-base pt-2">
          Build Version: <strong>{val.buildVersion}</strong>
        </span>
      </div>
      
    </div>
  </div>
{/each}
