# SSW Code Auditor

[![Build Status](https://github.com/SSWConsulting/SSW.CodeAuditor/workflows/CI/badge.svg)](https://github.com/SSWConsulting/SSW.CodeAuditor/actions)
[![Docker Pull](https://badgen.net/docker/pulls/sswconsulting/codeauditor?icon=docker&label=pulls)](https://hub.docker.com/r/sswconsulting/codeauditor)
[![Docker Size](https://badgen.net/docker/size/sswconsulting/codeauditor/latest/amd64?icon=docker&label=size)](https://hub.docker.com/r/sswconsulting/codeauditor)

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90211512-3c539e00-de34-11ea-900c-ace63b13e387.png" width="300"/>
</p>

SSW CodeAuditor is a code and link analysis tool that allows users to identify broken links or code, view the overall performance of your website, ensuring large, complex source code can be simplified, cleaned and maintained. With CodeAuditor, you can:
  - View prior scan history - View previous scan results
  - Export to CSV - Export scan result to CSV to perform further analysis (PowerBI)
  - View Lighthouse report - See Lighthouse numbers within CodeAuditor
  - Set Lighthouse threshold - E.g. If performance is less than 80 and SEO score is less than 100, fail the build
  - Ignore broken links - Ignored URLs will not cause build to fail
  - View code errors - View HTML code errors and code errors within CodeAuditor

## Architecture Diagram
![image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d588c0ab-52d9-44f7-ac6c-75eacf0c7437)

**Figure: CodeAuditor Architecture Diagram**

## Usage

1. Sign up for free at https://codeauditor.com and get your token
2. Make sure [Docker](https://docs.docker.com/desktop/) is installed and running on your local machine
3. Use the token from step 1 and run the follow Docker command
``` bash
docker run sswconsulting/codeauditor <YourToken> --url <URL>
```

<p align='center'>
<img src='https://user-images.githubusercontent.com/67776356/90726194-aa9cd280-e304-11ea-805c-d8780088d691.gif' width='700' alt='npm start' />
</p>

## CodeAuditor Workflow

Additionally, you can also use CodeAuditor Workflow on GitHub Marketplace and run it as part of your GitHub Action simply by following the steps from [CodeAuditor Workflow](https://github.com/marketplace/actions/codeauditor-workflow)

Make sure you specifying the following inputs:

| name         | required | type  | description |
| ------------ | ---      | ------ | ----------- |
| GitHub_Token        | yes      | string | Your repo default GitHub token i.e. using "\${{ github.token }}"
| | | | Make sure you grant the [token permission](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs) to create issue
| token     | yes      | string | Your personal CodeAuditor token that can be found on CodeAuditor's How It Works page
| url       | yes      | string | The url used on your CodeAuditor scan
| AlertIssue       | no      | boolean | Set to "true" if you want to switch on issue alert feature
| GoMaxthread       | no      | number | Set the maximum number of threads for Golang web scraping (Default is 100)

**Example usage**

``` yml
name: Test CodeAuditor Workflow

jobs:
  build:
    runs-on: ubuntu-latest
    permissions: 
      issues: write
    steps:
      - uses: actions/checkout@v3
      - name: CodeAuditor Feedback Loop Workflow
        uses: tombui99/codeauditor-github-workflow@v1.0.0
        with:
          # Your CodeAuditor token
          token: \${{ secrets.CODEAUDITORTOKEN }}
          # Your Scan URL
          url: \${{ vars.SCANURL }}
          # Your GitHub Token
          GitHub_Token: \${{ github.token }}
```

## To start developing CodeAuditor:
We always welcome contributions. If you are interested in contributing, please take a look at our [CONTRIBUTING](./CONTRIBUTING.md) guide

### Table of Content

1. [General](CONTRIBUTING.md#General)
2. [System Pre-reqs](CONTRIBUTING.md#system-pre-reqs)
3. [Required Tools](CONTRIBUTING.md#required-tools)
4. [Change flow](CONTRIBUTING.md#change-flow)
5. [Definition of Done](CONTRIBUTING.md#definition-of-done)
6. [Deployment](CONTRIBUTING.md#Deployment)
7. [Running the Project](CONTRIBUTING.md#Running-the-Project)
8. [Testing your changes locally](CONTRIBUTING.md#Testing-your-changes-locally)
8. [Adding your own custom HTML rule](CONTRIBUTING.md#Adding-your-own-custom-HTML-rule)

## Technologies used in CodeAuditor

### Front End:
[SvelteJs](https://svelte.dev/) - Free and open-source JavaScript framework

### Back End:
[Firebase](https://firebase.google.com/) - CodeAuditor uses Firebase API, allowing developers to avoid managing servers or writing server-side code
#### Why Firebase?
- Easy to use and save a lot time because all the server operations and internal functions are taken care of by the Firebase interface 
- Developers can spend more time developing the app
- The idea of firebase is to quickly validate your idea then you can simply migrate that to a proper "enterprise" set up

### Tool:
[Docker](https://www.docker.com/) - Platform as a service (PaaS) product that uses OS-level virtualization to deliver software in packages

## Getting help
 - Leave comments on your PR and @ people for attention
 - Bring it up with the team
 - Edit the Wiki
 - For help: email the Product Champion or ask on Teams
