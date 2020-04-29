<script>
  import {
    getBuildDetails,
    userApi,
    userSession$,
    getIgnoreList
  } from "../stores";
  import { onMount } from "svelte";
  import DetailsTable from "../components/DetailsTable.svelte";
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

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let userNotLoginToast;

  let ignoreUrlShown;
  let perfThresholdShown;
  let urlToIgnore;
  let scanUrl;
  let lastBuild;
  let loadingPerfSettings;
  let threshold = {};

  const onDownload = data => {
    const csvExporter = new ExportToCsv({
      showLabels: true,
      showTitle: true,
      title: `URL:,${data.summary.url},Duration:,${data.summary.scanDuration},URL Scanned:,${data.summary.totalScanned}`,
      useKeysAsHeaders: true
    });

    csvExporter.generateCsv(
      data.brokenLinks.map(x => {
        delete x["odata.etag"];
        delete x["PartitionKey"];
        delete x["RowKey"];
        delete x["Timestamp"];
        return x;
      })
    );
  };

  const showPerfThreshold = async (summary, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    scanUrl = summary.url;
    lastBuild = summary;
    perfThresholdShown = true;
    loadingPerfSettings = true;
    try {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/perfthreshold/${slug(scanUrl)}`
      );
      const result = await res.json();
      threshold =
        result.length > 0
          ? result[0]
          : {
              performanceScore: 0,
              pwaScore: 0,
              seoScore: 0,
              accessibilityScore: 0,
              bestPracticesScore: 0,
              average: 0
            };
      console.log("threshold", threshold);
    } catch (error) {
      threshold = getPerfScore(summary);
    } finally {
      loadingPerfSettings = false;
    }
  };

  const showIgnore = (mainUrl, url, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    scanUrl = mainUrl;
    urlToIgnore = url.detail;
    ignoreUrlShown = true;
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
      <span
        class="inline-block align-baseline text-blue hover:text-blue-darker">
        {currentRoute.namedParams.id}
      </span>
    </p>
    {#await promise}
      <LoadingFlat />
    {:then data}
      <BuildDetailsCard
        build={data ? data.summary : {}}
        on:download={() => onDownload(data)}
        on:perfThreshold={() => showPerfThreshold(data.summary, $userSession$)} />
      <DetailsTable
        on:ignore={url => showIgnore(data.summary.url, url, $userSession$)}
        builds={data ? data.brokenLinks : []}
        {currentRoute} />
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
