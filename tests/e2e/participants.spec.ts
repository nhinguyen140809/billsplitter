import { test, expect } from '@playwright/test'
import { SEL } from '../selectors'
import { PARTICIPANTS, INVALID_PARTICIPANT_NAMES } from '../data/testData'
import { addParticipant, addParticipants } from '../helpers/actions'

test.describe('Participants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('.')
  })

  // Data-driven: each valid name can be added
  for (const name of PARTICIPANTS) {
    test(`adds participant "${name}"`, async ({ page }) => {
      await addParticipant(page, name)
      await expect(page.locator(SEL.participantItem(name))).toBeVisible()
    })
  }

  // Data-driven: invalid names are rejected
  for (const { input, description } of INVALID_PARTICIPANT_NAMES) {
    test(`rejects empty name (${description})`, async ({ page }) => {
      await page.fill(SEL.participantNameInput, input)
      await page.click(SEL.participantAddBtn)
      await expect(page.getByText('Name cannot be empty')).toBeVisible()
    })
  }

  test('rejects duplicate name', async ({ page }) => {
    await addParticipant(page, 'Alice')
    await addParticipant(page, 'Alice')
    await expect(page.getByText('Name already exists')).toBeVisible()
    // Only one chip should exist
    await expect(page.locator(SEL.participantItem('Alice'))).toHaveCount(1)
  })

  test('adds via Enter key', async ({ page }) => {
    await page.fill(SEL.participantNameInput, 'Alice')
    await page.locator(SEL.participantNameInput).press('Enter')
    await expect(page.locator(SEL.participantItem('Alice'))).toBeVisible()
  })

  test('removes a participant', async ({ page }) => {
    await addParticipant(page, 'Alice')
    await page.click(SEL.participantRemoveBtn('Alice'))
    await expect(page.locator(SEL.participantItem('Alice'))).not.toBeVisible()
  })

  test('adds all participants and all chips appear', async ({ page }) => {
    await addParticipants(page, PARTICIPANTS)
    for (const name of PARTICIPANTS) {
      await expect(page.locator(SEL.participantItem(name))).toBeVisible()
    }
  })

  test('input clears after successful add', async ({ page }) => {
    await addParticipant(page, 'Alice')
    await expect(page.locator(SEL.participantNameInput)).toHaveValue('')
  })
})
