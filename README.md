# SSW Code Auditor

[![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)](https://travis-ci.org/badges/badgerbadgerbadger)

<img src="https://user-images.githubusercontent.com/67776356/90211512-3c539e00-de34-11ea-900c-ace63b13e387.png" width="300"/>

SSW CodeAuditor is a code and link analysis tool that allows users to identify broken links or code, view the overall performance of your website, ensuring large, complex source code can be simplified, cleaned and maintained. Code Auditor features include:
  - View prior scans history - Can keep your last 100 scan results for FREE
  - Export to CSV - Export scan result to CSV to perform further analysis (e.g on PowerBI)
  - View Lighthouse Report - View Lighthouse Report without leaving the app
  - Set Lighthouse Threshold - If Performance is less than 80 and SEO score is less than 100, fail the build
  - Ignore broken Links - Ignored URLs will not cause build to fail
  - View Code Errors - View HTML code errors and Code errors without leaving the app
  
## Demo
Here is the working web :  https://codeauditor.com/

## Site
### Home Page

<img src="https://user-images.githubusercontent.com/67776356/90588473-0db43980-e21f-11ea-8ea1-c3b8c098925b.png" width="900"/>

### Build Page (Bad Links)

<img src="https://user-images.githubusercontent.com/67776356/90588601-5cfa6a00-e21f-11ea-882f-f33d672e59ac.png" width="900"/>

### Build Page (Bad Codes)

<img src="https://user-images.githubusercontent.com/67776356/90588612-61bf1e00-e21f-11ea-854b-509b700fc0a1.png" width="900"/>

### Lighthouse Audit Result Page

<img src="https://user-images.githubusercontent.com/67776356/90588613-64ba0e80-e21f-11ea-9669-7c17070176d0.png" width="900"/>

## Usage
### Pre-reqs
- Make sure you are logged in CodeAuditor
- Make sure Docker is running 
### Instruction
1. Run the code in Powershell (or Command Prompt) to scan your website
![1](https://user-images.githubusercontent.com/67776356/90595895-275e7c80-e231-11ea-962c-ca93fdff8281.gif)

2. Use the generated URL to navigate to your Build page
![2](https://user-images.githubusercontent.com/67776356/90596318-0ea29680-e232-11ea-9146-1b0853a81164.gif)

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
