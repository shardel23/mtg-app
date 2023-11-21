// // https://github.com/kuroski/github-issue-viewer/blob/main/e2e/issues.spec.ts

// import { drop } from '@mswjs/data';
// import { Page } from '@playwright/test';
// import { SetupServerApi } from 'msw/lib/node';

// import { db, FactoryValue } from '@/e2e/mocks/handlers';
// import server from '@/e2e/mocks/server'
// import { expect, test } from "@/e2e/test";
// import { dateTimeFormat } from "@/lib/utils";

// test.describe("Github issues app", () => {
//   let props: { mockServer: SetupServerApi, baseURL: string }

//   // 1. First, we make sure mockServer is properly instantiated and that we also store the baseURL that our server is returning
//   // We can instantiate it in other stages, but doing that in beforeAll is a bit easier for this example + we only create one instance per suite
//   test.beforeAll(async () => {
//     props = await server()
//   })

//   // 2. We must always reset mockServer handlers and drop the in-memory database after each test
//   test.afterEach(() => {
//     props.mockServer.resetHandlers()
//     drop(db)
//   })

//   // 3. I like to have a "build" function which I'm using to extract some common login from my tests
//   // This function will handle the page navigation/will wait for all required requests to be done
//   const build = async (page: Page) => {
//     const date = dateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric' })

//     // 3.1 don't forget to prefix urls with `baseURL`, since our server address is automatically generated
//     await page.goto(`${props.baseURL}/?state=all&type&visibility`);

//     await Promise.all([
//       page.waitForResponse('**/api/trpc/github.issues.list*'),
//     ])

//     const openedIssues = db.issue.findMany({
//       where: {
//         state: {
//           equals: 'open'
//         }
//       }
//     })

//     const closedIssues = db.issue.findMany({
//       where: {
//         state: {
//           equals: 'closed'
//         }
//       }
//     })

//     // 3.2 Then we return a list of common helpers, like our database entries, our locators, etc... For me, this make our tests look cleaner
//     // All that "configuration" part is extracted into this section, which I can ignore and I can read my tests in a more "human" way
//     // I like the fact my "helpers" live next to my tests + try not to extract everything into this place (or different files), this function just has some "minor" things, but if I have to scroll up and down (or change files) to understand my test flow, then I think is not very cool since it kinda distracts you from actually understanding what you are testing
//     return {
//       openedIssues,
//       closedIssues,
//       issuesResponse: () => page.waitForResponse('**/api/trpc/github.issues.list*'),
//       locators: {
//         openedIssuesCountButton: () => page.locator(`button:has-text("Open ${openedIssues.length}")`),
//         closedIssuesCountButton: () => page.locator(`button:has-text("Closed ${closedIssues.length}")`),
//         issue: (issue: FactoryValue<'issue'>) => {
//           const issueRow = page.locator(`data-testid=issue-${issue.id}`)
//           const icon = {
//             'open': 'issue-open-icon',
//             'closed': 'issue-closed-icon',
//           }[issue.state]
//           const subtitle = {
//             'open': `${issue.repository!.full_name} #${issue.number} opened on ${date.format(issue.created_at)} by ${issue.user.login}`,
//             'closed': `${issue.repository!.full_name} #${issue.number} by ${issue.user.login} was closed on ${date.format(issue.closed_at)}`,
//           }[issue.state]

//           return {
//             title: () => issueRow.locator('h3', { hasText: issue.title }).locator(`a[href="${issue.html_url}"]`),
//             icon: () => issueRow.locator(`data-testid=${icon}`),
//             subtitle: () => issueRow.locator('p', { hasText: subtitle }),
//             prLink: () => issueRow.locator(`data-testid=issue-pull-request-${issue.id}`),
//             comments: () => issueRow.locator(`a[href="${issue.html_url}"]`, { hasText: String(issue.comments) }),
//             assignee: (assignee: FactoryValue<'assignee'>) => issueRow.locator(`a[href="${assignee.html_url}"]`).locator(`img[src="${assignee.avatar_url}"][alt~="${assignee.login}"]`),
//           }
//         }
//       }
//     }
//   }

//   // 4. Finally, we have our first tests
//   test("a user can see a list of issues", async ({ page }) => {
//     // 4.1 Because of the `build` function, we just have to call it and use our locators to assert what we want
//     const {
//       openedIssues,
//       closedIssues,
//       locators
//     } = await build(page)

//     // Then I can just follow through to my assertions =D
//     await expect(locators.openedIssuesCountButton()).toBeVisible()
//     await expect(locators.closedIssuesCountButton()).toBeVisible()

//     for (const issue of [...openedIssues, ...closedIssues]) {
//       const issueLocators = locators.issue(issue)
//       await expect(issueLocators.title()).toBeVisible()
//       await expect(issueLocators.icon()).toBeVisible()
//       await expect(issueLocators.subtitle()).toBeVisible()

//       if (issue.pull_request) {
//         await expect(issueLocators.prLink()).toBeVisible()
//       } else {
//         await expect(issueLocators.prLink()).not.toBeVisible()
//       }

//       if (issue.comments > 0) {
//         await expect(issueLocators.comments()).toBeVisible()
//       } else {
//         await expect(issueLocators.comments()).not.toBeVisible()
//       }

//       for (const assignee of issue.assignees) {
//         await expect(issueLocators.assignee(assignee)).toBeVisible()
//       }
//     }
//   });

//   test("a user can filter issues", async ({ page }) => {
//     // ......
//   });
// });
