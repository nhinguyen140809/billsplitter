import { test, expect } from '@playwright/test'
import { SEL } from '../selectors'
import { PARTICIPANTS, EQUAL_BILLS, SETTLEMENT_NAMES } from '../data/testData'
import { addParticipants, addEqualBill, saveSettlement } from '../helpers/actions'

test.describe('Settlements', () => {
  // ---------- Save draft as settlement — data-driven ----------
  for (const settlementName of SETTLEMENT_NAMES) {
    test(`saves draft as settlement: "${settlementName}"`, async ({ page }) => {
      await page.goto('.')
      await addParticipants(page, PARTICIPANTS)
      await addEqualBill(page, EQUAL_BILLS[0])
      await saveSettlement(page, settlementName)

      // Should navigate to the settlement detail page
      await expect(page).toHaveURL(/\/settlements\//)
      await expect(page.locator(SEL.settlementDetailName)).toHaveValue(settlementName)
    })
  }

  // ---------- Settlements list ----------
  test('saved settlement appears in settlements list', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.goto('settlements')
    await expect(page.locator(SEL.settlementItem(SETTLEMENT_NAMES[0]))).toBeVisible()
  })

  test('navigates to settlement detail from list', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.goto('settlements')
    await page
      .locator(SEL.settlementItem(SETTLEMENT_NAMES[0]))
      .locator(SEL.settlementEditBtn)
      .click()
    await expect(page).toHaveURL(/\/settlements\//)
    await expect(page.locator(SEL.settlementDetailName)).toHaveValue(SETTLEMENT_NAMES[0])
  })

  test('deletes a settlement from the list', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.goto('settlements')
    await page
      .locator(SEL.settlementItem(SETTLEMENT_NAMES[0]))
      .locator(SEL.settlementDeleteBtn)
      .click()
    await expect(page.locator(SEL.settlementItem(SETTLEMENT_NAMES[0]))).not.toBeVisible()
  })

  test('duplicates a settlement from the list', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.goto('settlements')
    await page
      .locator(SEL.settlementItem(SETTLEMENT_NAMES[0]))
      .locator(SEL.settlementDuplicateBtn)
      .click()
    // A "Copy of …" item should appear
    await expect(page.locator(SEL.settlementItem(`Copy of ${SETTLEMENT_NAMES[0]}`))).toBeVisible()
  })

  // ---------- Settlement detail page ----------
  test('edits settlement name on detail page', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.fill(SEL.settlementDetailName, 'Renamed Settlement')
    await page.goto('settlements')
    await expect(page.locator(SEL.settlementItem('Renamed Settlement'))).toBeVisible()
  })

  test('deletes settlement from detail page and redirects home', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await expect(page).toHaveURL(/\/settlements\//)
    await page.click(SEL.settlementDeleteDetailBtn)
    await expect(page).toHaveURL(/\/billsplitter\/?$/)
  })

  test('duplicates settlement from detail page and navigates to copy', async ({ page }) => {
    await page.goto('.')
    await saveSettlement(page, SETTLEMENT_NAMES[0])
    await page.click(SEL.settlementDuplicateDetailBtn)
    await expect(page).toHaveURL(/\/settlements\//)
    await expect(page.locator(SEL.settlementDetailName)).toHaveValue(
      `Copy of ${SETTLEMENT_NAMES[0]}`
    )
  })

  // ---------- Navigation ----------
  test('navigates home from settlements list', async ({ page }) => {
    await page.goto('settlements')
    await page.click(SEL.navHome)
    await expect(page).toHaveURL(/\/billsplitter\/?$/)
  })

  test('navigates to settlements list from home page', async ({ page }) => {
    await page.goto('.')
    await page.click(SEL.navSettlements)
    await expect(page).toHaveURL(/\/settlements$/)
  })

  test('empty state message shown when no settlements exist', async ({ page }) => {
    await page.goto('settlements')
    await expect(page.getByText('No settlements found')).toBeVisible()
  })
})
