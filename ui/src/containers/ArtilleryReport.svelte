<script>
    import { onMount, onDestroy } from "svelte";
    import { Navigate, navigateTo } from "svelte-router-spa";
    import ArtilleryDetailTable from "../components/ArtilleryDetailTable.svelte";
    import Breadcrumbs from "../components/Breadcrumbs.svelte";
    import LoadingFlat from "../components/LoadingFlat.svelte";
    import Tabs from "../components/Tabs.svelte";
    import Toastr from "../components/Toastr.svelte";
    import HistoryChart from "../components/HistoryChart.svelte";
    import slug from "slug";
    import { format } from 'date-fns';
    import formatDistanceToNow from "date-fns/formatDistanceToNow";
    import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
    import ArtilleryChart from "../components/ArtilleryChart.svelte";
    import {
      getBuildDetails,
      userApi,
      userSession$,
      getIgnoreList
    } from "../stores";
    import { printTimeDiff, CONSTS} from "../utils/utils";
    import CardSummary from "../components/CardSummary.svelte";
    
    export let currentRoute;
  
    let loading;
  
    let promise = getBuildDetails(currentRoute.namedParams.run);
    let runId;
    let userNotLoginToast;

    const download = () => {
      window.location.href = `${CONSTS.BlobURL}/atr/${currentRoute.namedParams.run}.json`;
    };
  
    let atrFull = [];
    const getAtrFull = async (path) => {
      await fetch(
        `${CONSTS.BlobURL}/atr/${path}.json`
      )
        .then(x => x.json())
        .then(res => {
          res.intermediate.forEach(i => {
            atrFull.push({		
              fullTimestamp: i.timestamp,	
              fullLatencyMedian: i.latency.median,
              fullLatencyP95: i.latency.p95,
              fullLatencyP99: i.latency.p99
            })
        })
      });
      return atrFull;
    } 

    let getAtrData = getAtrFull(currentRoute.namedParams.run)
   
  </script>
  
  <div class="container mx-auto">
    <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
  
      {#if loading}
        <LoadingFlat />
      {:else}
        {#await promise}
          <LoadingFlat />
        {:then data}
        
          <Breadcrumbs
            build={data ? data.summary : {}}
            runId={currentRoute.namedParams.id}
            displayMode="Artillery Load Test" />
          <br>

          <CardSummary value={data.summary} />
    
          <BuildDetailsCard build={data ? data.summary : {}} />

          <Tabs build={data ? data.summary : {}} displayMode="artillery" />

          <div class="grid grid-rows-1">
            <div class="h-5"></div>
          </div>
          
          {#await getAtrData}
          <LoadingFlat />
          {:then atrFull}
          <ArtilleryChart value={atrFull}/>
          {/await}

          <ArtilleryDetailTable value={data} />
        
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
  