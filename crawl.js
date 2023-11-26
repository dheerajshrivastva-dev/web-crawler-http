const jsdom = require('jsdom')
const { JSDOM } = jsdom;

function normalizeURL (urlString) {
  try {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if(hostPath.length > 0 && hostPath.slice(-1) === "/") {
      return hostPath.slice(0, -1);
    }
    return hostPath
  } catch (err) {
    console.log('Invalid url passed Error:', err.message)
    return ""
  }
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

async function crawlPage (currentPage) {
  console.log("Actively crawling: ", currentPage);
  try {
    const resp = await fetch(currentPage)
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentPage}`)
      return
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`Non HTML response, content-type: ${contentType} on page ${currentPage}`)
      return
    }

    console.log(await resp.text())
  } catch (err) {
    console.log('Something went wrong. Error: ', err.message, 'on page: ', currentPage)
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
}
