const fs = require('fs');
const path = require('path');
const marked = require('marked');
const HTMLHint = require("htmlhint").default;
const cheerio = require('cheerio');
const fetch = require("node-fetch");
const yargs = require("yargs");
const { htmlHintConfig, getHTMLHintRules, getCustomHtmlRuleOptions } = require("./api");
const { addCustomHtmlRule } = require("./customHtmlRules");

let _args = {};

const _getAgrs = () => {
    _args = yargs
      .usage("Usage: -url <url>")
      .option("url", {
        describe: "URL to scan",
        type: "string",
        demandOption: false,
      })
      .option("token", {
        alias: "t",
        describe: "Dashboard token (sign up at https://codeauditor.com/)",
        type: "string",
        demandOption: false,
      }).argv;
    return _args;
  }

const main = async () => {
    const options = _getAgrs();

    getAllMarkdownFiles("./")
    .then(markdownFiles => { 
        markdownFiles.forEach(file => {
            readMarkdownFile(file)
            .then(async (markdownContent) => {
                const htmlContent = marked.parse(markdownContent);
                let links = extractLinks(htmlContent);

                
                // Extract all links from the markdown file
                links.forEach(async (link) => {
                    if (link.startsWith('/')) {
                        link = `https://www.ssw.com.au/rules${link}`
                    }
                    
                    // Scan for broken links
                    fetch(link).then(async (res) => {
                        console.log('Scanning file: ', file)
                        if (res.status !== 200) {
                            console.log('Broken Link Found: ', link)
                        } else {
                            console.log('Link works: ', link)
                        }
                        // Add custom HTML rules
                        let rules;
                        let customRuleOptions;
                        if (options.token) {
                            await addCustomHtmlRule(options.token, options.url);
                            // Retrieve custom rule configs
                            rules = await getHTMLHintRules(options.token, options.url);
                            customRuleOptions = await getCustomHtmlRuleOptions(options.token, options.url);
                        } else {
                            await addCustomHtmlRule();
                        }
                        
                        const htmlHintResult = runHtmlHint(htmlContent, rules, customRuleOptions)
                        console.log(htmlHintResult)
                    });
                })
            })
            .catch((err) => {
                console.error('Error reading Markdown file:', err);
            });
        })
    })
}

const getAllMarkdownFiles = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files.filter(file => path.extname(file).toLowerCase() === '.md'));
        });
    });
}

const readMarkdownFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const extractLinks = (htmlContent) => {
    const $ = cheerio.load(htmlContent);
    const links = [];

    // Find all anchor tags and extract href attribute
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            links.push(href);
        }
    });

    return links;
}

const runHtmlHint = (htmlContent, rules, customRuleOptions) => {
    const selectedRules = new Set(rules?.selectedRules?.split(",").filter(i => i));
    const ignoredRules = new Set(
      customRuleOptions?.filter((opt) => {
          const ignoredUrlsList = opt.ignoredUrls?.split(',').filter(i => i) || [];
          return ignoredUrlsList.some((ignoredUrl) => minimatch(url, ignoredUrl));
        }).map((x) => x.ruleId)
    );
  
    try {  
      if (selectedRules.size) {
        for (var i in htmlHintConfig) {
          if (selectedRules.has(i) && !ignoredRules.has(i)) {
            htmlHintConfig[i] = true;
          } else {
            htmlHintConfig[i] = false;
          }
        }
      }
  
      return HTMLHint.verify(htmlContent, htmlHintConfig)
    } catch (error) {
      return null;
    }
  };

main();