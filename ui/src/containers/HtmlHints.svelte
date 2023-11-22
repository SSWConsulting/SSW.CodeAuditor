<script>
  import {
    getBuildDetails,
    userSession$,
  } from "../stores";
  import { pipe, map, flatten } from "ramda";
  import HtmlErrorsTable from "../components/htmlhintcomponents/HtmlErrorsTable.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import { CONSTS, HTMLERRORS, globMatchUrl } from "../utils/utils.js";
  import { mkConfig, generateCsv, download } from "export-to-csv";
  import { Navigate } from "svelte-router-spa";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { onMount } from "svelte";
  import BuildDetailsSlot from "../components/detailslotcomponents/BuildDetailsSlot.svelte";

  export let currentRoute;

  let runId = currentRoute.namedParams.id;
  let promise = getHtmlHints(runId);
  async function getHtmlHints(id) {
    const d = await fetch(
      `${CONSTS.BlobURL}/htmlhint/${id}.json`

    );
    let htmlHint = await d.json();

    let summary = await getBuildDetails(id);
    let codeIssues = [];
    if (summary.summary.codeIssues) {
      const c = await fetch(
        `${CONSTS.BlobURL}/codeauditor/${id}.json`
      );
      codeIssues = await c.json();
    }
    return { htmlHint, summary: summary.summary, codeIssues, brokenLinks: summary.brokenLinks };
  }

  let userNotLoginToast;

  const onDownload = data => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true
    });

    const exportToflat = pipe(
      map(
        pipe(x => {
          let errors = [];
          Object.keys(x.errors).forEach(e => {
            errors.push({
              url: x.url,
              issue: e,
              level: HTMLERRORS.indexOf(e) >= 0 ? "error" : "warning",
              locations: x.errors[e].join(" "),
              ruleUrl: "https://htmlhint.com/docs/user-guide/rules/" + e
            });
          });
          return errors;
        })
      ),
      flatten
    );

    const csv = generateCsv(csvConfig)(exportToflat(data.htmlHint));
    download(csvConfig)(csv);
  };

  let htmlRules;
  let customHtmlRuleOptions = [];
  const getSelectedHtmlRules = async () => {
    await promise.then(async () => {
      const res = await fetch(`${CONSTS.API}/api/config/htmlhintrulesbyrunid/${runId}`);
      htmlRules = await res.json();

      await getCustomHtmlRuleOptions()
	  });
  }

  const getCustomHtmlRuleOptions = async () => {
    await promise.then(async (summary) => {
      if ($userSession$) {
        const optionRes = await fetch(`${CONSTS.API}/api/config/getCustomHtmlRuleOptions/${$userSession$.apiKey}`, {
          method: "POST",
          body: JSON.stringify({url: summary.summary.url}),
          headers: { "Content-Type": "application/json" },
        })
        const optionResult = await optionRes.json();
        customHtmlRuleOptions = optionResult || [];
      }
	  });
  };

  const addIgnoredUrl = async (ignoredUrl, ruleId) => {
    const ignoredUrls = customHtmlRuleOptions
      .find((opt) => opt.ruleId === ruleId)?.ignoredUrls?.split(',').filter(i => i) || [];
    ignoredUrls.push(ignoredUrl);
    await updateIgnoredUrls(ignoredUrls, ruleId);
  };

  const removeIgnoredUrl = async (ignoredUrl, ruleId) => {
    const ignoredUrls = customHtmlRuleOptions
      .find((opt) => opt.ruleId === ruleId)?.ignoredUrls?.split(',').filter(i => i && !globMatchUrl(i, ignoredUrl)) || [];
    await updateIgnoredUrls(ignoredUrls, ruleId);
  };

  const updateIgnoredUrls = async (ignoredUrls, ruleId) => {
    if (!$userSession$) {
      userNotLoginToast = true;
      customHtmlRuleOptions = [];
      return;
    }

    await promise.then(async (summary) => {
      const res = await fetch(
        `${CONSTS.API}/api/config/addCustomHtmlRuleOptions/${$userSession$.apiKey}`,
        {
          method: 'POST',
          body: JSON.stringify({
            ruleId,
            url: summary.summary.url,
            ignoredUrls: ignoredUrls.join(','),
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        getCustomHtmlRuleOptions()
      } else {
        throw new Error('Failed to update ignored URLs');
      }
    });
  };

  onMount(() => {
    getSelectedHtmlRules()
  })
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col pb-6">

    {#await promise}
      <LoadingFlat />
    {:then data}

    <BuildDetailsSlot
      on:getCustomHtmlRuleOptions={getCustomHtmlRuleOptions}
      {data}
      {htmlRules}
      {customHtmlRuleOptions}
      user={$userSession$}
      componentType="Code"
    >
      <HtmlErrorsTable
        on:download={() => onDownload(data)}
        on:addIgnoredUrl={(e) => addIgnoredUrl(e.detail.url, e.detail.id)}
        on:removeIgnoredUrl={(e) => removeIgnoredUrl(e.detail.url, e.detail.id)}
        errors={data.htmlHint}
        codeIssues={data.codeIssues}
        {customHtmlRuleOptions}
        {currentRoute} />  
    </BuildDetailsSlot>
    {:catch error}
      <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
    {/await}
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


