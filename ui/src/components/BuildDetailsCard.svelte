<script>
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff, getCodeSummary } from "../utils/utils";
  import Modal from "./Modal.svelte";
  import { navigateTo } from "svelte-router-spa";
  import LighthouseSummary from "./LighthouseSummary.svelte";
  import CodeSummary from "./CodeSummary.svelte";
  import LinkSummary from "./LinkSummary.svelte";
  import ArtillerySummary from "./ArtillerySummary.svelte";
  import Icon from "./Icon.svelte";
  import Toastr from "./Toastr.svelte";
  import { format } from "date-fns";

  export let build = {};
  let val = build;
  $: codeSummary = getCodeSummary(build);
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
  {#if val.finalEval === 'FAIL'}
    <div class="bg-red-500 h-2" />
  {:else if val.finalEval === 'PASS'}
    <div class="bg-green-500 h-2" />
  {:else}
    <div class="bg-orange-500 h-2" />
  {/if}

  <div class="px-6 py-2">
    <div
      class="grid grid-rows-2 grid-flow-col"
      on:click={() => navigateTo(`/build/${val.runId}`)}>
      <div class="row-span-4 col-span-2">
        <span
          class="font-sans text-base font-bold text-gray-800 underline">{format(new Date(val.buildDate), 'dd.MM.yyyy')}</span>
        <br />
        <span class="font-sans text-base pt-2">Last scanned:
          {formatDistanceToNow(new Date(val.buildDate), { addSuffix: true })}
          at
          {format(new Date(val.buildDate), 'hh:mma')}</span>
        <br />
        <span class="font-sans text-base pt-2">Duration:
          {printTimeDiff(+val.scanDuration)}
        </span>
        <br />
        <span class="font-sans text-base pt-2">Scanned:
          {val.totalScanned}
          items</span>
      </div>

      <div
        class="row-span-1 text-sm my-2"
        on:click={() => navigateTo(`/build/${val.runId}`)}>
        <h2><span class="font-bold font-sans text-gray-600">LINKS</span></h2>
        <LinkSummary value={val} />
      </div>

      <div
        class="row-span-1 text-sm my-2"
        on:click={() => navigateTo(`/build/${val.runId}`)}>
        <h2><span class="font-bold font-sans text-gray-600">CODE</span></h2>
        <CodeSummary value={val} />
      </div>

      {#if val.performanceScore}
        <div
          class="row-span-1 text-sm my-2"
          on:click={() => navigateTo(`/build/${val.runId}`)}>
          <h2>
            <span class="font-bold font-sans text-gray-600">LIGHTHOUSE</span>
          </h2>
          <LighthouseSummary value={val} />
        </div>
      {/if}

      <div
        class="row-span-1 text-sm my-2"
        on:click={() => navigateTo(`/build/${val.runId}`)}>
        <h2>
          <span class="font-bold font-sans text-gray-600">LOAD TEST</span>
        </h2>
        <ArtillerySummary value={val} />
      </div>
    </div>
  </div>
</div>
