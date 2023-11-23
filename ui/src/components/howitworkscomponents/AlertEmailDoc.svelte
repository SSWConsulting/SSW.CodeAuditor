<script>
    import * as marked from "marked";

    const emailAlertInstruction = 
`# How to send automated Email Alert for future scans
#### 1. Click on "Send Email Alerts" to open the modal
![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/d466a84e-b142-4185-880a-1d60dac78d41)
**Figure: Send Email Alerts button**

#### 2. Add or remove email addresses to receive alert
![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/4b7492d0-5dde-4b6c-be43-e1b05b98fb89)
**Figure: Email alerts modal**

#### 3. After you run your next scan, the email addresses will receive automated email alerts 
![Image](https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/69b44d1b-22b3-477c-8ab4-19560d88e64d)
**Figure: Sample email alerts**`
</script>

<article class="markdown-body">
    {@html marked.parse(emailAlertInstruction)}
</article>