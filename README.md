# SSW Code Auditor

[![Build Status](https://github.com/SSWConsulting/SSW.CodeAuditor/workflows/CI/badge.svg)](https://github.com/SSWConsulting/SSW.CodeAuditor/actions)
[![Docker Pull](https://badgen.net/docker/pulls/sswconsulting/codeauditor?icon=docker&label=pulls)](https://hub.docker.com/r/sswconsulting/codeauditor)
[![Docker Size](https://badgen.net/docker/size/sswconsulting/codeauditor/latest/amd64?icon=docker&label=size)](https://hub.docker.com/r/sswconsulting/codeauditor)

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90211512-3c539e00-de34-11ea-900c-ace63b13e387.png" width="300"/>
</p>

SSW CodeAuditor is a code and link analysis tool that allows users to identify broken links or code, view the overall performance of your website, ensuring large, complex source code can be simplified, cleaned and maintained. With CodeAuditor, you can:
  - View prior scan history - Keep your last 100 scan results for FREE
  - Export to CSV - Export scan result to CSV to perform further analysis (PowerBI)
  - View Lighthouse report - See Lighthouse numbers within CodeAuditor
  - Set Lighthouse threshold - E.g. If performance is less than 80 and SEO score is less than 100, fail the build
  - Ignore broken links - Ignored URLs will not cause build to fail
  - View code errors - View HTML code errors and code errors within CodeAuditor

## Architecture Diagram
![CodeauditorDiagram-2](https://user-images.githubusercontent.com/67776356/111734262-e2392080-88cd-11eb-8f17-8df240fbafbe.png)


## Usage

1. Sign up for free at https://codeauditor.com and get your token
2. Make sure [Docker](https://docs.docker.com/desktop/) is installed and running on your local machine
3. Use the token from step 1 and run a command from the [Homepage](https://codeauditor.com/home) 

<p align='center'>
<img src='https://user-images.githubusercontent.com/67776356/90726194-aa9cd280-e304-11ea-805c-d8780088d691.gif' width='700' alt='npm start' />
</p>

## Site
### Home Page

<p align='center'>
<img width="3008" alt="image" src="https://user-images.githubusercontent.com/67776356/111554107-cd7b6080-87d9-11eb-9fdd-02ece996a9d4.png">
</p>

### Links Tab

<p align='center'>
<img width="3008" alt="image" src="https://user-images.githubusercontent.com/67776356/111554211-fef42c00-87d9-11eb-95e5-a166696776af.png">
</p>

### Code Issue Tab (HTML Hint)

<p align='center'>
<img width="3008" alt="image" src="https://user-images.githubusercontent.com/67776356/111554237-087d9400-87da-11eb-880f-96af1c7cf07a.png">
</p>

### Lighthouse Audit Tab

<p align='center'>
<img width="3008" alt="image" src="https://user-images.githubusercontent.com/67776356/111554329-39f65f80-87da-11eb-9f6e-76ee2275eaf1.png">
</p>

### Artillery Load Test Tab

<p align='center'>
<img width="3008" alt="image" src="https://user-images.githubusercontent.com/67776356/111554279-1e8b5480-87da-11eb-8776-ee1d276b1235.png">
</p>

## To start contributing to CodeAuditor:
We always welcome contributions. If you are interested in contributing, please take a look at our [CONTRIBUTING](./CONTRIBUTING.md) guide

## Technologies used in SugarLearning

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
