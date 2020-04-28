<script>
  import { onMount, onDestroy } from "svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  export let currentRoute;
  let loading;
  let runId;
  onMount(() => {
    console.log("loading", currentRoute.namedParams.run);
    if (currentRoute && currentRoute.namedParams.run) {
      loading = true;
      runId = currentRoute.namedParams.run;
      fetch(
        `https://urlchecker.blob.core.windows.net/lhr/${currentRoute.namedParams.run}.json`
      )
        .then(x => x.json())
        .then(json => {
          loading = false;
          const dom = new DOM(document);
          const renderer = new ReportRenderer(dom);
          const container = document.querySelector("#report");
          renderer.renderReport(json, container);
        });
    }
  });
  const downloadLighthouse = () => {
    window.location.href = `https://urlchecker.blob.core.windows.net/lhr/${runId}.json`;
  };
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    <p class="pb-2">
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        Builds
      </a>
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        <Navigate to={`/build/${runId}`}>{runId}</Navigate>
      </a>
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <span
        class="inline-block align-baseline text-blue hover:text-blue-darker">
        Lighthouse Report
      </span>
    </p>

    {#if loading}
      <LoadingFlat />
    {:else}
      <div class="text-center py-3">
        <button
          on:click={downloadLighthouse}
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4
          rounded inline-flex items-center text-center">
          <svg
            fill="none"
            stroke-linecap="round"
            width="24"
            height="24"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <span class="ml-2">Download Lighthouse Report</span>
        </button>
      </div>
    {/if}
    <main id="report" />
  </div>
</div>
