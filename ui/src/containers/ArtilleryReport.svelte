<script>
    import { onMount, onDestroy } from "svelte";
    import { Navigate, navigateTo } from "svelte-router-spa";
    import ArtilleryDetailTable from "../components/ArtilleryDetailTable.svelte";
    import Breadcrumbs from "../components/Breadcrumbs.svelte";
    import LoadingFlat from "../components/LoadingFlat.svelte";
    import Icon from "../components/Icon.svelte";
    import Tabs from "../components/Tabs.svelte";
    import Toastr from "../components/Toastr.svelte";
    import HistoryChart from "../components/HistoryChart.svelte";
    import slug from "slug";
    import {
      getBuildDetails,
      userApi,
      userSession$,
      getIgnoreList
    } from "../stores";
    import { printTimeDiff, CONSTS} from "../utils/utils";
  
    export let currentRoute;
  
    let loading;
  
    let promise = getBuildDetails(currentRoute.namedParams.run);
    let runId;
    let userNotLoginToast;
  </script>
  
  <div class="container mx-auto">
    <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
  
      {#if loading}
        <LoadingFlat />
      {:else}
        {#await promise}
          <LoadingFlat />
        {:then data}
          <Tabs build={data ? data.summary : {}} displayMode="artillery" />
        
          <Breadcrumbs
            build={data ? data.summary : {}}
            runId={currentRoute.namedParams.id}
            displayMode="Artillery Load Test" />

            <ArtilleryDetailTable value={data} />

            <HistoryChart />
        
        {:catch error}
          <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
        {/await}
      {/if}
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
  