import type { Page } from '@playwright/test'
import { SEL } from '../selectors'
import type { EqualBill, UnequalBill } from '../data/testData'

export async function addParticipant(page: Page, name: string) {
  await page.fill(SEL.participantNameInput, name)
  await page.click(SEL.participantAddBtn)
  await page.locator(SEL.participantItem(name)).waitFor({ state: 'visible' })
}

export async function addParticipants(page: Page, names: string[]) {
  for (const name of names) {
    await addParticipant(page, name)
  }
}

export async function addEqualBill(page: Page, bill: EqualBill) {
  await page.click(SEL.billAddBtn)
  await page.locator(SEL.billForm).waitFor({ state: 'visible' })
  await page.fill(SEL.billNameInput, bill.name)
  await page.click(SEL.billTypeEqual)
  await page.click(SEL.billPayerSelect)
  await page.getByRole('listbox').waitFor({ state: 'visible' })
  await page.getByRole('option', { name: bill.payer }).click()
  await page.fill(SEL.billAmountInput, bill.amount)
  for (const participant of bill.participants) {
    await page.locator(SEL.billParticipantCheckbox(participant)).click()
  }
  await page.click(SEL.billSaveBtn)
  await page.locator(SEL.billItem(bill.name)).waitFor({ state: 'attached' })
}

export async function addUnequalBill(page: Page, bill: UnequalBill) {
  await page.click(SEL.billAddBtn)
  await page.locator(SEL.billForm).waitFor({ state: 'visible' })
  await page.fill(SEL.billNameInput, bill.name)
  await page.click(SEL.billTypeUnequal)
  await page.click(SEL.billPayerSelect)
  await page.getByRole('listbox').waitFor({ state: 'visible' })
  await page.getByRole('option', { name: bill.payer }).click()
  for (const [member, share] of Object.entries(bill.shares)) {
    await page.fill(SEL.billShareInput(member), share)
  }
  await page.click(SEL.billSaveBtn)
  await page.locator(SEL.billItem(bill.name)).waitFor({ state: 'attached' })
}

export async function saveSettlement(page: Page, name: string) {
  await page.click(SEL.saveSettlementBtn)
  await page.fill(SEL.settlementNameDialogInput, name)
  await page.click(SEL.settlementSaveConfirmBtn)
  await page.waitForURL(/\/settlements\//)
}
