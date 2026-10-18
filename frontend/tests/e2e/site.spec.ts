import { expect, test } from '@playwright/test'

test('home shows the map and starts the first quest', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Git good.')
  await expect(page.getByRole('figure')).toContainText('<<<<<<< HEAD')
  await expect(page.getByRole('list', { name: 'Quests' }).getByRole('link')).toHaveCount(12)

  await page.getByRole('link', { name: 'Start quest 01' }).click()
  await expect(page).toHaveURL(/\/workshop\/01-hello-head$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hello, HEAD')
})

test('marking a quest done fills its square, in this browser', async ({ page }) => {
  await page.goto('/workshop/05-merge-conflicts')
  await page.getByRole('button', { name: 'Mark as done' }).click()
  await expect(page.getByRole('button', { name: 'Done. Undo?' })).toBeVisible()

  await page.goto('/workshop')
  await expect(page.getByTestId('progress')).toContainText('1 of 12 quests done')
  await expect(page.getByRole('link', { name: '05 Merge conflicts, done' })).toBeVisible()
})

test('chapters page through in order', async ({ page }) => {
  await page.goto('/workshop/11-the-reflog-saves-you')
  await page.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(/12-git-and-ai-agents$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Git and AI agents')
})

test('HEAD the cat answers questions', async ({ page }) => {
  await page.goto('/')
  await page.locator('.cmp-button').click()
  const question = page.getByRole('button', { name: "Help, I'm in a merge conflict." })
  // Light text on a light chip made the questions unreadable once: keep the chips dark.
  const chip = await question.evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(chip).not.toBe('rgb(255, 255, 255)')

  await question.click()
  await expect(page.getByText('git merge --abort')).toBeVisible()
  await expect(question).toHaveAttribute('aria-pressed', 'true')
})

test('nothing scrolls sideways', async ({ page }) => {
  for (const path of ['/', '/workshop', '/workshop/12-git-and-ai-agents']) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('back to top returns to the top', async ({ page }) => {
  await page.goto('/workshop/07-undo-anything')
  await page.evaluate(() => window.scrollTo(0, 3000))
  const button = page.getByRole('button', { name: 'Back to top' })

  await expect(button).toBeVisible()
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
