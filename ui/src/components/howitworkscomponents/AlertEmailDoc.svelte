<script>
    import * as marked from "marked";

    const emailAlertInstruction = 
`# How to send automated Email Alert for future scans
#### 1. Click on "Send Email Alerts" to open the modal

<a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/8fd73e0a-9b23-4bc6-b7f6-fdf35a04a46a" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 85%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/8fd73e0a-9b23-4bc6-b7f6-fdf35a04a46a"
    />
</a>

**Figure: Send Email Alerts button**

#### 2. Add or remove email addresses to receive alert

<a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/b51a2548-d452-4496-89ab-41fde0a2500a" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 85%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/b51a2548-d452-4496-89ab-41fde0a2500a"
    />
</a>

**Figure: Email alerts modal**

#### 3. After your next scan has completed, the email addresses will receive automated email alerts 

<a href="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/69b44d1b-22b3-477c-8ab4-19560d88e64d" target="_blank">
    <img
        class="object-cover object-center rounded bordered"
        style="max-width: 85%;
        alt="hero"
        src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/69b44d1b-22b3-477c-8ab4-19560d88e64d"
    />
</a>

**Figure: Sample email alerts**`
</script>

<article class="markdown-body">
    {@html marked.parse(emailAlertInstruction)}
</article>