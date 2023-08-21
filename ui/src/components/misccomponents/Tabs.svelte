<script>
  import { Navigate } from "svelte-router-spa";
  import { getPerfScore, getCodeSummary, getArtilleryResult } from "../../utils/utils";
  export let build = {};
  export let displayMode = "";

  let baseClass = "bg-white inline-block py-2 px-4 text-gray-600 font-semibold";
  let active = " textgrey border-l border-t border-r rounded-t";
  $: codeSummary = getCodeSummary(build.summary);

  $: totalHtmlIssues =
    (codeSummary.htmlErrors || 0) +
    (codeSummary.htmlWarnings || 0) +
    (codeSummary.codeErrors || 0) +
    (codeSummary.codeWarnings || 0);

  let lhWarning = 0;
  $: {
    if (build) {
      const perf = getPerfScore(build.summary);
      lhWarning = [
        "performanceScore",
        "accessibilityScore",
        "seoScore",
        "bestPracticesScore",
        "pwaScore"
      ].filter(x => perf[x] < 90);
    }
  }

  let artilleryLoadTest = 0;
  $: {
    if (build) {
      const art = getArtilleryResult(build.summary);
      artilleryLoadTest = [
        "timestamp",
        "scenariosCreated",
        "scenariosCompleted",
        "requestsCompleted",
        "latencyMedian",
        "rpsCount",
      ].filter(x => art[x] < 90);
    }
  }
</script>

<ul class="flex border-b">
  <li class="mr-1" class:-mb-px={displayMode === 'url'}>
    <span class={baseClass + (displayMode === 'url' ? active : '')}>
      <Navigate to={'/build/' + build.summary.runId}>
        Links{build.summary ? ` (${build.summary.totalUnique404})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'code'}>
    <span class={baseClass + (displayMode === 'code' ? active : '')}>
      <Navigate to={'/htmlhint/' + build.summary.runId}>
        Code{totalHtmlIssues ? ` (${totalHtmlIssues})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'artillery'}>
    <span class={baseClass + (displayMode === 'artillery' ? active : '')}>
      <Navigate to={'/artillery/' + build.summary.runId}>
        Artillery Load Test{artilleryLoadTest.length ? ` (${artilleryLoadTest.length})` : ''}
      </Navigate>
    </span>
  </li>
  {#if build.summary.performanceScore}
    <li class="mr-1" class:-mb-px={displayMode === 'lighthouse'}>
      <span class={baseClass + (displayMode === 'lighthouse' ? active : '')}>
        <Navigate to={'/lighthouse/' + build.summary.runId}>
          Lighthouse Audit{lhWarning.length ? ` (${lhWarning.length})` : ''}
        </Navigate>
      </span>
    </li>
  {/if}
</ul>
