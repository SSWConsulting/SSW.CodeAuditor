<script>
  import {
    getBuildDetails,
    userApi,
    userSession$,
    getIgnoreList
  } from "../stores";
  import { onMount } from "svelte";
  import Tabs from "../components/Tabs.svelte";
  import Icon from "../components/Icon.svelte";
  import { pipe, map, flatten } from "ramda";
  import HtmlErrorsTable from "../components/HtmlErrorsTable.svelte";
  import Breadcrumbs from "../components/Breadcrumbs.svelte";
  import slug from "slug";
  import Toastr from "../components/Toastr.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { CONSTS, getPerfScore, HTMLERRORS } from "../utils/utils.js";
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
    let codeIssues = null;
    if (summary.summary.codeIssues) {
      const c = await fetch(
        `https://urlchecker.blob.core.windows.net/codeauditor/${id}.json`
      );
      codeIssues = await c.json();
      console.log(codeIssues)
    }
    return { htmlHint, summary: summary.summary, codeIssues };
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

  const onDownload = data => {
    const csvExporter = new ExportToCsv({
      useKeysAsHeaders: true
    });

    const exportToflat = pipe(
      map(
        pipe(x => {
          let errors = [];
          Object.keys(x.errors).forEach(e => {
            errors.push({
              url: x.url,
              issue: e,
              level: HTMLERRORS.indexOf(e) >= 0 ? "error" : "warning",
              locations: x.errors[e].join(" "),
              ruleUrl: "https://htmlhint.com/docs/user-guide/rules/" + e
            });
          });
          return errors;
        })
      ),
      flatten
    );

    csvExporter.generateCsv(exportToflat(data.htmlHint));
  };

  userSession$.subscribe(async x => {
    if (x) {
      getIgnoreList(x);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">

    {#await promise}
      <LoadingFlat />
    {:then data}
      <Tabs build={data ? data.summary : {}} displayMode="html" />

      <Breadcrumbs
        build={data ? data.summary : {}}
        runId={currentRoute.namedParams.id}
        displayMode="HTML" />

      <BuildDetailsCard build={data ? data.summary : {}} mode="htmlhint" />
      <HtmlErrorsTable
        on:download={() => onDownload(data)}
        errors={data.htmlHint}
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
