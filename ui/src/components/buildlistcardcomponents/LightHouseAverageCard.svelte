<script>
    import { getPerfScore, updateQuery } from "../../utils/utils.js";
    import { Navigate, navigateTo } from "svelte-router-spa";
    export let value = {};
    
    $: perf = getPerfScore(value[0]);
  
  </script>
  
  {#if perf.performanceScore}
  <div class="text-center" on:click={() => navigateTo(`/build/${value[0].runId}`)}>
      <span class="font-sans sm:text-sm">AVERAGE</span>
      <br>
        <span
          class="font-sans font-bold block lg:inline-block m-2 text-green-500"
          title="Average"
          class:text-red-400={perf.average < 50}>
          {perf.average.toFixed(1)}
        </span>
      </div>
{/if}
  

  
  