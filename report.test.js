const { sortPages } = require("./report.js")

const { test, expect } = require("@jest/globals")

test("sortPages 2 pages", () => {
  const inputPage = {
    'https://wagslane.dev': 3,
    'https://wagslane.dev/page': 13
  }
  const actualOutput = sortPages(inputPage)
  const expectedOutput = [
    ['https://wagslane.dev/page', 13],
    ['https://wagslane.dev', 3],
  ]
  expect(actualOutput).toEqual(expectedOutput)
})

test("sortPages multiple pages", () => {
  const inputPage = {
    'boot.dev': 11,
    'boot.dev/signup-flow': 5,
    'boot.dev/settings': 2,
    'boot.dev/tracks/backend': 19,
    'boot.dev/pricing': 19,
    'boot.dev/leaderboard': 19,
    'boot.dev/community': 19,
    'boot.dev/teams': 2,
    'boot.dev/gifts': 2,
    'boot.dev/sitemap.xml': 1,
    'boot.dev/playground/go': 1,
    'boot.dev/reviews': 1
  }
  const actualOutput = sortPages(inputPage)
  const expectedOutput = [
    ['boot.dev/tracks/backend', 19],
    ['boot.dev/pricing', 19],
    ['boot.dev/leaderboard', 19],
    ['boot.dev/community', 19],
    ['boot.dev', 11],
    ['boot.dev/signup-flow', 5],
    ['boot.dev/settings', 2],
    ['boot.dev/teams', 2],
    ['boot.dev/gifts', 2],
    ['boot.dev/sitemap.xml', 1],
    ['boot.dev/playground/go', 1],
    ['boot.dev/reviews', 1]
  ]
  expect(actualOutput).toEqual(expectedOutput)
})