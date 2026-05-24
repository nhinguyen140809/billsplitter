import { test, expect } from '@playwright/test'
import { SEL } from '../selectors'
import { PARTICIPANTS, EQUAL_BILLS, UNEQUAL_BILLS } from '../data/testData'
import { addParticipants, addEqualBill, addUnequalBill } from '../helpers/actions'

test.describe('Bills', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('.')
    await addParticipants(page, PARTICIPANTS)
  })

  // ---------- Equal bills — data-driven ----------
  for (const bill of EQUAL_BILLS) {
    test(`adds equal bill: "${bill.name}"`, async ({ page }) => {
      await addEqualBill(page, bill)
      const item = page.locator(SEL.billItem(bill.name))
      await expect(item).toBeVisible()
      await expect(item).toContainText(bill.payer)
      await expect(item).toContainText('Equal')
    })
  }

  // ---------- Unequal bills — data-driven ----------
  for (const bill of UNEQUAL_BILLS) {
    test(`adds unequal bill: "${bill.name}"`, async ({ page }) => {
      await addUnequalBill(page, bill)
      const item = page.locator(SEL.billItem(bill.name))
      await expect(item).toBeVisible()
      await expect(item).toContainText(bill.payer)
      await expect(item).toContainText('Unequal')
    })
  }

  // ---------- Bill type switching ----------
  test('switches between Equal and Unequal types in the form', async ({ page }) => {
    await page.click(SEL.billAddBtn)
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.click(SEL.billTypeUnequal)
    await expect(page.locator(SEL.billShareInput(PARTICIPANTS[0]))).toBeVisible()
    await page.click(SEL.billTypeEqual)
    await expect(page.locator(SEL.billAmountInput)).toBeVisible()
  })

  // ---------- Participant count badge ----------
  test('participant count updates when selecting participants', async ({ page }) => {
    await page.click(SEL.billAddBtn)
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.click(SEL.billTypeEqual)
    await page.click(SEL.billParticipantCheckbox(PARTICIPANTS[0]))
    await expect(page.getByText('1 / 3 selected').first()).toBeVisible()
    await page.click(SEL.billParticipantCheckbox(PARTICIPANTS[1]))
    await expect(page.getByText('2 / 3 selected').first()).toBeVisible()
  })

  // ---------- Select all ----------
  test('select-all checkbox selects all participants', async ({ page }) => {
    await page.click(SEL.billAddBtn)
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.click(SEL.billTypeEqual)
    await page.click('[data-testid="bill-participant-all"]')
    await expect(
      page.getByText(`${PARTICIPANTS.length} / ${PARTICIPANTS.length} selected`).first()
    ).toBeVisible()
  })

  // ---------- Cancel ----------
  test('cancel closes the form without saving', async ({ page }) => {
    await page.click(SEL.billAddBtn)
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.fill(SEL.billNameInput, 'Should Not Save')
    await page.click(SEL.billCancelBtn)
    await expect(page.locator(SEL.billForm)).not.toBeVisible()
    await expect(page.locator(SEL.billItem('Should Not Save'))).not.toBeVisible()
  })

  // ---------- Edit ----------
  test('edits an existing bill name', async ({ page }) => {
    await addEqualBill(page, EQUAL_BILLS[0])
    await page.locator(SEL.billItem(EQUAL_BILLS[0].name)).locator(SEL.billEditBtn).click()
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.fill(SEL.billNameInput, 'Edited Name')
    await page.click(SEL.billSaveBtn)
    await expect(page.locator(SEL.billItem('Edited Name'))).toBeVisible()
    await expect(page.locator(SEL.billItem(EQUAL_BILLS[0].name))).not.toBeVisible()
  })

  // ---------- Delete ----------
  for (const bill of EQUAL_BILLS.slice(0, 2)) {
    test(`deletes bill: "${bill.name}"`, async ({ page }) => {
      await addEqualBill(page, bill)
      await page.locator(SEL.billItem(bill.name)).locator(SEL.billDeleteBtn).click()
      await expect(page.locator(SEL.billItem(bill.name))).not.toBeVisible()
    })
  }

  // ---------- Duplicate ----------
  test('duplicates a bill with "Copy of" prefix', async ({ page }) => {
    await addEqualBill(page, EQUAL_BILLS[0])
    await page.locator(SEL.billItem(EQUAL_BILLS[0].name)).locator(SEL.billDuplicateBtn).click()
    await expect(page.locator(SEL.billItem(`Copy of ${EQUAL_BILLS[0].name}`))).toBeVisible()
    await expect(page.locator(SEL.billItem(EQUAL_BILLS[0].name))).toBeVisible()
  })

  // ---------- Validation ----------
  test('form stays open when payer is not selected', async ({ page }) => {
    await page.click(SEL.billAddBtn)
    await page.locator(SEL.billForm).waitFor({ state: 'visible' })
    await page.fill(SEL.billNameInput, 'No Payer Bill')
    await page.fill(SEL.billAmountInput, '50')
    await page.click(SEL.billSaveBtn)
    await expect(page.locator(SEL.billForm)).toBeVisible()
  })
})
