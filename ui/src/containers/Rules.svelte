<script>
  import { customHtmlHintRules, htmlHintRules, RuleType } from "../utils/utils";
</script>
<style>
  .link, .text {
    color: black;
    text-decoration: solid underline 1px #aaa;
  }
</style>
<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      <h1>CodeAuditor Rules</h1>
      <h2>SSW Rules</h2>
      <ol class="list-decimal">
      {#each customHtmlHintRules as rule}
        <li>
          <span class="inline-flex items-baseline">
            <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'} mr-1" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i>
            <a target="_blank" class="{rule.ruleLink ? 'link hover:text-red-600' : 'text cursor-text'} inline-block align-baseline" href={rule.ruleLink}>
              {rule.displayName}
            </a>
          </span>
        </li>
      {/each}
      </ol>
    </article>
    <article class="markdown-body mt-6">
      <h2>HtmlHint Rules</h2>
      <ol class="list-decimal">
      {#each htmlHintRules as rule}
        <li>
          <span class="inline-flex items-baseline">
            <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'} mr-1" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i>
            <a target="_blank" class="inline-block align-baseline link hover:text-red-600" href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">
              {rule.displayName}
            </a>
          </span>
        </li>
      {/each}
      </ol>
    </article>
  </div>
</div>