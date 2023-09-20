<script>
  import Icon from "./Icon.svelte";
  export let displayMode = "";
</script>

<p class="hidden md:block text-sm textdark pb-3 pt-4">
  <a
    class="inline-block align-baseline text-blue hover:text-blue-darker"
    href="/">
    Home
  </a>
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <a
    class="inline-block align-baseline text-blue hover:text-blue-darker"
    href="/explore">
    Scans
  </a>
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <span class="inline-block align-baseline text-blue hover:text-blue-darker">
    Scan Results
  </span>
  <Icon cssClass="inline-block" height="20" width="20">
    <path d="M9 5l7 7-7 7" />
  </Icon>
  <span class="inline-block align-baseline text-blue hover:text-blue-darker">
    {displayMode}
  </span>
</p>
