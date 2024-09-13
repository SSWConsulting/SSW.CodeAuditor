# Contributor Onboarding

## General

 - The goal of this guide is to help you start contributing to CodeAuditor

## System Pre-reqs

 - OS
    - Windows 11
    - Mac OS Sonoma
 - Language runtimes
    - Javascript
 - Editor
    - Visual Studio or Visual Studio Code (latest version recommended)
    
## Required Tools
- Install nodejs via [NodeJs](https://nodejs.org/en/) (required versions: >=16.20.1)
- Install Docker Desktop via [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Change flow

The general flow for making a change to the script host is:
1. 👍🏻 Make sure your Github account is in SSW Organization
2. 🍴 Clone the repo (clone the project via `git clone https://github.com/SSWConsulting/SSW.CodeAuditor.git`
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

#### Step 1: Create and Submit a Pull Request

The first step in our deployment process is to ensure that all changes are properly reviewed before they are deployed. When you are ready to submit your changes, create a Pull Request (PR) from your feature branch.

#### Step 2: Approval and Merge to Main

Once your Pull Request is created, it will go through a review process. During this time, your team members will review the code, provide feedback, and request any necessary changes. After your PR has been approved, it is ready to be merged into the ```main``` branch.

#### Step 3: Deployment to Staging via GitHub Workflow

As soon as your changes are merged into the ```main``` branch, our CI/CD pipeline kicks in. We have set up a GitHub Workflow that listens for changes to the ```main``` branch and will build and deploy to our Staging and Production environments pending approval. This will first trigger an approval request to the project admins to deploy to Staging. Once approved, the changes will be deployed to the Staging site on Firebase.

#### Step 4: Verify Changes on Staging Site

With the changes deployed to the Staging site, the next step is to verify that everything is functioning as expected. Take the time to thoroughly test your changes in the Staging environment. This might include running automated tests, performing manual testing, and validating that new features work as intended and that no regressions have been introduced.

#### Step 5: Deployment to Production via GitHub Workflow

Once you are confident that the changes on the Staging site are stable and meet all the requirements, it's time to deploy them to Production. To do this, a project admin will need to approve the next gated deployment in the GitHub Workflow. This approval will trigger a deployment to our Production site on Firebase and update the Docker image.

#### Step 6: Monitor Production Deployment

After the deployment to Production, monitor the site closely on Firebase Console to ensure that the deployment was successful and that everything is working smoothly. Check for any errors or issues that might have slipped through the Staging testing phase. Address any problems immediately to maintain the stability and reliability of the Production site.

## Running the Project

1. Go to SSW Keeper and look for "SSW CodeAuditor Secrets" to find the values for the `env` files for both the UI and API.

2. To run the web UI, open your terminal in Visual Studio or Visual Studio Code and type the following:  
``` bash
$ cd ui
$ npm i
$ npm run dev
```

3. To build your docker image, first make sure that Docker is running then type the following in your terminal:
``` bash
$ cd docker
$ docker build -t sswconsulting/codeauditor .
```

4. To run the Firebase API, first you need to login to Firebase, chat with the Sysadmin or CodeAuditor team to grant you access to Firebase Console
   
Type the following in your terminal:
``` bash
$ npm i -g firebase-tools
$ firebase login
```
After successful login, type the following:
``` bash
$ cd api/functions
$ npm i
$ npm run serve
```

## Testing your changes locally 
1. Front-End UI  
In order to test your code changes in the UI
- Make the changes in the **ui** folder
- Make sure the ui is already running (`npm run dev`)
- View the changes in your browser via `localhost:4200`

2. Docker  
In order to test your code changes in Docker 
- Make the changes in the **docker** folder
- Rebuild the Docker image (`docker build -t sswconsulting/codeauditor .`)
- Run CodeAuditor code in Powershell to see the changes (`$ docker run sswconsulting/codeauditor --token 3c34a549-dfb3-442c-b0e3-45942104a8bf --url <URL>`) 

3. Firebase API  
In order to test your code changes in the API
- Make the changes in the **api** folder
- Run the api (`npm run serve`)
- Run the API locally via `localhost:5000` (contact @tombui99 for authentication)

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
5. Go to ```docker/rules.js```: On the last export named ```customHtmlHintRules```, add your new custom rule id to the list using the following format:
E.g: 
```javascript
 export const customHtmlHintRules = [
   { rule: "your-custom-rule-id" },	
   ...
];
```
6. Make a Pull Request and have it checked by CodeAuditor Team
