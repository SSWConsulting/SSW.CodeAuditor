<script>
  import { updateQuery } from "../utils/utils.js";
  import ParsedQuery from "query-string";
  import { navigateTo } from "svelte-router-spa";
  export let value = {};
  export let showLabel = false;
  $: avg =
    ((value.performanceScore +
      value.seoScore +
      value.bestPracticesScore +
      value.accessibilityScore +
      value.pwaScore) /
      5) *
    100;
</script>

{#if value.performanceScore}
  <!-- content here -->
  <div class="pt-3 px-2 py-2">
    <div class="grid grid-cols-3 gap-2 row-gap-2">
      <div class="text-center whitespace-no-wrap">
        <span class="text-lg font-mono">AVG</span>
        <span
          class="font-bold text-lg inline-block"
          title="Average"
          class:text-red-400={avg < 50}
          class:text-orange-400={avg >= 50 && avg <= 80}
          class:text-green-400={avg > 80}>
          {avg.toFixed(1)}
        </span>
      </div>
      <div class="text-center">
        <span class="text-lg font-mono">PERF</span>
        <span
          title="Performance"
          class="font-bold text-lg"
          class:text-red-400={value.performanceScore * 100 < 50}
          class:text-orange-400={value.performanceScore * 100 >= 50 && value.performanceScore * 100 <= 80}
          class:text-green-400={value.performanceScore * 100 > 80}>
          {Math.round(value.performanceScore * 100)}
        </span>
      </div>
      <div class="text-center">

        {#if showLabel}
          <span class="text-lg font-mono">Accessibility</span>
        {:else}
          <svg
            fill="none"
            class="inline-block"
            height="24"
            title="Accessibility"
            width="24"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0
              00-7-7z" />
          </svg>
        {/if}
        <span
          class="font-bold text-lg"
          title="Accessibility"
          class:text-red-400={value.accessibilityScore * 100 < 50}
          class:text-orange-400={value.accessibilityScore * 100 >= 50 && value.accessibilityScore * 100 <= 80}
          class:text-green-400={value.accessibilityScore * 100 > 80}>
          {Math.round(value.accessibilityScore * 100)}
        </span>
      </div>

      <div class="text-center">
        <span class="text-lg font-mono">SEO</span>
        <span
          title="SEO"
          class="font-bold text-lg"
          class:text-red-400={value.seoScore * 100 < 50}
          class:text-orange-400={value.seoScore * 100 >= 50 && value.seoScore * 100 <= 80}
          class:text-green-400={value.seoScore * 100 > 80}>
          {Math.round(value.seoScore * 100)}
        </span>
      </div>
      <div class="text-center">
        <span class="text-lg font-mono">PWA</span>
        <span
          class="font-bold text-lg"
          title="PWA"
          class:text-red-400={value.pwaScore * 100 < 50}
          class:text-orange-400={value.pwaScore * 100 >= 50 && value.pwaScore * 100 <= 80}
          class:text-green-400={value.pwaScore * 100 > 80}>
          {Math.round(value.pwaScore * 100)}
        </span>
      </div>
      <div class="text-center">

        {#if showLabel}
          <span class="text-lg font-mono">Best Practice</span>
        {:else}
          <svg
            class="inline-block"
            height="24"
            width="24"
            title="Best Practices"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714
              2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        {/if}
        <span
          class="font-bold text-lg"
          title="Best Practice"
          class:text-red-400={value.bestPracticesScore * 100 < 50}
          class:text-orange-400={value.bestPracticesScore * 100 >= 50 && value.bestPracticesScore * 100 <= 80}
          class:text-green-400={value.bestPracticesScore * 100 > 80}>
          {Math.round(value.bestPracticesScore * 100)}
        </span>
      </div>
    </div>
  </div>
{/if}
