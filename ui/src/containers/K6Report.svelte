<script>
  import { Navigate } from "svelte-router-spa";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import Icon from "../components/misccomponents/Icon.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import {
    getBuildDetails
  } from "../stores";
  import { CONSTS } from "../utils/utils";
  import BuildDetailsSlot from "../components/detailslotcomponents/BuildDetailsSlot.svelte";

  export let currentRoute;

  let loading;

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let userNotLoginToast;

  const download = () => {
    window.location.href = `${CONSTS.BlobURL}/atr/${currentRoute.namedParams.run}.json`;
  };

  let k6Result = {};
  const getK6Result = async (path) => {
    await fetch(`${CONSTS.BlobURL}/k6report/${path}.json`)
      .then((x) => x.json())
      .then((res) => {
        k6Result = res;
      });
    return k6Result;
  };

  let getK6Data = getK6Result(currentRoute.namedParams.id);
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if loading}
      <LoadingFlat />
    {:else}
      {#await promise}
        <LoadingFlat />
      {:then data}
        <BuildDetailsSlot {data} componentType="K6"></BuildDetailsSlot>
        {#if data.summary.k6Count !== undefined}
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

          <div class="grid grid-rows-1">
            <div class="h-5" />
          </div>

          <div>
            {#await getK6Data}
              <LoadingFlat />
            {:then k6Data}
              <div class="mb-4">                
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Count</th>
                      <th>Total</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Mean</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each Object.entries(k6Data) as [key, value]}
                      <tr>
                        <td>{key}</td>
                        <td>{value.count}</td>
                        <td>{value.total}</td>
                        <td>{value.min}</td>
                        <td>{value.max}</td>
                        <td>{value.mean}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/await}
          </div>
        {:else}
          <div class="mb-6 text-center text-xl py-8">
            <Icon cssClass="text-yellow-800 inline-block">
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
              21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </Icon>
            K6 Load Test was not executed
            <Icon cssClass="text-yellow-800 inline-block">
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
              21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </Icon>
          </div>
        {/if}
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

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  table, th, td {
    border: 1px solid black;
  }
  th, td {
    padding: 10px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
</style>