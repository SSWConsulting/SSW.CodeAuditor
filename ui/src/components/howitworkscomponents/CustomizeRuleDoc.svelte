<script>
    import * as marked from "marked";
    
    const customRuleConfig = `
  # How to Use Custom HTML Rules Configuration
  #### 1. Click on "Enable/Disable Rules" 
  ![image](https://user-images.githubusercontent.com/67776356/229018349-ab11cb85-1650-41c5-b3e5-af3e81a53bc0.png)
  **Figure: Enable/Disable Rules button**

  #### 2. Select which custom rules you want for your next scan  
  ![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/f6d09566-0ff8-4ef8-a120-53fade615689)
  **Figure: Custom rule selection modal**

  #### 3. After you run your next scan, you should only be able to see the scan results for your selected html rules
  ![image](https://user-images.githubusercontent.com/67776356/229019594-39b9e95e-c91b-41f8-b3a4-e33d370bad0c.png)
  **Figure: Custom rule selection modal**
  `
</script>

<article class="markdown-body">
    {@html marked.parse(customRuleConfig)}
</article>