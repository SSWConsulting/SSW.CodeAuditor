<script>
  import { userApi, userSession$ } from "../stores";
  import { onMount } from "svelte";
  import marked from "marked";
  import firebase from "firebase/app";
  import DetailsTable from "../components/DetailsTable.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  export let currentRoute;
  let promise;

  async function getBuildDetails() {
    const res = await fetch(
      `${CONSTS.API}/api/run/${currentRoute.namedParams.id}`
    );
    const result = await res.json();

    if (res.ok) {
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  onMount(() => (promise = getBuildDetails()));
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <p class="pb-6 mb-6">Downloading report, please wait...</p>
    {:then data}
      <p class="pb-2">
        <a
          class="inline-block align-baseline text-blue hover:text-blue-darker"
          href="/home">
          Builds
        </a>
        >
        <a
          class="inline-block align-baseline text-blue hover:text-blue-darker"
          href="/build/{currentRoute.namedParams.id}">
          {currentRoute.namedParams.id}
        </a>
      </p>
      <BuildDetailsCard build={data ? data.summary[0] : {}} />
      <DetailsTable builds={data ? data.brokenLinks : []} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
