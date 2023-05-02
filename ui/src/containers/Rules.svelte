<script>
  import { customHtmlHintRules, htmlHintRules, RuleType } from "../utils/utils";
</script>
<style>
  .link, .text {
    color: black
  }
</style>
<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      <h1>CodeAuditor Rules</h1>
      <h2>SSW Rules</h2>
      {#each customHtmlHintRules as rule, i}
      <ol>
        <li>
          <a class="{rule.ruleLink ? 'link hover:text-red-600' : 'text cursor-text'} inline-block align-baseline" href={rule.ruleLink}>
            {i + 1}. 
            <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i> 
            {rule.displayName}
          </a>
        </li>
      </ol>
    {/each}
    </article>
    <article class="markdown-body mt-6">
      <h2>HtmlHint Rules</h2>
        {#each htmlHintRules as rule, i}
        <ol>
          <li>
            <a class="inline-block align-baseline link hover:text-red-600" href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">
              {i + 1}. 
              <i class="{rule.type === RuleType.Error ? 'fas fa-exclamation-circle fa-md' : 'fas fa-exclamation-triangle fa-md'}" style="{rule.type === RuleType.Error ? 'color: red' : 'color: #d69e2e'}"></i> 
              {rule.displayName}
            </a>
          </li>
        </ol>
        {/each}
    </article>
  </div>
</div>