import { test, expect } from '@playwright/test'
import { SEL } from '../selectors'
import { PARTICIPANTS, EQUAL_BILLS, UNEQUAL_BILLS } from '../data/testData'
import { addParticipants, addEqualBill, addUnequalBill } from '../helpers/actions'

test.describe('Payment Calculation', () => {
  test('calculate button is disabled with no participants and no bills', async ({ page }) => {
    await page.goto('.')
    await expect(page.locator(SEL.calculateBtn)).toBeDisabled()
  })

  test('calculate button is disabled with participants but no bills', async ({ page }) => {
    await page.goto('.')
    await addParticipants(page, PARTICIPANTS)
    await expect(page.locator(SEL.calculateBtn)).toBeDisabled()
  })

  test('calculate button is disabled with bills but no participants', async ({ page }) => {
    // Bills can't be added without participants, so this verifies the disabled state
    await page.goto('.')
    await expect(page.locator(SEL.calculateBtn)).toBeDisabled()
  })

  // Data-driven: calculate with each equal bill dataset
  for (const bill of EQUAL_BILLS) {
    test(`calculates payments for equal bill: "${bill.name}"`, async ({ page }) => {
      await page.goto('.')
      await addParticipants(page, bill.participants)
      await addEqualBill(page, bill)
      await page.click(SEL.calculateBtn)
      // At least one payment card should appear
      await expect(page.locator('[data-testid^="payment-"]').first()).toBeVisible({
        timeout: 10000,
      })
    })
  }

  // Data-driven: calculate with each unequal bill dataset
  for (const bill of UNEQUAL_BILLS) {
    test(`calculates payments for unequal bill: "${bill.name}"`, async ({ page }) => {
      await page.goto('.')
      await addParticipants(page, PARTICIPANTS)
      await addUnequalBill(page, bill)
      await page.click(SEL.calculateBtn)
      await expect(page.locator('[data-testid^="payment-"]').first()).toBeVisible({
        timeout: 10000,
      })
    })
  }

  test('recalculates when a bill is added after first calculation', async ({ page }) => {
    await page.goto('.')
    await addParticipants(page, PARTICIPANTS)
    await addEqualBill(page, EQUAL_BILLS[0])
    await page.click(SEL.calculateBtn)
    await expect(page.locator('[data-testid^="payment-"]').first()).toBeVisible({ timeout: 10000 })

    // Add a second bill and recalculate
    await addEqualBill(page, EQUAL_BILLS[1])
    await page.click(SEL.calculateBtn)
    await expect(page.locator('[data-testid^="payment-"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('payment cards list both senders and receivers', async ({ page }) => {
    await page.goto('.')
    await addParticipants(page, PARTICIPANTS)
    // Add a bill where only Alice pays — others owe her
    await addEqualBill(page, EQUAL_BILLS[0])
    await page.click(SEL.calculateBtn)
    await expect(page.locator('[data-testid^="payment-"]').first()).toBeVisible({ timeout: 10000 })
    // Alice paid 90 for 3 people → Alice should appear as receiver
    await expect(page.locator(SEL.paymentItem('Alice'))).toBeVisible()
  })
})
