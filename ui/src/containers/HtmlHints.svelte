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
  import { CONSTS, getPerfScore, HTMLERRORS, printTimeDiff } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Modal from "../components/Modal.svelte";
  import UpdateIgnoreUrl from "../components/UpdateIgnoreUrl.svelte";
  import UpdatePerfThreshold from "../components/UpdatePerfThreshold.svelte";
  import { format } from 'date-fns';
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import CardSummary from "../components/CardSummary.svelte";

  export let currentRoute;

  let runId = currentRoute.namedParams.id;
  let promise = getHtmlHints(runId);
  async function getHtmlHints(id) {
    const d = await fetch(
      `${CONSTS.BlobURL}/htmlhint/${id}.json`

    );
    let htmlHint = await d.json();

    let summary = await getBuildDetails(id);
    let codeIssues = [];
    if (summary.summary.codeIssues) {
      const c = await fetch(
        `${CONSTS.BlobURL}/codeauditor/${id}.json`
      );
      codeIssues = await c.json();
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

    <Breadcrumbs
    build={data ? data.summary : {}}
    runId={currentRoute.namedParams.id}
    displayMode="Code Issues" />
    <br>
    
      <CardSummary value={data.summary} />
    
      <BuildDetailsCard build={data ? data.summary : {}} />

      <Tabs build={data ? data.summary : {}} displayMode="code" />

      <HtmlErrorsTable
        on:download={() => onDownload(data)}
        errors={data.htmlHint}
        codeIssues={data.codeIssues}
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
