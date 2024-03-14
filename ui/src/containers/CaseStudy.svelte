<script>
  import { navigateTo } from "svelte-router-spa";
  import Icon from "../components/misccomponents/Icon.svelte";

  let title = 'SSW CodeAuditor - Case Study';

  // Function to update the page title
  function updateTitle(newTitle) {
    document.title = newTitle;
  }

  // Listen for changes in the title variable
  $: {
    updateTitle(title);
  }
</script>

<div class="container mx-auto">
  <div>
    <p class="hidden md:block text-sm textdark pb-3 pt-4">
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        Home
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/about">
        About
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <span class="inline-block align-baseline text-blue hover:text-blue-darker">
        Case Study
      </span>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
    </p>
  </div>

  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      <h1>SSW Sites</h1>
      <h2 class="textred">Challenge</h2>
      <p>
        SSW presents an extensive range of products encompassing web applications with server-side rendering and static website generation,
        making them particularly well-suited for integration with CodeAuditor's scanning capabilities. Notable among these products are 
        <a href="https://ssw.com.au/rules">SSW Rules</a>, <a href="https://ssw.com.au/people">SSW People</a> and 
        <a href="https://ssw.com.au">SSW Website</a>. However, these platforms consist of a multitude of pages with numerous links, 
        particularly SSW Rules, which poses a significant challenge for CodeAuditor's scanning process. 
      </p>
      <p>
        The main obstacle encountered pertained to the substantial volume of content within SSW Rules, 
        resulting in inconsistencies in CodeAuditor's scanning efforts, as well as difficulties in rectifying each individual broken link and addressing code warnings/errors.
      </p>
      <p>
        The secondary primary challenge stemmed from the management of false positive occurrences, exacerbating the complexity of error fixing within our process.
      </p>
      <p>
        Managing the substantial volume of content within SSW Rules presented a formidable challenge. It necessitated the 
        allocation of additional resources and processing power to CodeAuditor's scan engine to ensure more consistent and stable scan runs. 
        Furthermore, the implementation of numerous unit tests was imperative to verify the accuracy and consistency of results across all scanning iterations.
      </p>
      <p>
        Once we got the scan result ready, fixing the broken links and code errors/warnings remain another big challenge. 
      </p>
      <ul class="list-disc">
        <li>
          Numerous instances arose wherein the identification of false positive errors complicated our fixing process. 
          One such scenario pertained to one of our custom HTML rules designed to enforce the inclusion of specified programming language tags 
          within code block elements. However, within certain pages of SSW Rules, deviations from best practices were observed, with instances 
          of code blocks lacking language specifications. Consequently, these pages were erroneously flagged as errors within CodeAuditor and thus, 
          we needed to add the links to the ignore list so CodeAuditor no longer reports them.
        </li>
        <li>
          Another main challenge entails situations where custom HTML rules are not applicable to specific technology frameworks 
          employed within the product. For instance, SSW Rules is built using Gatsby where the framework controls the rendering of numerous HTML elements by default. 
          Consequently, the team encountered limitations in rectifying the source code to adhere to the prescribed best practices outlined in the custom HTML rule.
          Hence, we had to categorize the custom rules according to each framework, discerning which rules are applicable to Gatsby or NextJS, with the aim of mitigating false positive.
        </li>
      </ul> 
      <div class="logo">
        <a href="https://ssw.com.au/">
          <img width="129" alt="image" src="/images/SSW-Logo.png">
        </a>
        <a href="https://ssw.com.au/people">
          <img width="255" alt="image" src="/images/SSW-People-Logo.png">
        </a>
        <a href="https://ssw.com.au/rules">
          <img width="240" alt="image" src="/images/SSW-Rules-Logo.png">
        </a>
      </div>
      <h2 class="textred">Problems Solved</h2>
      <p>
        Despite the significant volume of broken links and code warnings/errors found in these sites, the team diligently addressed each instance, ignoring false positives 
        and appropriately categorizing custom rules within their respective frameworks.
      </p>
      <p>
        As a result of these efforts, recent scan results indicate the absence of any remaining broken links or code errors within SSW People and Rules.
      </p>
      <a href="/images/perfect-scan-result-report.png" target="_blank">
        <img
          class="object-cover object-center rounded bordered"
          alt="hero"
          src="/images/perfect-scan-result-report.png"
        />
      </a>
      <p><strong>Figure: Scan result on SSW Rules without any broken link and code errors/warnings</strong></p>
      <div class="mt-20 mb-20">
        <h3>Want to find and fix your website code problems?
        </h3>
        <button 
          type="button"
          on:click={() => {navigateTo("/")}} 
          class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4 border hover:border-transparent rounded"
        >Get Started with CodeAuditor</button>
      </div>
      <div></div>
    </article>
  </div>
</div>

<style>
  .markdown-body a {
    color: #cc4141
  }
</style>