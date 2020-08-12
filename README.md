# SSW Code Auditor
<table>
<tr>
<td>
  SSW CodeAuditor is a code analysis tool that allows developers to take control of your code, ensuring large, complex source code can be simplified, cleaned and maintained
</td>
</tr>
</table>

## Demo
Here is the working web :  https://codeauditor.com/

## Development

### To start contributing to CodeAuditor:
- Fork the repo
- Create a new branch (`git branch branch-name`)
- Make the appropriate changes in the code
- Add changes to reflect the changes made
- Commit your changes (`git commit -a m 'your commit message'`)
- Push to the branch (`git push origin branch-name`)
- Create a Pull Request 

### Initial Setup:

#### Run the UI
``` bash
$ cd ui
$ npm i
$ npm run dev
```

#### Build docker images
``` bash
$ cd docker
$ sh build.sh
```

#### Run the API
``` bash
$ cd api
$ npm i
$ npm run serve
```

## Technologies used in SugarLearning

### Front End:
- [SvelteJs](https://svelte.dev/) - Free and open-source JavaScript framework

### Back End:
- [Firebase](https://firebase.google.com/) - CodeAuditor uses Firebase API that allows to use the service without having to manage servers or write server-side code

### Tool:
- [Docker](https://www.docker.com/) - Platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages