<script>
  import { updateQuery, CONSTS } from "../../utils/utils.js";
  import Icon from "../misccomponents/Icon.svelte";
  import Modal from "../misccomponents/Modal.svelte";
  import LoadingFlat from "../misccomponents/LoadingFlat.svelte";
  import ParsedQuery from "query-string";
  import HtmlErrorsBySource from "./HtmlErrorsBySource.svelte";
  import HtmlErrorsByReason from "./HtmlErrorsByReason.svelte";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let errors = [];
  export let codeIssues = [];
  export let currentRoute;

  let displayMode = 0;
  let viewUrlSource = "";
  let viewLocation = "";
  let ruleName = "";
  let codeLocation = "";
  let source;
  let showSource;
  let loading;
  let codeViewer;
  let codediv;
  const dismiss = () => {
    showSource = false;
    codeViewer = null;
    codediv.innerHTML = "";
  };

  const dispatch = createEventDispatcher();
  const download = () => dispatch("download");

  function showSourceWindow() {
    showSource = true;
    setTimeout(() => {
      const element = document.getElementById("codeEditor");
      console.log("element", element);
      codeViewer = window.CodeMirror(element, {
        value: source,
        mode: "htmlmixed",
        lineNumbers: true,
        styleSelectedText: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers"]
      });
      codeViewer.setSize("100%", "100%");

      const [line, char] = viewLocation.split(":");
      codeViewer.scrollIntoView({ line: +line, char: +char }, 400);

      codeViewer.markText(
        { line: line - 1, ch: +char },
        { line: line - 1, ch: +char + 50 },
        { className: "border border-red-500 bg-red-200" }
      );
    }, 10);
  }

  async function viewPageSource(event) {
    viewLocation = event.detail.location;
    if (viewUrlSource === event.detail.url) {
      showSourceWindow();
      return;
    }

    viewUrlSource = event.detail.url;
    ruleName = event.detail.key;
    showSource = true;
    loading = true;
    const res = await fetch(
      `${CONSTS.API}/api/viewsource?url=${encodeURIComponent(viewUrlSource)}`
    );
    source = await res.text();

    const options = { indent_size: 2, space_in_empty_paren: true }

    source = html_beautify(source, options)

    loading = false;
    showSourceWindow();
  }

  async function viewCode(event) {
    source = event.detail.snippet;
    viewUrlSource = event.detail.url;
    ruleName = event.detail.key;
    codeLocation = event.detail.location;
    viewLocation = "4:0";
    showSourceWindow();
  }

  const changeMode = m => {
    displayMode = m;
    updateQuery(ParsedQuery.stringify({ displayMode }));
  };

  onMount(() => {
    if (currentRoute && currentRoute.queryParams.displayMode) {
      setTimeout(() => {
        changeMode(+currentRoute.queryParams.displayMode);
      }, 0);
    }
  });
</script>

<style>
  .active {
    background: white;
    color: #cc4141;
  }
  .active:focus {
    color: #cc4141;
  }
  .active:visited {
    color: #cc4141;
  }
  #codeEditor {
    height: 100%;
  }
</style>

{#if errors.length === 0 && codeIssues.length === 0}
  <div class="mb-6 text-center text-xl py-8">
    <Icon cssClass="inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
    No HTML issues found in this build!!
    <Icon cssClass="inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
  </div>
{:else}
  <div class="my-4">
    <div
      class="bg-gray-200 text-sm textgrey leading-none border-2 border-gray-200
      rounded-full inline-flex">
      <button
        on:click={() => changeMode(0)}
        class:active={displayMode === 0}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-l-full px-4 py-2">
        <span>By Page</span>
      </button>
      <button
        on:click={() => changeMode(1)}
        class:active={displayMode === 1}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-r-full px-4 py-2">
        <span>By Reason</span>
      </button>
    </div>
    <div class="float-right">
      <button
        on:click={download}
        title="Download CSV"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-1
        rounded-lg inline-flex items-center">
        <Icon cssClass="">
          <path
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </Icon>
      </button>
    </div>
  </div>

  {#if displayMode === 0}
    <HtmlErrorsBySource
      {errors}
      {codeIssues}
      on:viewSource={viewPageSource}
      on:viewCode={viewCode} />
  {:else}
    <HtmlErrorsByReason
      {errors}
      {codeIssues}
      on:viewSource={viewPageSource}
      on:viewCode={viewCode} />
  {/if}
{/if}

<Modal
  bind:show={showSource}
  header={ruleName + ': ' + viewUrlSource}
  on:dismiss={dismiss}
  full={true}>
  {#if loading}
    <LoadingFlat />
  {/if}
  <div id="codeEditor" bind:this={codediv} class:border={!loading} />
</Modal>
