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
    <div class="grid grid-cols-4">
      <div class="col-span-1 text-start whitespace-no-wrap">
        <span class="block font-sans">AVERAGE</span>
        <span
          class="font-bold block lg:inline-block textgrey "
          title="Average"
          class:text-red-400={perf.average < 50}>
          {perf.average.toFixed(1)}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">PERFORMANCE</span>
        <span
          title="Performance"
          class="font-bold block lg:inline-block textgrey "
          class:text-red-400={perf.performanceScore < 50}>
          {perf.performanceScore}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">ACCESSIBILITY</span>
        <span
          class="font-bold block lg:inline-block textgrey "
          title="Accessibility"
          class:text-red-400={perf.accessibilityScore < 50}>
          {perf.accessibilityScore}
        </span>
      </div>

      <div class="col-span-1 text-start">
        <span class="block font-sans">SEO</span>
        <span
          title="SEO"
          class="font-bold block lg:inline-block textgrey "
          class:text-red-400={perf.seoScore < 50}>
          {perf.seoScore}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">PWA</span>
        <span
          class="font-bold block lg:inline-block textgrey "
          title="PWA"
          class:text-red-400={perf.pwaScore < 50}>
          {perf.pwaScore}
        </span>
      </div>
      <div class="text-start">
        <span class="block font-sans">BEST PRACTICE</span>
        <span
          class="font-bold block lg:inline-block textgrey "
          title="Best Practice"
          class:text-red-400={perf.bestPracticesScore < 50}>
          {perf.bestPracticesScore}
        </span>
      </div>
    </div>
  </div>
{/if}