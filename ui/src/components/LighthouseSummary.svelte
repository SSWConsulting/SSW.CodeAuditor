<script>
  import { getPerfScore, updateQuery } from "../utils/utils.js";
  import ParsedQuery from "query-string";
  import Icon from "./Icon.svelte";
  import { navigateTo } from "svelte-router-spa";
  export let value = {};
  $: perf = getPerfScore(value);
</script>

{#if perf.performanceScore}
  <!-- content here -->
  <div>
      <div class="text-center">
        <span class="font-sans">Lighthouse AVG</span>
        <br>
        <span
          class="font-sans font-bold block lg:inline-block text-green-500 m-2"
          title="Average"
          class:text-red-400={perf.average < 50}>
          {perf.average.toFixed(1)}
        </span>
      </div>
  </div>
{/if}
