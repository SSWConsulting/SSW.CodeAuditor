<script>
    import * as marked from "marked";

    const scanCompareInstruction = `
  # How to compare between scans
  #### 1. Click on "Compare to latest scan" to go to scan compare page

  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/7c995453-5b40-4ef2-94fb-0ea1feeb7182" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/7c995453-5b40-4ef2-94fb-0ea1feeb7182"
    />
  </a>

  **Figure: Scan compare button**

  #### 2. Select in the dropdown list to choose which previous scan you want to compare to the latest one
  
  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/2e2f25a1-1c5f-4f82-afe2-72488b530666" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/2e2f25a1-1c5f-4f82-afe2-72488b530666"
    />
  </a>

  **Figure: Scan comparison page**
  `
</script>

<article class="markdown-body">
  {@html marked.parse(scanCompareInstruction)}
</article>