<script>
  import { customHtmlHintRules, htmlHintRules } from "../utils/utils";
</script>
<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      <h1>CodeAuditor Rules</h1>
      <h2>HtmlHint Rules</h2>
        {#each htmlHintRules as rule}
        <div>
          <a class="inline-block align-baseline link" href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">{rule.displayName}</a>
        </div>
        {/each}
    </article>
    <article class="markdown-body mt-3">
      <h2>SSW Rules</h2>
      {#each customHtmlHintRules as rule}
      <div>
        <a class="{rule.ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline" href={rule.ruleLink}>{rule.displayName}</a>
      </div>
    {/each}
    </article>
  </div>
</div>