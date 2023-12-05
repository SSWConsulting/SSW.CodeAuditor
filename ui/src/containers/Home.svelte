<script>
  import { navigateTo } from "svelte-router-spa";
  import { isLoggedIn } from "../stores.js";
</script>

<div class="container mx-auto">
  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div class="flex flex-col">
        <div
          class="title-font leading-tight text-4xl mb-12 font-medium text-gray-900"
        >
          Find the gremlins in your website
        </div>
        <div class="mb-6">
          <button
            class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4 border hover:border-transparent rounded"
            on:click={() => window.open("https://github.com/SSWConsulting/SSW.CodeAuditor", '_blank').focus()}
          >
            <i class="fa-brands fa-github fa-xl"></i>
            <span class="ml-2 text-xl">
              Check out our GitHub
            </span>
          </button>
        </div>
        <div class="mb-8">
          <a 
            class="link text-xl cursor-pointer"
            target="_blank"
            href="https://github.com/marketplace/actions/codeauditor-workflow"
          >
            Integrate CodeAuditor into your build pipeline
          </a>
        </div>
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

  {#if !$isLoggedIn}
  <section class="text-gray-700 body-font">
    <div
      class="container mx-auto flex px-5 pb-20 pt-15 items-center justify-center
    flex-col"
    >
      <div class="text-center lg:w-2/3 w-full">
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Sign up now! It's free
        </div>
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
        <a href="/images/scanresult.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/scanresult.png"
          />
        </a>
      </div>
      <div class="text-right">
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          View scan result
        </div>
        <p class="mb-8 leading-relaxed">View your personal scan results.</p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Compare to prior scans
        </div>
        <p class="mb-8 leading-relaxed">Compare scan results to your previous scans.</p>
      </div>
      <div>
        <a href="/images/scancompare.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/scancompare.png"
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
        <a href="/images/alertemail.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/alertemail.png"
          />
        </a>
      </div>
      <div class="text-right">
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Send alert emails
        </div>
        <p class="mb-8 leading-relaxed">Automatically send alert emails as soon as your scan is completed.</p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Customize HTML rules
        </div>
        <p class="mb-8 leading-relaxed">Customize or Ignore your own personalized custom HTML rules.</p>
      </div>
      <div>
        <a href="/images/rulecustomisation.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/rulecustomisation.png"
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
        <a href="/images/ignorerulelink.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/ignorerulelink.png"
          />
        </a>
      </div>
      <div class="text-right">
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Ignore links on the go
        </div>
        <p class="mb-8 leading-relaxed">Toggle to ignore scanning your links or HTML rules right on the go.</p>
      </div>
    </div>
  </section>

  <section class="text-gray-700 body-font">
    <div
      class="container grid grid-cols-2 gap-4 mx-auto px-5 py-24 items-center"
    >
      <div>
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          View prior scans history
        </div>
        <p class="mb-8 leading-relaxed">View your previous scan results.</p>
      </div>
      <div>
        <a href="/images/personalscans.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/personalscans.png"
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
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Export to CSV
        </div>
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
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          View Lighthouse Report
        </div>
        <p class="mb-8 leading-relaxed">
          View Lighthouse Report without leaving the app.
        </p>
      </div>
      <div>
        <a href="/images/lighthouse.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/lighthouse.png"
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
        <a href="/images/lighthousethreshold.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/lighthousethreshold.png"
          />
        </a>
      </div>
      <div class="text-right">
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Set Lighthouse Threshold
        </div>
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
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          Ignore broken Links
        </div>
        <p class="mb-8 leading-relaxed">
          Ignored URLs will not cause build to fail.
        </p>
      </div>
      <div>
        <a href="/images/ignoreUrl.png" target="_blank">
          <img
            class="object-cover object-center rounded bordered"
            alt="hero"
            src="/images/ignoreUrl.png"
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
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          View Code Errors
        </div>
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
        <div
          class="title-font leading-tight text-3xl mb-4 font-medium text-gray-900"
        >
          View Artillery Load Test
        </div>
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
