<script>
  import { userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import Icon from "../components/misccomponents/Icon.svelte";
  import firebase from "firebase/compat/app";
  import BuildList from "../components/buildlistcardcomponents/BuildList.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { getFirestore, collection, getDoc, doc } from "firebase/firestore";


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

  onDestroy(() => {
    if (unsubscription) {
      unsubscription();
    }
  });

  const systemRequirements = `
  ## System requirements
  Make sure your system meets the following requirements:
  \`\`\` bash
  - Have Docker Desktop in the background 
  - Have at least 1GB of storage to download the Docker image
  \`\`\``;

  const instructions = `
  ## Get Started
  Scan any website for broken links and [HTML Issues](https://htmlhint.com) by running the following command:
  \`\`\` bash
  $ docker run sswconsulting/codeauditor --token ${token} --url <URL> 
  \`\`\`

  If you don't you your scan to be uploaded publicly, following command will upload your scan to your private profile:
  \`\`\` bash
  $ docker run sswconsulting/codeauditor --token ${token} --url <URL> --private
  \`\`\`

  Where: **${token}** is a unique token assigned to your account and **BUILDID** (optional) is your CI build number
  `;
  const instructionSteps = `
  ## Instructions to scan an URL 
  ### On Windows 
  \`\`\` bash
  1. Download Docker for Windows at https://docs.docker.com/docker-for-windows/install/
  2. Follow the installation steps and run Docker
  3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor --token ${token} --url <URL>
  4. Open Windows Powershell and paste the above command, replace <URL> with your designated url 
    (make sure to include the full URL with 'https')
  5. Once scan is complete, a result script will display which gives you a link to your scan result page
  \`\`\`

  ### On Mac 
  \`\`\` bash
  1. Download Docker for Mac at https://docs.docker.com/docker-for-mac/install/
  2. Follow the installation steps and run Docker
  3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor --token ${token} --url <URL>
  4. Open the Terminal and paste the above command, replace <URL> with your designated url 
    (make sure to include the full URL with 'https')
  5. Once scan is complete, a result script will display which gives you a link to your scan result page
  \`\`\``;
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
      <article class="markdown-body mt-5">
        {@html marked(systemRequirements)}
      </article>
      <article class="markdown-body mt-5">
      {@html marked(instructionSteps)}
    </article>
    </div>
  {/if}

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if !showInstruction}
      <span class="text-right">
        <a
          href="javascript:void(0)"
          on:click={() => (showInstruction = true)}
          class="cursor-pointer underline text-sm text-blue font-bold
        pb-6 hover:text-red-600">
          Show instructions
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
