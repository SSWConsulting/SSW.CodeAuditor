<script>
  import marked from "marked";
  import { fade, fly } from "svelte/transition";
  import Icon from "../components/Icon.svelte";
  import { isLoggedIn } from "../stores.js";
  import { navigateTo } from "svelte-router-spa";
  isLoggedIn.subscribe(x => {
    if (x) {
      navigateTo("/home");
    }
  });

  async function getReadMe() {
    const res = await fetch(`/README.md`);
    instructions = await res.text();
  }
  getReadMe();
  let instructions = "";
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      {@html marked(instructions)}
    </article>
  </div>

  <section class="text-gray-700 body-font">
    <div
      class="container mx-auto flex px-5 py-24 items-center justify-center
      flex-col">
      <div class="text-center lg:w-2/3 w-full">
        <h1
          class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
          Sign up now! It's free
        </h1>
        <p class="mb-8 leading-relaxed">
          Once signed up, you will be able to unlock the following awesome
          features. All for free!!
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
      class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
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
      <Icon cssClass="inline-block text-red-600" height="24" width="24">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </Icon>
      <span class="ml-3 text-xl">CodeAuditor</span>
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
