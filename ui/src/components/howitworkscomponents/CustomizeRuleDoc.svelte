<script>
    import * as marked from "marked";
    
    const customRuleConfig = `
  # How to Use Custom HTML Rules Configuration
  #### 1. Go to your scan HTML result page, click on "Enable/Disable Rules" 

  #### 2. Select the custom rules you want to include for your next scan  

  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d1c7ac42-923e-42e0-a914-df4c018052e9" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d1c7ac42-923e-42e0-a914-df4c018052e9"
    />
  </a>

  **Figure: Custom rule selection modal**

  #### 3. When you run next scan, only your selected html rules will be in effect 

  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/76ed8b0b-2bfd-4f6c-ade4-dd96ab5e9f17" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/76ed8b0b-2bfd-4f6c-ade4-dd96ab5e9f17"
    />
  </a>

  **Figure: Selected scanned rules**

  # How to Customize HTML Rule Options
  #### 1. Go to your scan HTML result page, click on "Enable/Disable Rules" 
  #### 2. Any custom rule with the gear icon ⚙ allows custom options

  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/dccf8256-f005-44ad-918c-89f76e9e7862" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/dccf8256-f005-44ad-918c-89f76e9e7862"
    />
  </a>

  **Figure: Input option for custom values**
  #### 3. In your next scan, your custom input options will be in effect instead of the rule's default values
  #### 4. You can also ignore the rules on certain Urls of your choice

  <a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/e10795a2-13dd-449e-8a72-25566b1f1355" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 75%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/e10795a2-13dd-449e-8a72-25566b1f1355"
    />
  </a>

  **Figure: Input option to ignore scanning rules on certain Urls**
  `
</script>

<article class="markdown-body">
    {@html marked.parse(customRuleConfig)}
</article>