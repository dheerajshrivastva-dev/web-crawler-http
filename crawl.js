const jsdom = require('jsdom')
const { JSDOM } = jsdom;

function normalizeURL (urlString) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if(hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath
}

function getURLsFromHTML (htmlBody, baseUrl) {
  const htmlDoc = new JSDOM(htmlBody)
  const aTags = htmlDoc.window.document.querySelectorAll("a")
  const urls = [];
  aTags.forEach((aTag) => {
    const url = aTag.href;
    if(url.slice(0,1) === "/") {
      // it is relative url
      try {
        const urlObj = new URL(`${baseUrl}${url}`)
        urls.push(urlObj.href)
      } catch (err) {
        console.log(`error with relative url: ${err.message}`)
      }
    } else {
      try {
        const urlObj = new URL(url)
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`)
      }
      
    }
  });
  return urls;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
}
