<script>
  import Icon from "../components/Icon.svelte";
  export let build = {};
  export let runId;
  export let displayMode = "";
</script>

<p class="text-sm text-gray-800 pb-3 pt-4">
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <a
    class="inline-block align-baseline text-blue hover:text-blue-darker"
    href="/">
    Builds
  </a>
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <span class="inline-block align-baseline text-blue hover:text-blue-darker">
    {build.buildId !== '-' ? build.buildId : runId}
  </span>
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <span class="inline-block align-baseline text-blue hover:text-blue-darker">
    {displayMode}
  </span>
</p>
