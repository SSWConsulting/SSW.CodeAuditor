<script>
  import { userSession$ } from "../stores";
  import marked from "marked";
  import { navigateTo } from "svelte-router-spa";
  import { onDestroy, onMount } from "svelte";
  import firebase from "firebase/app";
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
      tokenText = '--cap-add=SYS_ADMIN';
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
  $ docker container run sswconsulting/codeauditor ${tokenText} --url <URL>
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
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body mt-5">
      <h1>SSW CodeAuditor - How It Works</h1>
      <h3>What is CodeAuditor?</h3>
      <p>
        CodeAuditor is a tool that automatically scans your website and its code to check 
      </p>
      <ul>
        <li>Broken Links - links to pages which do not work</li>
        <li>HTML Formatting - which may cause pages to be incorrectly shown to the user.</li>
        <li>Lighthouse Scan - audits for performance, accessibility, SEO and more</li>
        <li>Artillary Load Test - load tested to see how it behaves when there are a lot of users accessing it at once</li>
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
        {@html marked(instruction)}
      </article>
      <article class="markdown-body mt-5">
        {@html marked(systemRequirements)}
      </article>
      <article class="markdown-body mt-5">
        {@html marked(instructionSteps)}
      </article>
      <article class="markdown-body mt-5">
        <h3>Video - How to use Code Auditor:</h3>
        <div>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DCDAtmvaPUY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </article>
      <article class="markdown-body mt-5">
        {@html marked(addingCustomRule)}
      </article>
      <article class="markdown-body mt-5">
        <h3>Video - How To Add, Test and Deploy Custom HTML Rules:</h3>
        <div>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/iduwnyzdcFo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </article>
  </div>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-20 items-center justify-center
    flex-col">
    <div class="text-center lg:w-2/3 w-full">
        <h1
        class="title-font sm:text-4xl text-3xl mb-10 font-medium text-gray-900">
        Check out our Github
        </h1>
    </div>
    <a
        href="https://github.com/SSWConsulting/SSW.CodeAuditor"
        target="_blank">
        <img width="110" height="100" alt="hero" src="/images/githublogo.png" />
    </a>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 pb-20 pt-15 items-center justify-center
    flex-col">
    <div class="text-center lg:w-2/3 w-full">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        Sign up now! It's free
        </h1>
        <p class="mb-8 text-lg leading-relaxed">
        Once signed up, you will be able to unlock the following awesome
        features that allows you to take control of your code, ensuring large,
        complex source code can be simplified, cleaned and maintained
        </p>

        <div class="flex justify-center">
        <button
            on:click={() => navigateTo('/signup')}
            class="inline-flex text-white border-0 py-2 px-6 focus:outline-none
            hover:bg-gray-800 rounded text-lg bgdark">
            Sign up
        </button>
        </div>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-19 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/dashboard.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/dashboard.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        View prior scans history
        </h1>
        <p class="mb-8 leading-relaxed">
        Keep your last 100 scan results for FREE
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/exportcsv.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/exportcsv.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        Export to CSV
        </h1>
        <p class="mb-8 leading-relaxed">
        Export scan result to CSV to perform further analysis (e.g on PowerBI)
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/lighthouse2.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/lighthouse2.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        View Lighthouse Report
        </h1>
        <p class="mb-8 leading-relaxed">
        View Lighthouse Report without leaving the app
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/threshold.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/threshold.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        Set Lighthouse Threshold
        </h1>
        <p class="mb-8 leading-relaxed">
        If Performance is less than 80 and SEO score is less than 100, fail
        the build
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/ignore.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/ignore.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        Ignore broken Links
        </h1>
        <p class="mb-8 leading-relaxed">
        Ignored URLs will not cause build to fail
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/codeissues.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/codeissues.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        View Code Errors
        </h1>
        <p class="mb-8 leading-relaxed">
        View HTML code errors and Code errors without leaving the app
        </p>
    </div>
    </div>
</section>

<section class="text-gray-700 body-font">
    <div
    class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="md:w-1/2 w-5/6 mb-10 md:mb-0">
        <a href="/images/artillery.png" target="_blank">
        <img
            class="object-cover object-center rounded"
            alt="hero"
            src="/images/artillery.png" />
        </a>
    </div>
    <div
        class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col
        md:items-start md:text-left items-center text-center">
        <h1
        class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        View Artillery Load Test
        </h1>
        <p class="mb-8 leading-relaxed">
        View Load Test results ran by Artillery without leaving the app
        </p>
    </div>
    </div>
</section>
</div>

<footer class="text-gray-700 body-font">
<div
    class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
    <a
    href="/"
    class="flex title-font font-medium items-center md:justify-start
    justify-center text-gray-900">
    <img
        src="https://i.ibb.co/8mfYrX2/Code-Auditor-footer.png"
        alt="CodeAuditor"
        width="200"
        height="300" />
    </a>
    <p
    class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2
    sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
    © 2020 SSW —
    <a
        href="https://twitter.com/ssw_tv"
        class="text-gray-600 ml-1"
        rel="noopener noreferrer"
        target="_blank">
        @ssw_tv
    </a>
    </p>
    <span
    class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
    <a
        target="_blank"
        class="text-gray-500"
        href="https://facebook.com/ssw.page">
        <svg
        fill="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-5 h-5"
        viewBox="0 0 24 24">
        <path
            d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
    </a>
    <a
        target="_blank"
        class="ml-3 text-gray-500"
        href="https://twitter.com/ssw_tv">
        <svg
        fill="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-5 h-5"
        viewBox="0 0 24 24">
        <path
            d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66
            10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5
            4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
    </a>
    <a
        target="_blank"
        class="ml-3 text-gray-500"
        href="https://www.linkedin.com/company/ssw">
        <svg
        fill="currentColor"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="0"
        class="w-5 h-5"
        viewBox="0 0 24 24">
        <path
            stroke="none"
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0
            016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" stroke="none" />
        </svg>
    </a>
    </span>
</div>
</footer>
  