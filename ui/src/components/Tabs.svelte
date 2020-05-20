<script>
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { getPerfScore } from "../utils/utils.js";
  export let build = {};
  export let displayMode = "";

  let baseClass =
    "bg-white inline-block py-2 px-4 textgrey hover:text-grey-800 font-semibold";
  let active = " text-blue-700 border-l border-t border-r rounded-t";
  $: totalHtmlIssues = (build.htmlErrors || 0) + (build.htmlWarnings || 0);

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
    <span class={baseClass + (displayMode === 'url' ? active : '')} href="#">
      <Navigate to={'/build/' + build.runId}>
        Links{build.uniqueBrokenLinks ? ` (${build.uniqueBrokenLinks})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'html'}>
    <span class={baseClass + (displayMode === 'html' ? active : '')} href="#">
      <Navigate to={'/htmlhint/' + build.runId}>
        HTML{totalHtmlIssues ? ` (${totalHtmlIssues})` : ''}
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'lighthouse'}>
    <span
      class={baseClass + (displayMode === 'lighthouse' ? active : '')}
      href="#">
      <Navigate to={'/lighthouse/' + build.runId}>
        Lighthouse Audit{lhWarning.length ? ` (${lhWarning.length})` : ''}
      </Navigate>
    </span>
  </li>
</ul>
