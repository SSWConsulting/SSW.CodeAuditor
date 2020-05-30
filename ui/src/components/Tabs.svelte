<script>
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { getPerfScore, getCodeSummary } from "../utils/utils.js";
  export let build = {};
  export let displayMode = "";

  let baseClass = "bg-white inline-block py-2 px-4 text-gray-600 font-semibold";
  let active = " textgrey border-l border-t border-r rounded-t";
  $: codeSummary = getCodeSummary(build);

  $: totalHtmlIssues =
    (codeSummary.htmlErrors || 0) +
    (codeSummary.htmlWarnings || 0) +
    (codeSummary.codeErrors || 0) +
    (codeSummary.codeWarnings || 0);

  let lhWarning = 0;
  $: {
    if (build) {
      const perf = getPerfScore(build);
      lhWarning = [
        "performanceScore",
        "accessibilityScore",
        "seoScore",
        "bestPracticesScore",
        "pwaScore"
      ].filter(x => perf[x] < 90);
    }
  }
</script>

<ul class="flex border-b">
  <li class="mr-1" class:-mb-px={displayMode === 'url'}>
    <span class={baseClass + (displayMode === 'url' ? active : '')}>
      <Navigate to={'/build/' + build.runId}>
        Links{build.uniqueBrokenLinks ? ` (${build.uniqueBrokenLinks})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'code'}>
    <span class={baseClass + (displayMode === 'code' ? active : '')}>
      <Navigate to={'/htmlhint/' + build.runId}>
        Code{totalHtmlIssues ? ` (${totalHtmlIssues})` : ''}
      </Navigate>
    </span>
  </li>
  {#if build.performanceScore}
    <li class="mr-1" class:-mb-px={displayMode === 'lighthouse'}>
      <span class={baseClass + (displayMode === 'lighthouse' ? active : '')}>
        <Navigate to={'/lighthouse/' + build.runId}>
          Lighthouse Audit{lhWarning.length ? ` (${lhWarning.length})` : ''}
        </Navigate>
      </span>
    </li>
  {/if}
</ul>
