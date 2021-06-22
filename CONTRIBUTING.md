# Contributor Onboarding

## General

 - The goal of this guide is to help you start contributing to CodeAuditor

## System Pre-reqs

 - OS
    - Windows 10 (suggested)
 - Language runtimes
    - Javascript
 - Editor
    - Visual Studio or Visual Studio Code (latest version recommended)
    
## Required Tools
- Install nodejs via [NodeJs](https://nodejs.org/en/) (required versions: ^8.10.0 or ^10.13.0 or >=11.10.1)
- Install Docker for Windows via [Docker for Windows](https://docs.docker.com/docker-for-windows/)

## Change flow

The general flow for making a change to the script host is:
1. 👍🏻 Make sure your Github account is in SSW Organization
2. 🍴 Clone the repo (clone the project via `git clone <clone url here>`
3. 🌳 Create a branch for your change (generally use dev) (`git checkout -b my-change`)
4. 🛠 Make your change
5. ✔️ Test your changes
6. 📌 Commit your changes (`git commit -am 'your commit message'`)
6. ⬆️ Push your changes to your fork (`git push me my-change`)
7. 💌 Open a PR to the dev branch
8. 📢 Address feedback and make sure tests pass (yes even if it's an "unrelated" test failure)
9. ✂️ Delete your branch (optional) 

## Definition of Done

- Code Compiles
- Check the Acceptance Criteria.
- Code is squash-merged to main via a pull request that was approved by a 2nd developer.
- Another team member agrees it’s ready for Production.
- Pushed to Production.
- Use @Mention (**OR** Send email) to notify Product Owner/PBI stakeholder that PBI is done (be sure to include screenshots/done video as proof) 

> <As per rule: [Done - Do you go beyond 'Done' and follow a 'Definition of Done'](https://rules.ssw.com.au/done-do-you-go-beyond-done-and-follow-a-definition-of-done)?>

## Deployment

🚀 Once your Pull Request has been approved, your changes will get deployed to production automatically

## Running the Project

1. To run the web UI, open your terminal in Visual Studio or Visual Studio Code and type the following:  
``` bash
$ cd ui
$ npm i
$ npm run dev
```

2. To build your docker image, first make sure that Docker is running then type the following in your terminal:
``` bash
$ cd docker
$ docker build -t sswconsulting/codeauditor .
```

3. To run the Firebase API, type the following in your terminal:
``` bash
$ cd api
$ npm i
$ npm run serve
```

## Testing your changes locally 
1. Front-End UI  
In order to test your code changes in the UI
- Make the changes in the **ui** folder
- Make sure the ui is already running (`npm run dev`)
- View the changes in your browser via `localhost:5000`

2. Docker  
In order to test your code changes in Docker 
- Make the changes in the **docker** folder
- Rebuild the Docker image (`docker build -t sswconsulting/codeauditor .`)
- Run CodeAuditor code in Powershell to see the changes (`$ docker run sswconsulting/codeauditor --token 3c34a549-dfb3-442c-b0e3-45942104a8bf --url <URL> --buildId [BUILDID]`) 

3. Firebase API  
In order to test your code changes in the API
- Make the changes in the **api** folder
- Run the api (`npm run serve`)
- View the changes in *console.firebase.google* (contact Anthony for authentication)

## Adding your own custom HTML rule
1. In your local repo, go to ```docker/customHtmlRules.js```
2. Have a look at [HtmlHint Rules](https://github.com/htmlhint/HTMLHint/tree/master/src/core/rules) to see how you can code your own custom rule
3. Add your custom Rule under ```// Add new custom rule below``` using the following template:
```javascript
 HTMLHint.addRule({
        id: "your-custom-rule-id",
        description: "Your custom rule description",
        init: function (parser, reporter) {
          // Your rule logic
          });
        },
      })
```
**Important:** 
- Use ``` reporter.warn ``` if you want to report your custom rule violation as **warning**
- Use ``` reporter.error ``` if you want to report your custom rule violation as **error**
4. Go to ```docker/api.js```: On the last export named ```htmlHintConfig```, add your new custom rule id to the list using the following format:
E.g: 
```javascript
 exports.htmlHintConfig = {
   your-custom-rule-id: true,
   ...
 }
```
5. Go to ```ui/src/utils/utils.js```: On the last export named ```customHtmlHintRules```, add your new custom rule id to the list using the following format:
E.g: 
```javascript
 export const customHtmlHintRules = [
   { rule: "your-custom-rule-id" },	
   ...
];
```
6. Make a Pull Request and have it checked by CodeAuditor Team
