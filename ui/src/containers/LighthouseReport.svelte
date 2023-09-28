<script>
  import { onMount } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import Icon from "../components/misccomponents/Icon.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import {
    getBuildDetails,
    userSession$,
  } from "../stores";
  import { CONSTS } from "../utils/utils";
  import { renderReport } from 'lighthouse-viewer';
  import BuildDetailsSlot from "../components/detailslotcomponents/BuildDetailsSlot.svelte";

  export let currentRoute;

  let loading;
  let promise = getBuildDetails(currentRoute.namedParams.id);
  let runId;
  let userNotLoginToast;

  const download = () => {
    window.location.href = `${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.id}.json`;
  };

  onMount(() => {
    if (currentRoute && currentRoute.namedParams.id) {
      loading = true;
      runId = currentRoute.namedParams.id;
      fetch(`${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.id}.json`)
        .then((x) => x.json())
        .then((json) => {
          loading = false;
          const svelteAppElement = document.getElementById('report');
          if (svelteAppElement) {
            const reportHtml = renderReport(json, {
              disableDarkMode: true,
            });
            svelteAppElement.appendChild(reportHtml);
          }
        });
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if loading}
      <LoadingFlat />
    {:else}
      {#await promise}
        <LoadingFlat />
      {:then data}
      <BuildDetailsSlot
        {data}
        user={$userSession$}
        componentType="lighthouse"
      >
      </BuildDetailsSlot>
      {:catch error}
        <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
      {/await}
    {/if}
    <!-- this is where the lighthouse report will go -->
    <div class="my-4">
      <div class="float-right">
        <button
          on:click={download}
          title="Download JSON"
          class="bg-gray-300 hover:bg-gray-400 textdark font-bold py-1 px-1
          rounded-lg inline-flex items-center">
          <Icon cssClass="">
            <path
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </Icon>
        </button>
      </div>
    </div>
    <main id="report" />
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
