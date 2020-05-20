<script>
  import { Navigate, navigateTo } from "svelte-router-spa";
  export let build = {};
  export let displayMode = "";

  let baseClass =
    "bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold";
  let active = " text-blue-700 border-l border-t border-r rounded-t";
  $: totalHtmlIssues = (build.htmlErrors || 0) + (build.htmlWarnings || 0);
</script>

<ul class="flex border-b">
  <li class="mr-1" class:-mb-px={displayMode === 'url'}>
    <span class={baseClass + (displayMode === 'url' ? active : '')} href="#">
      <Navigate to={'/build/' + build.runId}>
        Link ({build.uniqueBrokenLinks})
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'html'}>
    <span class={baseClass + (displayMode === 'html' ? active : '')} href="#">
      <Navigate to={'/htmlhint/' + build.runId}>
        Html ({totalHtmlIssues})
      </Navigate>
    </span>
  </li>
  <li class="mr-1" class:-mb-px={displayMode === 'lighthouse'}>
    <span
      class={baseClass + (displayMode === 'lighthouse' ? active : '')}
      href="#">
      <Navigate to={'/lighthouse/' + build.runId}>Lighthouse Audit</Navigate>
    </span>
  </li>
</ul>
