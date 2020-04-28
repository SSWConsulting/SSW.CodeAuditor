<script>
  import { updateQuery } from "../utils/utils.js";
  import ParsedQuery from "query-string";
  import { navigateTo } from 'svelte-router-spa';
  export let value = {};
  export let run;
  export let showLabel = false;
</script>

{#if value.performanceScore}
  <!-- content here -->
  <div class="pt-3 border-t px-2 py-2">
    <div class="grid grid-cols-3 gap-2 row-gap-2">
      <div class="text-center">
        <svg
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="inline-block"
          height="24"
          width="24"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {#if showLabel}
          <span class="text-lg">Performance</span>
        {/if}
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
        {#if showLabel}
          <span class="text-lg">Accessibility</span>
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
            21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {#if showLabel}
          <span class="text-lg">Best Practice</span>
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
      <div class="text-center">
        <svg
          fill="none"
          class="inline-block"
          height="24"
          width="24"
          stroke-linecap="round"
          title="SEO"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0
            100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234
            9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0
            01-1.564-.317z" />
        </svg>
        {#if showLabel}
          <span class="text-lg">SEO</span>
        {/if}
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
        <svg
          fill="none"
          class="inline-block"
          height="24"
          width="24"
          title="PWA"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2
            0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {#if showLabel}
          <span class="text-lg">PWA</span>
        {/if}
        <span
          class="font-bold text-lg"
          title="PWA"
          class:text-red-400={value.pwaScore * 100 < 50}
          class:text-orange-400={value.pwaScore * 100 >= 50 && value.pwaScore * 100 <= 80}
          class:text-green-400={value.pwaScore * 100 > 80}>
          {Math.round(value.pwaScore * 100)}
        </span>
      </div>
    </div>
  </div>
{/if}
