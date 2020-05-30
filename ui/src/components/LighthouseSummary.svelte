<script>
  import { getPerfScore, updateQuery } from "../utils/utils.js";
  import ParsedQuery from "query-string";
  import Icon from "./Icon.svelte";
  import { navigateTo } from "svelte-router-spa";
  export let value = {};
  export let showLabel = false;
  $: perf = getPerfScore(value);
</script>

{#if perf.performanceScore}
  <!-- content here -->
  <div>
    <div class="grid grid-cols-2 gap-1 row-gap-2 xl:grid-cols-3">
      <div class="text-center whitespace-no-wrap">
        <span class="font-mono">AVG</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="Average"
          class:text-red-400={perf.average < 50}>
          {perf.average.toFixed(1)}
        </span>
      </div>
      <div class="text-center">
        <span class="font-mono">PERF</span>
        <span
          title="Performance"
          class="font-bold block lg:inline-block textgrey"
          class:text-red-400={perf.performanceScore < 50}>
          {perf.performanceScore}
        </span>
      </div>
      <div class="text-center">
        {#if showLabel}
          <span class="font-mono">Accessibility</span>
        {:else}
          <Icon cssClass="inline-block">
            <path
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0
              00-7-7z" />
          </Icon>
        {/if}
        <span
          class="font-bold block lg:inline-block textgrey"
          title="Accessibility"
          class:text-red-400={perf.accessibilityScore < 50}>
          {perf.accessibilityScore}
        </span>
      </div>

      <div class="text-center">
        <span class="font-mono">SEO</span>
        <span
          title="SEO"
          class="font-bold block lg:inline-block textgrey"
          class:text-red-400={perf.seoScore < 50}>
          {perf.seoScore}
        </span>
      </div>
      <div class="text-center">
        <span class="font-mono">PWA</span>
        <span
          class="font-bold block lg:inline-block textgrey"
          title="PWA"
          class:text-red-400={perf.pwaScore < 50}>
          {perf.pwaScore}
        </span>
      </div>
      <div class="text-center">
        {#if showLabel}
          <span class="font-mono">Best Practice</span>
        {:else}
          <Icon cssClass="inline-block">
            <path
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714
              2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </Icon>
        {/if}
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
