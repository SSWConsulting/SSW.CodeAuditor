<script>
  import CodeSummary from "./CodeSummary.svelte";
  import LinkSummary from "./LinkSummary.svelte";
  import LighthouseSummary from "./LighthouseSummary.svelte"; 
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { format } from 'date-fns';
  import { printTimeDiff } from "../utils/utils";
  import { Navigate, navigateTo } from "svelte-router-spa";
  export let value = {};
  </script>

  <div>
      {#each value as val}
      <div class="rounded overflow-hidden shadow-lg my-5">

      <div class="grid grid-flow-row gap-1">
        <div class="bg-gray-500 h-2"></div>

      <div>
        <div class="content-center mb-4 px-6 py-4">
        <div class="grid grid-rows-2 gap-y-3 grid-flow-col" on:click={() => navigateTo(`/build/${val.runId}`)}>
          <div class="row-span-3 col-span-4">
              <span class="font-sans font-bold text-gray-800 underline">{format(new Date(val.buildDate), 'dd.MM.yyyy')}</span>
              <br>
              <span class="font-sans text-sm pt-2">Last scanned: {formatDistanceToNow(new Date(val.buildDate), {addSuffix: true})} at {format(new Date(val.buildDate), 'hh:mm')}</span>
              <br>
              <span class="font-sans text-sm pt-2">Duration: {printTimeDiff(+val.scanDuration)} </span>
              <br>
              <span class="font-sans text-sm pt-2">Scanned: {val.totalScanned} items</span>
          </div>

          <div class="row-span-1" on:click={() => navigateTo(`/build/${val.runId}`)}>
              <span class="font-bold font-sans text-base text-gray-600">LINKS</span>
              <LinkSummary value={val} />
          </div>
          
          <div class="row-span-1" on:click={() => navigateTo(`/build/${val.runId}`)}>
            <span class="font-bold font-sans text-base text-gray-600">CODE</span>
              <CodeSummary value={val} />
          </div>

          <div class="row-span-1" on:click={() => navigateTo(`/build/${val.runId}`)}>
            <span class="font-bold font-sans text-base text-gray-600">LIGHTHOUSE</span>
              <LighthouseSummary value={val} />
          </div>
        
        </div>
      </div> 
        </div>
      </div>
    </div>

      {/each}
  </div>
