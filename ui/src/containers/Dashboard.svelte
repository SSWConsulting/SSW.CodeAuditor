<script>
  import { userApi, userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import Icon from "../components/Icon.svelte";
  import firebase from "firebase/app";
  import BuildList from "../components/BuildList.svelte";
  import LoadingFlat from "../components/LoadingFlat.svelte";

  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let promise;
  let showInstruction;
  let canClose;
  let unsubscription;
  let lastBuild;

  async function getLastBuilds(api) {
    const res = await fetch(`${CONSTS.API}/api/scanresult/${api}`);
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
  userSession$.subscribe(x => {
    if (x) {
      unsubscription = firebase
        .firestore()
        .collection(CONSTS.USERS)
        .doc(x.uid)
        .onSnapshot(usr => {
          const userD = usr.data();
          if (userD.lastBuild) {
            lastBuild = userD.lastBuild.toDate();
          }
          promise = getLastBuilds(x.apiKey);
        });
      token = x.apiKey;
    }
  });

  onDestroy(() => {
    if (unsubscription) {
      unsubscription();
    }
  });

  const instructions = `
  ## SSW CodeAuditor - Scan instructions
  Scan any website for broken links by running the following command:
  \`\`\` bash
  $ docker run sswconsulting/sswauditor --token ${token} --url <URL> --buildId [BUILDID]
  \`\`\`
  
  Include [Lighthouse](https://developers.google.com/web/tools/lighthouse) key performance score by running
  \`\`\` bash
  $ docker container run --rm --cap-add=SYS_ADMIN sswconsulting/sswauditor --lighthouse --token ${token} --url <URL>
  \`\`\`

  Why **--cap-add=SYS_ADMIN** option? [Read here](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes/docker-client)

  Where:
  - **${token}** is a unique token assigned to your account
  - **BUILDID** (optional) is your CI build number
  `;
</script>

<div class="container mx-auto">
  {#if showInstruction}
    <div
      class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col"
      in:fly={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 250 }}>
      {#if canClose}
        <a
          class="text-right align-baseline text-sm font-bold text-blue
          hover:text-blue-darker text-2xl"
          on:click={() => (showInstruction = false)}
          href="javascript:void(0)">
          <Icon cssClass="inline-block">
            <path d="M6 18L18 6M6 6l12 12" />
          </Icon>
        </a>
      {/if}
      <article class="markdown-body">
        {@html marked(instructions)}
      </article>
    </div>
  {/if}

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if !showInstruction}
      <a
        class="text-right align-baseline underline text-sm text-blue font-bold
        pb-6 hover:text-blue-darker"
        on:click={() => (showInstruction = true)}
        href="javascript:void(0)">
        Show instructions
      </a>
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
