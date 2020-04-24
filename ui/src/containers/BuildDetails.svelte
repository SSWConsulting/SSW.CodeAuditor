<script>
  import { userApi, userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import firebase from "firebase/app";
  import BuildDetails from "../components/DetailsTable.svelte";
  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  export let currentRoute;

  let promise;

  async function getBuildDetails(api, build) {
    const res = await fetch(`${CONSTS.API}/api/scanresult/${api}/${build}`);
    const result = await res.json();

    if (res.ok) {
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  userSession$.subscribe(x => {
    if (x) {
      promise = getBuildDetails(x.apiKey, currentRoute.namedParams.id);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <p class="pb-6 mb-6">Loading...</p>
    {:then data}
      <BuildDetails builds={data} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
