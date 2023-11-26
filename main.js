const { crawlPage } = require("./crawl.js")

function main () {
  if (process.argv.length < 3) {
    console.log("no website provided")
    process.exit(1)
  }
  if (process.argv.length > 3) {
    console.log("to many arguments expected 3", `\nfound ==> \n[\n  ${process.argv.join(",\n  ")}\n]`)
    process.exit(1)
  }
  
  const baseUrl = process.argv[2]

  try {
    const urlObj = new URL(baseUrl);
  } catch (err) {
    console.log(`invalid url provided ${baseUrl} \nError: ${err.message}`)
    process.exit(1)
  }

  console.log("Starting crawl", baseUrl)
  crawlPage(baseUrl)
}

main()
