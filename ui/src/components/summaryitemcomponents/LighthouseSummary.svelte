<script>
  import { getPerfScore } from "../../utils/utils.js";
  export let value = {};
  $: perf = getPerfScore(value);
</script>

{#if perf.performanceScore}
  <!-- content here -->
  <div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-5">
      <div class="col-span-1 text-start whitespace-no-wrap">
        <span class="block font-sans">Average</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="Average"
          class:text-red-400={perf.average < 50}>
          {perf.average.toFixed(1)}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">Performance</span>
        <span
          title="Performance"
          class="font-bold block lg:inline-block textgrey"
          class:text-red-400={perf.performanceScore < 50}>
          {perf.performanceScore}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">Accessibility</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="Accessibility"
          class:text-red-400={perf.accessibilityScore < 50}>
          {perf.accessibilityScore}
        </span>
      </div>

      <div class="col-span-1 text-start">
        <span class="block font-sans">SEO</span>
        <span
          title="SEO"
          class="font-bold block lg:inline-block textgrey"
          class:text-red-400={perf.seoScore < 50}>
          {perf.seoScore}
        </span>
      </div>
      <div class="col-span-1 text-start">
        <span class="block font-sans">PWA</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="PWA"
          class:text-red-400={perf.pwaScore < 50}>
          {perf.pwaScore}
        </span>
      </div>
      <div class="text-start">
        <span class="block font-sans">Best Practice</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="Best Practice"
          class:text-red-400={perf.bestPracticesScore < 50}>
          {perf.bestPracticesScore}
        </span>
      </div>
    </div>
  </div>
{/if}
