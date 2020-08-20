# SSW Code Auditor

[![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)](https://travis-ci.org/badges/badgerbadgerbadger)

<img src="https://user-images.githubusercontent.com/67776356/90211512-3c539e00-de34-11ea-900c-ace63b13e387.png" width="300"/>

  SSW CodeAuditor is a code and link analysis tool that allows users to identify broken links or code, view the overall performance of your website, ensuring large, complex source code can be simplified, cleaned and maintained. With CodeAuditor, you can:
  - View prior scan history - Keep your last 100 scan results for FREE
  - Export to CSV - Export scan result to CSV to perform further analysis (PowerBI)
  - View Lighthouse report - See Lighthouse numbers within CodeAuditor
  - Set Lighthouse Threshold - E.g. If Performance is less than 80 and SEO score is less than 100, fail the build
  - Ignore broken Links - Ignored URLs will not cause build to fail
  - View Code Errors - View HTML code errors and Code errors without leaving the app

## Usage

- Sign up for free at https://codeauditor.com and get your token
- Make sure [Docker!](https://docs.docker.com/desktop/) is installed and running on your local machine
- Run the command to scan your website

<p align='center'>
<img src='https://user-images.githubusercontent.com/67776356/90599510-588e7b00-e238-11ea-903b-bfc811a4b60e.gif' width='600' alt='npm start'>
</p>

## Site
### Home Page

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90588473-0db43980-e21f-11ea-8ea1-c3b8c098925b.png" width="700"/>
</p>

### Build Page (Bad Links)

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90588601-5cfa6a00-e21f-11ea-882f-f33d672e59ac.png" width="700"/>
</p>

### Build Page (Bad Codes)

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90588612-61bf1e00-e21f-11ea-854b-509b700fc0a1.png" width="700"/>
</p>

### Lighthouse Audit Result Page

<p align='center'>
<img src="https://user-images.githubusercontent.com/67776356/90588613-64ba0e80-e21f-11ea-9669-7c17070176d0.png" width="700"/>
</p>

## To start contributing to CodeAuditor:
We always welcome contributions. If you are interested in contributing, please take a look at our [CONTRIBUTING](./CONTRIBUTING.md) guide

## Technologies used in SugarLearning

### Front End:
- [SvelteJs](https://svelte.dev/) - Free and open-source JavaScript framework

### Back End:
- [Firebase](https://firebase.google.com/) - CodeAuditor uses Firebase API that allows to use the service without having to manage servers or write server-side code

### Tool:
- [Docker](https://www.docker.com/) - Platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages

## Getting help

 - Leave comments on your PR and @ people for attention
 - Bring it up with the team
 - Edit the Wiki
 - For help: email the Product Champion or ask on Teams
