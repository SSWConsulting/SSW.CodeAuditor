<script>
  import { userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import BuildList from "../components/buildlistcardcomponents/BuildList.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { getFirestore, collection, getDoc, doc } from "firebase/firestore";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let promise;
  let showInstruction;
  let canClose;
  let unsubscription;
  let lastBuild;
  let showAllScan = false;

  async function getLastBuilds(api) {
    const res = await fetch(`${CONSTS.API}/api/scanresult/${api}?showAll=${showAllScan}`);
    const result = await res.json();
    if (res.ok) {
      showInstruction = !result.length;
      canClose = result.length;
      return sort(descend(prop("buildDate")), result);
    } else {
      showInstruction = true;
      throw new Error("Failed to load");
    }
  }

  let token;
  userSession$.subscribe((x) => {
    if (x) {
      getDoc(
			  doc(collection(getFirestore(), CONSTS.USERS), x._delegate.uid)
		  ).then(doc => {
        lastBuild = doc.data().lastBuild.toDate();
        promise = getLastBuilds(x.apiKey);
      })
      token = x.apiKey;
    }
  });

  const toggleShowAllScan = () => {
    showAllScan = true
    promise = getLastBuilds(token);
  }

  onDestroy(() => {
    if (unsubscription) {
      unsubscription();
    }
  });

  const personalScanTitle = `
  ## Your Personal Scans
  `;

  const topScanTitle = `
  ### Latest Personal Scans
  `;
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-6 mb-4 flex flex-col">
    <article class="markdown-body">
      {@html marked.parse(personalScanTitle)}
    </article>
    {#if !showAllScan}
      <article class="markdown-body mt-5">
        {@html marked.parse(topScanTitle)}
      </article>
    {/if}
  </div>

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if !showAllScan}
      <span class="text-right">
        <a href={'#'} on:click={() => toggleShowAllScan()}
          class="cursor-pointer underline text-sm text-blue font-bold
        pb-6 hover:text-red-600">
          Show all personal scans
        </a>
      </span>
    {/if}
    {#await promise}
      <LoadingFlat />
    {:then data}
      {#if data}
        <BuildList builds={data} {lastBuild} />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
