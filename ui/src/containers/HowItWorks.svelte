<script>
  import { userSession$ } from "../stores";
  import marked from "marked";
  import firebase from "firebase/compat/app";
  import { CONSTS } from "../utils/utils.js";
  
  let unsubscription;

  let tokenText;
  userSession$.subscribe((x) => {
    if (x) {
      unsubscription = firebase
          .firestore()
          .collection(CONSTS.USERS)
          .doc(x.uid);
      tokenText = '--token ' + x.apiKey;
    }
    else {
      tokenText = '';
    }
  });

  const systemRequirements = `
  ## System requirements
  Make sure your system meets the following requirements:
  \`\`\` bash
  - Have Docker Desktop running in the background 
  - Have at least 1GB of storage to download the Docker image
  \`\`\``;

  const instruction = `
  ## How to Use CodeAuditor
  Scan any website for broken links, [HTML Issues](https://htmlhint.com), [Google Lighthouse Audit](https://developers.google.com/web/tools/lighthouse) and [Artillery Load Test](https://artillery.io/) by running the following command:
  \`\`\` bash
  $ docker container run --cap-add=SYS_ADMIN sswconsulting/codeauditor ${tokenText} --url <URL>
  \`\`\`
  `;

  const instructionSteps = `
  ## Instructions to scan an URL 
  ### On Windows 
  \`\`\` bash
  1. Download Docker for Windows at https://docs.docker.com/docker-for-windows/install/
  2. Follow the installation steps and run Docker
  3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor ${tokenText} --url <URL>
  4. Open Windows Powershell and paste the above command, replace <URL> with your designated url 
    (make sure to include the full URL with 'https')
  5. Once scan is complete, a result script will display which gives you a link to your scan result page
  \`\`\`

  ### On Mac 
  \`\`\` bash
  1. Download Docker for Mac at https://docs.docker.com/docker-for-mac/install/
  2. Follow the installation steps and run Docker
  3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor ${tokenText} --url <URL>
  4. Open the Terminal and paste the above command, replace <URL> with your designated url 
    (make sure to include the full URL with 'https')
  5. Once scan is complete, a result script will display which gives you a link to your scan result page
  \`\`\``;

  const addingCustomRule = `
  ## How to Add Custom HTML Hint Rules
  #### 1. Go to our GitHub and clone the project at https://github.com/SSWConsulting/SSW.CodeAuditor
  #### 2. Have a look at [HtmlHint Rules](https://github.com/htmlhint/HTMLHint/tree/master/src/core/rules) to view sample existing rules
  #### 3. In your local repo, go to \`\`\` docker/customHtmlRules.js \`\`\`
  #### 4. Add your custom Rule under \`\`\`// Add new custom rule below\`\`\` using the following template:  
  \`\`\` js
  HTMLHint.addRule({
        id: "your-custom-rule-id",
        description: "Your custom rule description",
        init: function (parser, reporter) {
          // Your rule logic
        }
      })
  \`\`\`
  **IMPORTANT:** <br />
  Use \`\`\` reporter.warn \`\`\` if you want to report your custom rule violation as a **warning** <br />
  Use \`\`\` reporter.error \`\`\` if you want to report your custom rule violation as a **error**

  #### 5. Go to \`\`\`docker/api.js\`\`\`: On the last export named \`\`\`htmlHintConfig\`\`\`, add your new custom rule id to the list using the following format:
  \`\`\` js
  exports.htmlHintConfig = {
    your-custom-rule-id: true,
    ...
    }
  \`\`\`
  #### 6. Go to \`\`\`ui/src/utils/utils.js\`\`\` On the last export named \`\`\`customHtmlHintRules\`\`\` add your new custom rule id to the list using the following format:
  \`\`\` js
  export const customHtmlHintRules = [
   { rule: "your-custom-rule-id" },	
   ...
  ];
  \`\`\`
  #### 7. Make a Pull Request and have it checked by CodeAuditor Team`;
  
  const emailAlertInstruction = `
  ## How to send automated Email Alert for future scans
  #### 1. Click on "Send Email Alerts" to open the modal
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d466a84e-b142-4185-880a-1d60dac78d41)
  **Figure: Send Email Alerts button**

  #### 2. Add or remove email addresses to receive alert
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/4b7492d0-5dde-4b6c-be43-e1b05b98fb89)
  **Figure: Email alerts modal**

  #### 3. After you run your next scan, the email addresses will receive automated email alerts 
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/69b44d1b-22b3-477c-8ab4-19560d88e64d)
  **Figure: Sample email alerts**
  `

  const scanCompareInstruction = `
  ## How to compare to latest scan
  #### 1. Click on "Compare to latest scan" to go to scan compare page
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/a0b1c84a-8dd7-42d8-9366-587c14d09596)
  **Figure: Scan compare button**

  #### 2. Select in the dropdown list to choose which previous scan you want to compare to the latest one
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d0978ed2-417d-4085-907e-ae4fc6a8b20b)
  **Figure: Scan comparison page**
  `
  
  const customRuleConfig = `
  ## How to Use Custom HTML Rules Configuration
  #### 1. Click on "Enabled Rules" 
  ![image](https://user-images.githubusercontent.com/67776356/229018349-ab11cb85-1650-41c5-b3e5-af3e81a53bc0.png)
  **Figure: Enabled Rules button**

  #### 2. Select which custom rules you want for your next scan  
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/f6d09566-0ff8-4ef8-a120-53fade615689)
  **Figure: Custom rule selection modal**

  #### 3. After you run your next scan, you should only be able to see the scan results for your selected html rules
  ![image](https://user-images.githubusercontent.com/67776356/229019594-39b9e95e-c91b-41f8-b3a4-e33d370bad0c.png)
  **Figure: Custom rule selection modal**
  `
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body mt-5">
      <h1>SSW CodeAuditor - How It Works</h1>
      <h3>What is CodeAuditor?</h3>
      <p>
        CodeAuditor is a tool that automatically scans your website and its code to check 
      </p>
      <ul class="list-disc">
        <li>Find broken Links - Links to pages which do not work</li>
        <li>Check HTML formatting - May cause pages to be incorrectly shown to the user</li>
        <li>Lighthouse scan - Audits for performance, accessibility, SEO, and more</li>
        <li>Artillery load test - See how website behaves when lot of users access it simultaneously</li>
      </ul> 
    </article>
    <article class="markdown-body mt-5">
      <h3>How does it work?</h3>
      <p>
        CodeAuditor runs scans and checks for issues on your website, and can then generate a report which can be viewed online.
      </p>
      <p>
        CodeAuditor is simple to use and can be either be run manually, or embedded directly into your build pipeline where it can be configured to automatically fail a build based on a number of broken links, SEO issues or other rules failures to ensure quality.
      </p>
      <p>Signing up for free and logging in to CodeAuditor will allow you to view and track your website's changes and improvements over time.</p>
    </article>
    <article class="markdown-body mt-5">
      <h3>What are the benefits?</h3>
      <p>
        CodeAuditor will automatically pick up and report issues which may exist in your website during the build process which enables you to catch any issues and fix them before they are published and cause bigger problems.
      </p>
    </article>
  </div>
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <article class="markdown-body">
        {@html marked.parse(instruction)}
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(systemRequirements)}
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(instructionSteps)}
      </article>
      <article class="markdown-body mt-8">
        <h3>Video - How to use Code Auditor:</h3>
        <div>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DCDAtmvaPUY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(emailAlertInstruction)}
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(scanCompareInstruction)}
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(customRuleConfig)}
      </article>
      <article class="markdown-body mt-8">
        {@html marked.parse(addingCustomRule)}
      </article>
      <article class="markdown-body mt-8">
        <h3>Video - How To Add, Test and Deploy Custom HTML Rules (For Devs):</h3>
        <div>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/iduwnyzdcFo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </article>
  </div>
</div>