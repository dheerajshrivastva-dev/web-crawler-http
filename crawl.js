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

async function crawlPage (baseURL, currentURL, pages) {
  try {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    // we only want crawl one website NOT entire internate :)
    if (baseURLObj.hostname !== currentURLObj.hostname) {
      return pages
    }
  } catch (err) {
    console.log(err.message)
    return pages
  }

  // already crawled pages
  const normalizedCurrentURL = normalizeURL(currentURL)

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL] ++
    return pages
  }

  pages[normalizedCurrentURL] = 1


  console.log("Actively crawling: ", currentURL);
  try {
    const resp = await fetch(currentURL)
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
      return pages
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`Non HTML response, content-type: ${contentType} on page ${currentURL}`)
      return pages
    }

    const htmlBody = await resp.text()

    const urls = getURLsFromHTML(htmlBody, baseURL)

    // recursively crawling entire utls
    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages)
    }

  } catch (err) {
    console.log('Something went wrong. Error: ', err.message, 'on page: ', currentURL)
    return pages
  }

  return pages
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
}
