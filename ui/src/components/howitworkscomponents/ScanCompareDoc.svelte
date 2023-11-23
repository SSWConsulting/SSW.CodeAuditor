<script>
    import * as marked from "marked";

    const scanCompareInstruction = `
  # How to compare to latest scan
  #### 1. Click on "Compare to latest scan" to go to scan compare page
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/a0b1c84a-8dd7-42d8-9366-587c14d09596)
  **Figure: Scan compare button**

  #### 2. Select in the dropdown list to choose which previous scan you want to compare to the latest one
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d0978ed2-417d-4085-907e-ae4fc6a8b20b)
  **Figure: Scan comparison page**
  `
</script>

<article class="markdown-body">
  {@html marked.parse(scanCompareInstruction)}
</article>