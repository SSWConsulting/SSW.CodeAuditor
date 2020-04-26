<script>
  import { userApi, userSession$, getIgnoreList } from "../stores";
  import { onMount } from "svelte";
  import DetailsTable from "../components/DetailsTable.svelte";
  import Toastr from "../components/Toastr.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { CONSTS } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Modal from "../components/Modal.svelte";
  import UpdateIgnoreUrl from "../components/UpdateIgnoreUrl.svelte";

  export let currentRoute;

  let promise;
  let userNotLoginToast;
  let rawData;

  let ignoreUrlShown;
  let urlToIgnore;
  let scanUrl;
  const onDownload = () => {
    const csvExporter = new ExportToCsv({
      showLabels: true,
      showTitle: true,
      title: `URL:,${rawData.summary.url},Duration:,${rawData.summary.scanDuration},URL Scanned:,${rawData.summary.totalScanned}`,
      useKeysAsHeaders: true
    });

    csvExporter.generateCsv(
      rawData.brokenLinks.map(x => {
        delete x["odata.etag"];
        delete x["PartitionKey"];
        delete x["RowKey"];
        delete x["Timestamp"];
        return x;
      })
    );
  };

  async function getBuildDetails() {
    const res = await fetch(
      `${CONSTS.API}/api/run/${currentRoute.namedParams.id}`
    );
    const result = await res.json();

    if (res.ok) {
      rawData = { summary: result.summary[0], brokenLinks: result.brokenLinks };
      scanUrl = rawData.summary.url;
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  const showIgnore = (url, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    urlToIgnore = url.detail;
    ignoreUrlShown = true;
  };

  onMount(() => (promise = getBuildDetails()));
  userSession$.subscribe(x => {
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
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/build/{currentRoute.namedParams.id}">
        {currentRoute.namedParams.id}
      </a>
    </p>
    {#await promise}
      <LoadingFlat />
    {:then data}
      <BuildDetailsCard
        build={data ? data.summary[0] : {}}
        on:download={onDownload} />
      <DetailsTable
        on:ignore={url => showIgnore(url, $userSession$)}
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
    <a
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker"
      href="/login">
      Sign in
    </a>
  </p>
</Toastr>

<UpdateIgnoreUrl
  url={urlToIgnore}
  {scanUrl}
  bind:show={ignoreUrlShown}
  user={$userSession$} />
