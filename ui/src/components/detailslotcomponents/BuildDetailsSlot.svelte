<script>
  import DetailsCard from "../summaryitemcomponents/DetailsCard.svelte";
  import Breadcrumbs from "../misccomponents/Breadcrumbs.svelte";
  import Tabs from "../misccomponents/Tabs.svelte";
  import CardSummary from "../summaryitemcomponents/CardSummary.svelte";
  import slug from "slug";
  import UpdateHtmlRules from "../htmlhintcomponents/UpdateHTMLRules.svelte"
  import { CONSTS } from "../../utils/utils";
  import UpdatePerfThreshold from "../lighthousecomponents/UpdatePerfThreshold.svelte";
  import { createEventDispatcher } from "svelte";

  export let data;
  export let componentType;
  export let htmlRules;
  export let user;
  export let customHtmlRuleOptions;

  let threshold = {};
  let htmlHintRulesShown;
  let loadingHtmlHintSettings;
  let scanUrl;
  let perfThresholdShown;
  let loadingPerfSettings;
  let lastBuild;

  const dispatch = createEventDispatcher();
  const getCustomHtmlRuleOptions = () => dispatch('getCustomHtmlRuleOptions');

  const showHtmlHintThreshold = async (summary, user) => {
    if (!user) {
      return;
    }
    scanUrl = summary.url;
    htmlHintRulesShown = true;
    loadingHtmlHintSettings = true;
    try {
      getCustomHtmlRuleOptions();
      // Retrieve selected custom HTML Rules 
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules/${slug(scanUrl)}`
      );
      const result = await res.json();
      threshold = result || {};
    } catch (error) {
      console.error("error getting threshold", error);
      threshold = {};
    } finally {
      loadingHtmlHintSettings = false;
    }
  };

  const showPerfThreshold = async (summary, user) => {
    if (!user) {
      return;
    }
    scanUrl = summary.url;
    lastBuild = summary;
    perfThresholdShown = true;
    loadingPerfSettings = true;
    try {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/perfthreshold/${slug(scanUrl)}`
      );
      const result = await res.json();
      threshold = result || {};
    } catch (error) {
      console.error("error getting threshold", error);
      threshold = {};
    } finally {
      loadingPerfSettings = false;
    }
  };
</script>

<div>
    <Breadcrumbs displayMode={componentType} />
    <br />
    
    <CardSummary 
      value={data.summary} 
      isHtmlHintComp={componentType === 'Code'}
      isLighthouseAudit={componentType === 'Lighthouse'}
      on:htmlHintThreshold={() => showHtmlHintThreshold(data.summary, user)}
      on:perfThreshold={() => showPerfThreshold(data.summary, user)}
    />
    
    <DetailsCard
      build={data ? data : {}} 
      htmlRules={componentType === 'Code' ? htmlRules : {}} 
    />
    
    <Tabs build={data ? data : {}} displayMode={componentType} />
    
    <slot />
    
    <div class="text-left text-xs mt-3 mb-3">
        <span class="font-sans">
          CodeAuditor Version: {data.summary.buildVersion}
        </span>
    </div>
</div>

{#if !(Object.keys(threshold).length === 0)}
  <UpdateHtmlRules 
    url={scanUrl}
    loading={loadingHtmlHintSettings}
    bind:show={htmlHintRulesShown}
    {user}
    {htmlRules}
    {threshold}
    {customHtmlRuleOptions}
    on:htmlHintThreshold={() => showHtmlHintThreshold(data.summary, user)}
    on:updateHtmlRules={() => getCustomHtmlRuleOptions()}
  />
{:else}
  <UpdateHtmlRules 
    url={scanUrl}
    loading={loadingHtmlHintSettings}
    bind:show={htmlHintRulesShown}
    {user}
    htmlRules={null}
    threshold={null}
    {customHtmlRuleOptions}
    on:htmlHintThreshold={() => showHtmlHintThreshold(data.summary, user)}
    on:updateHtmlRules={() => getCustomHtmlRuleOptions()}
  />
{/if}

<UpdatePerfThreshold
  url={scanUrl}
  loading={loadingPerfSettings}
  {lastBuild}
  {threshold}
  bind:show={perfThresholdShown}
  {user} />