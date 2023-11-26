const { normalizeURL, getURLsFromHTML } = require("./crawl.js")
const { test, expect } = require("@jest/globals")

test("normaliseUrl strip protocol", () => {
  const input = "https://blog.boot.dev/path"
  const actualOutput = normalizeURL(input)
  const expectedOutput = "blog.boot.dev/path"
  expect(actualOutput).toEqual(expectedOutput)
})

test("normaliseUrl strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/"
  const actualOutput = normalizeURL(input)
  const expectedOutput = "blog.boot.dev/path"
  expect(actualOutput).toEqual(expectedOutput)
})

test("normaliseUrl capitals", () => {
  const input = "https://BLOG.boOt.dev/path/"
  const actualOutput = normalizeURL(input)
  const expectedOutput = "blog.boot.dev/path"
  expect(actualOutput).toEqual(expectedOutput)
})

test("normaliseUrl strip http", () => {
  const input = "http://BLOG.boOt.dev/path/"
  const actualOutput = normalizeURL(input)
  const expectedOutput = "blog.boot.dev/path"
  expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="http://blog.boot.dev/path/">
          Boot.dev Blog
        </a>
      </body>
    </html>
  `
  const inputBaseURL = "http://blog.boot.dev"
  const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expectedOutput = ["http://blog.boot.dev/path/"]
  expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="/path/">
          Boot.dev Blog
        </a>
      </body>
    </html>
  `
  const inputBaseURL = "http://blog.boot.dev"
  const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expectedOutput = ["http://blog.boot.dev/path/"]
  expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML relative and absolute", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="http://blog.boot.dev/path/apps/">
          Boot.dev Blog apps
        </a>
        <a href="/path/">
          Boot.dev Blog path
        </a>
        <a href="/path2/">
          Boot.dev Blog path 1
        </a>
      </body>
    </html>
  `
  const inputBaseURL = "http://blog.boot.dev"
  const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expectedOutput = ["http://blog.boot.dev/path/apps/", "http://blog.boot.dev/path/", "http://blog.boot.dev/path2/"]
  expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML invalid url", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="invalid">
          Invalid Url
        </a>
      </body>
    </html>
  `
  const inputBaseURL = "http://blog.boot.dev"
  const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expectedOutput = []
  expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML invalid url and valid", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="http://blog.boot.dev/path/apps/">
          Boot.dev Blog apps
        </a>
        <a href="/path/">
          Boot.dev Blog path
        </a>
        <a href="/path2/">
          Boot.dev Blog path 1
        </a>
        <a href="invalid">
          Invalid Url
        </a>
      </body>
    </html>
  `
  const inputBaseURL = "http://blog.boot.dev"
  const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expectedOutput = ["http://blog.boot.dev/path/apps/", "http://blog.boot.dev/path/", "http://blog.boot.dev/path2/"]
  expect(actualOutput).toEqual(expectedOutput)
})
