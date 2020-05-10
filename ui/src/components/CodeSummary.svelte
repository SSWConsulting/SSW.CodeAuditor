<script>
  import Icon from "./Icon.svelte";
  import { getHtmlIssuesDescriptions } from "../utils/utils.js";
  export let value = {};
  let otherLangs = [];
  $: cloc = value.cloc ? JSON.parse(value.cloc) : null;
  $: htmlIssues = value.htmlIssuesList
    ? getHtmlIssuesDescriptions(value.htmlIssuesList)
    : null;

  $: {
    if (cloc) {
      otherLangs = Object.keys(cloc)
        .filter(x => x !== "header")
        .map(x => ({
          name: x,
          ...cloc[x]
        }));

      console.log(otherLangs);
    }
  }
</script>

<div class="grid grid-cols-3 gap-1 row-gap-2">
  {#if cloc}
    <div class="text-center whitespace-no-wrap mx-auto">
      <Icon classnames="block mx-auto">
        <path
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414
          4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0
          002 2h8a2 2 0 002-2v-2" />
      </Icon>
      <span class="font-bold block text-sm" title="Number of files">
        {cloc.header.n_files}
      </span>
    </div>
    <div class="text-center whitespace-no-wrap mx-auto">
      <Icon classnames="block mx-auto">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </Icon>
      <span class="font-bold block text-sm" title="Number of lines of codes">
        {cloc.header.n_lines}
      </span>
    </div>
  {/if}

  {#if value.htmlIssuesList}
    <div class="text-center whitespace-no-wrap mx-auto">
      <Icon cssClass="text-red-500 block mx-auto">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </Icon>
      <span class="font-bold block mx-auto text-sm" title={htmlIssues}>
        {value.htmlErrors || 0}
      </span>
    </div>
    <div class="text-center whitespace-no-wrap mx-auto">
      <Icon cssClass="text-orange-500 block mx-auto">
        <path
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
          4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </Icon>
      <span class="font-bold block mx-auto text-sm" title={htmlIssues}>
        {value.htmlWarnings || 0}
      </span>
    </div>
    <!-- {#each otherLangs as item}
        <div class="text-center whitespace-no-wrap">
          <span class="font-mono text-sm">
            {item.name === 'JavaScript' ? 'JS' : item.name}:
          </span>
          <span class="font-bold block" title={`${item.comment} files`}>
            {item.code}
          </span>
        </div>
      {/each} -->
  {/if}
</div>
