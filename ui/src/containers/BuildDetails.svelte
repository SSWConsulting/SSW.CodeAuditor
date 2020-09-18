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
  import Breadcrumbs from "../components/Breadcrumbs.svelte";
  import DetailsTable from "../components/DetailsTable.svelte";
  import slug from "slug";
  import Toastr from "../components/Toastr.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { CONSTS, getPerfScore, printTimeDiff } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Modal from "../components/Modal.svelte";
  import UpdateIgnoreUrl from "../components/UpdateIgnoreUrl.svelte";
  import { format } from 'date-fns';
  import formatDistanceToNow from "date-fns/formatDistanceToNow";

  export let currentRoute;

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let userNotLoginToast;
  let ignoreUrlShown;
  let urlToIgnore;
  let scanUrl;

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

  const blank = {
    performanceScore: 0,
    pwaScore: 0,
    seoScore: 0,
    accessibilityScore: 0,
    bestPracticesScore: 0,
    average: 0
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

  userSession$.subscribe(x => {
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
      displayMode="Links" />
    <br>
      
      <div class="grid grid-rows-2">
          <div class="text-center">
            <span class="text-4xl font-sans font-bold text-gray-800">{format(new Date(data.summary.buildDate), 'dd.MM.yyyy')}</span>
          </div>
          <div class="text-center">
            <span class="text-xl font-sans block lg:inline-block text-gray-600">Last scanned: {formatDistanceToNow(new Date(data.summary.buildDate), {addSuffix: true})} at {format(new Date(data.summary.buildDate), 'hh:mm')}</span>
          </div>
          <div class="text-center">
            <a href="{data.summary.url}" class="underline font-sans text-xl">{data.summary.url}</a>
          </div>
      </div>

      <BuildDetailsCard build={data ? data.summary : {}} />
      
      <Tabs build={data ? data.summary : {}} displayMode="url" />

      <DetailsTable
        on:download={() => onDownload(data)}
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
