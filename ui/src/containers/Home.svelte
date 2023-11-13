<script>
  import { navigateTo } from "svelte-router-spa";
  import { isLoggedIn } from "../stores.js";
</script>

<div class="container mx-auto">
  <section class="text-gray-700 body-font">
    <div
      class="container mx-auto flex px-5 py-20 items-center justify-center
    flex-col"
    >
      <div class="text-center lg:w-2/3 w-full">
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-10 font-medium text-gray-900"
        >
          Check out our Github
        </h1>
      </div>
      <a
        href="https://github.com/SSWConsulting/SSW.CodeAuditor"
        target="_blank"
      >
        <img width="110" height="100" alt="hero" src="/images/githublogo.png" />
      </a>
    </div>
  </section>

  {#if !$isLoggedIn}
  <section class="text-gray-700 body-font">
    <div
      class="container mx-auto flex px-5 pb-20 pt-15 items-center justify-center
    flex-col"
    >
      <div class="text-center lg:w-2/3 w-full">
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          Sign up now! It's free
        </h1>
        <p class="mb-8 text-lg leading-relaxed">
          Once signed up, you will be able to unlock the following awesome
          features that allows you to take control of your code, ensuring large,
          complex source code can be simplified, cleaned and maintained
        </p>

        <div class="flex justify-center">
          <button
            on:click={() => navigateTo("/signup")}
            class="inline-flex text-white border-0 py-2 px-6 focus:outline-none
            hover:bg-gray-800 rounded text-lg bgdark"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          View prior scans history
        </h1>
        <p class="mb-8 leading-relaxed">View previous scan results.</p>
      </div>
      <div>
        <a href="/images/dashboard.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/dashboard.png"
          />
        </a>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <a href="/images/exportcsv.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/exportcsv.png"
          />
        </a>
      </div>
      <div class="text-right">
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          Export to CSV
        </h1>
        <p class="mb-8 leading-relaxed">
          Export scan result to CSV to perform further analysis (e.g on PowerBI).
        </p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          View Lighthouse Report
        </h1>
        <p class="mb-8 leading-relaxed">
          View Lighthouse Report without leaving the app.
        </p>
      </div>
      <div>
        <a href="/images/lighthouse2.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/lighthouse2.png"
          />
        </a>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <a href="/images/threshold.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/threshold.png"
          />
        </a>
      </div>
      <div class="text-right">
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          Set Lighthouse Threshold
        </h1>
        <p class="mb-8 leading-relaxed">
          If Performance is less than 80 and SEO score is less than 100, fail
          the build.
        </p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          Ignore broken Links
        </h1>
        <p class="mb-8 leading-relaxed">
          Ignored URLs will not cause build to fail.
        </p>
      </div>
      <div>
        <a href="/images/ignore.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/ignore.png"
          />
        </a>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <a href="/images/codeissues.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/codeissues.png"
          />
        </a>
      </div>
      <div class="text-right">
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          View Code Errors
        </h1>
        <p class="mb-8 leading-relaxed">
          View HTML code errors and Code errors without leaving the app.
        </p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <h1
          class="title-font leading-tight sm:text-4xl text-3xl mb-4 font-medium text-gray-900"
        >
          View Artillery Load Test
        </h1>
        <p class="mb-8 leading-relaxed">
          View Load Test results ran by Artillery without leaving the app.
        </p>
      </div>
      <div>
        <a href="/images/artillery.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/artillery.png"
          />
        </a>
      </div>
    </div>
  </section>
</div>
