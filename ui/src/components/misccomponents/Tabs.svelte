<script>
  import { Navigate } from "svelte-router-spa";
  import { getPerfScore, getCodeSummary, getArtilleryResult } from "../../utils/utils";
  export let build = {};
  export let displayMode = "";

  let baseClass = "bg-white inline-block py-2 px-4 textgrey font-semibold";
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
  <li class="mr-1" class:-mb-px={displayMode === 'Links'}>
    <span class={baseClass + (displayMode === 'Links' ? active : '')}>
      <Navigate to={'/build/' + build.summary.runId}>
        Links{build.summary ? ` (${build.summary.uniqueBrokenLinks})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'Code'}>
    <span class={baseClass + (displayMode === 'Code' ? active : '')}>
      <Navigate to={'/htmlhint/' + build.summary.runId}>
        Code{totalHtmlIssues ? ` (${totalHtmlIssues})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'Lighthouse'}>
    <span class={baseClass + (displayMode === 'Lighthouse' ? active : '')}>
      <Navigate to={'/lighthouse/' + build.summary.runId}>
        Lighthouse Audit
      </Navigate>
    </span>
  </li>

  {#if build.summary.latencyP95 !== undefined}
    <li class="mr-1" class:-mb-px={displayMode === 'Artillery'}>
      <span class={baseClass + (displayMode === 'Artillery' ? active : '')}>
        <Navigate to={'/artillery/' + build.summary.runId}>
          Artillery Load Test
        </Navigate>
      </span>
    </li>
  {/if}

  {#if build.summary.k6Count !== undefined}
    <li class="mr-1" class:-mb-px={displayMode === 'K6'}>
      <span class={baseClass + (displayMode === 'K6' ? active : '')}>
        <Navigate to={'/k6/' + build.summary.runId}>
          K6 Load Test
        </Navigate>
      </span>
    </li>
  {/if}
</ul>
