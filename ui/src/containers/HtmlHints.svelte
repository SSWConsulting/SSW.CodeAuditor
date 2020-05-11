<script>
  import {
    getBuildDetails,
    userApi,
    userSession$,
    getIgnoreList
  } from "../stores";
  import { onMount } from "svelte";
  import Icon from "../components/Icon.svelte";
  import HtmlErrorsTable from "../components/HtmlErrorsTable.svelte";
  import slug from "slug";
  import Toastr from "../components/Toastr.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { CONSTS, getPerfScore } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Modal from "../components/Modal.svelte";
  import UpdateIgnoreUrl from "../components/UpdateIgnoreUrl.svelte";
  import UpdatePerfThreshold from "../components/UpdatePerfThreshold.svelte";

  export let currentRoute;

  let runId = currentRoute.namedParams.id;
  let promise = getHtmlHints(runId);
  async function getHtmlHints(id) {
    const d = await fetch(
      `https://urlchecker.blob.core.windows.net/htmlhint/${id}.json`
    );
    let htmlHint = await d.json();
    let summary = await getBuildDetails(id);

    return { htmlHint, summary: summary.summary };
  }

  let userNotLoginToast;
  let ignoreUrlShown;
  let perfThresholdShown;
  let urlToIgnore;
  let scanUrl;
  let lastBuild;
  let loadingPerfSettings;
  let threshold = {};

  const blank = {
    performanceScore: 0,
    pwaScore: 0,
    seoScore: 0,
    accessibilityScore: 0,
    bestPracticesScore: 0,
    average: 0
  };

  userSession$.subscribe(async x => {
    if (x) {
      getIgnoreList(x);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    <p class="pb-2">
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        Builds
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        <Navigate to={`/build/${runId}`}>{runId}</Navigate>
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <span
        class="inline-block align-baseline text-blue hover:text-blue-darker">
        Html Issues
      </span>
    </p>
    {#await promise}
      <LoadingFlat />
    {:then data}
      <BuildDetailsCard build={data ? data.summary : {}} mode="htmlhint" />
      <HtmlErrorsTable errors={data.htmlHint} {currentRoute} />
    {:catch error}
      <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
    {/await}
  </div>
</div>

<Toastr bind:show={userNotLoginToast} timeout={10000} mode="warn">
  <p>Sign in to unlock this feature!</p>
  <p class="text-sm pt-2">
    <span
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker">
      <Navigate to="/login">Sign in</Navigate>
    </span>
  </p>
</Toastr>

<UpdateIgnoreUrl
  url={urlToIgnore}
  {scanUrl}
  bind:show={ignoreUrlShown}
  user={$userSession$} />

<UpdatePerfThreshold
  url={scanUrl}
  loading={loadingPerfSettings}
  {lastBuild}
  {threshold}
  bind:show={perfThresholdShown}
  user={$userSession$} />
