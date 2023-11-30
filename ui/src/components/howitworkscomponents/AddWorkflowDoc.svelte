<script>
    import * as marked from "marked";

    const workflowInstruction = 
`# How to Integrate CodeAuditor Workflow into your GitHub build pipeline
#### 1. Go to CodeAuditor Workflow GitHub Marketplace at https://github.com/marketplace/actions/codeauditor-workflow
#### 2. Click on "Use latest version" green button on top right
#### 3. Copy and Paste the installation snippet

<a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/8fd73e0a-9b23-4bc6-b7f6-fdf35a04a46a" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/4e3e01a7-63d2-4192-949f-a162ea6a784b"
    />
</a>

**Figure: CodeAuditor Workflow Installation Snippet**

#### 4. Add the following required inputs

| name         | required | type  | description |
| ------------ | ---      | ------ | ----------- |
| GitHub_Token        | yes      | string | Your GitHub personal access token used to fetch data. Pass a secret by for instance using 'secrets.GH_TOKEN'. [Go here](https://github.com/settings/tokens/new?scopes=read:user) to generate one
| token     | yes      | string | Your personal CodeAuditor token that can be found on CodeAuditor's How It Works page
| url       | yes      | string | The url used on your CodeAuditor scan

## Example usage

\`\`\` yml
name: Test CodeAuditor Workflow

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: CodeAuditor Workflow
        uses: SSWConsulting/codeauditor-scan-site@1.0.0
        with:
          # Your Scan URL
          url: $\{{ vars.SCANURL }}
          # Your CodeAuditor token
          token: $\{{ secrets.CODEAUDITORTOKEN }}
          # Your GitHub Token
          GitHub_Token: $\{{ secrets.GH_TOKEN }}

\`\`\`
`
</script>

<article class="markdown-body">
    {@html marked.parse(workflowInstruction)}
</article>