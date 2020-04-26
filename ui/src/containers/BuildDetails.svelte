<script>
  import { userApi, userSession$ } from "../stores";
  import { onMount } from "svelte";
  import marked from "marked";
  import firebase from "firebase/app";
  import DetailsTable from "../components/DetailsTable.svelte";
  import Toastr from "../components/Toastr.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";

  export let currentRoute;
  let promise;
  let addedSuccess;
  let userNotLogin;
  let rawData;
  let ignoredUrls = [];

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
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  const ignore = async (event, user) => {
    if (!user) {
      userNotLogin = true;
      return;
    }

    const res = await fetch(`${CONSTS.API}/api/config/${user.apiKey}/ignore`, {
      method: "POST",
      body: JSON.stringify({
        ...event.detail
      }),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();

    if (res.ok) {
      ignoredUrls = result;
      addedSuccess = true;
      return result;
    } else {
      throw new Error("Failed to load");
    }
  };
  onMount(() => (promise = getBuildDetails()));
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <p class="pb-6 mb-6">Downloading report, please wait...</p>
    {:then data}
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
          href="/home">
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
      <BuildDetailsCard
        build={data ? data.summary[0] : {}}
        on:download={onDownload} />
      <DetailsTable
        on:ignore={event => ignore(event, $userSession$)}
        builds={data ? data.brokenLinks : []}
        {currentRoute}
        summary={data ? data.summary[0] : {}} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">Added to ignored list!</p>
  <p class="text-sm">
    You currently have {ignoredUrls.length} ignored URLs.
    <a
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker"
      href="/settings">
      View
    </a>
  </p>
</Toastr>

<Toastr bind:show={userNotLogin} timeout={10000} mode="warn">
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
