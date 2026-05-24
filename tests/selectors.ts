/**
 * Central registry of all data-testid selectors used in E2E tests.
 * Update only here when a testid changes — tests import from this file.
 */
export const SEL = {
  // ---------- Participants ----------
  participantNameInput: '[data-testid="participant-name-input"]',
  participantAddBtn: '[data-testid="participant-add-btn"]',
  /** Chip wrapping a single participant. */
  participantItem: (name: string) => `[data-testid="participant-${name}"]`,
  participantRemoveBtn: (name: string) => `[data-testid="participant-remove-${name}"]`,

  // ---------- Bill list ----------
  billAddBtn: '[data-testid="bill-add-btn"]',
  /** Container card for a single bill — scope button lookups inside it. */
  billItem: (name: string) => `[data-testid="bill-item-${name}"]`,
  billEditBtn: '[data-testid="bill-edit-btn"]',
  billDeleteBtn: '[data-testid="bill-delete-btn"]',
  billDuplicateBtn: '[data-testid="bill-duplicate-btn"]',

  // ---------- Bill form ----------
  billForm: '[data-testid="bill-form"]',
  billNameInput: '[data-testid="bill-name-input"]',
  billTypeEqual: '[data-testid="bill-type-equal"]',
  billTypeUnequal: '[data-testid="bill-type-unequal"]',
  billPayerSelect: '[data-testid="bill-payer-select"]',
  billAmountInput: '[data-testid="bill-amount-input"]',
  /** Label element wrapping the checkbox for a participant (clickable). */
  billParticipantCheckbox: (name: string) => `[data-testid="bill-participant-${name}"]`,
  billShareInput: (name: string) => `[data-testid="bill-share-${name}"]`,
  billSaveBtn: '[data-testid="bill-save-btn"]',
  billCancelBtn: '[data-testid="bill-cancel-btn"]',

  // ---------- Payments ----------
  calculateBtn: '[data-testid="calculate-btn"]',
  paymentItem: (name: string) => `[data-testid="payment-${name}"]`,

  // ---------- Home page ----------
  clearBtn: '[data-testid="clear-btn"]',
  saveSettlementBtn: '[data-testid="save-settlement-btn"]',
  settlementNameDialogInput: '[data-testid="settlement-name-input"]',
  settlementSaveConfirmBtn: '[data-testid="settlement-save-confirm-btn"]',
  navSettlements: '[data-testid="nav-settlements"]',

  // ---------- Settlements list page ----------
  /** Container card for a single settlement — scope button lookups inside it. */
  settlementItem: (name: string) => `[data-testid="settlement-${name}"]`,
  settlementEditBtn: '[data-testid="settlement-edit-btn"]',
  settlementDeleteBtn: '[data-testid="settlement-delete-btn"]',
  settlementDuplicateBtn: '[data-testid="settlement-duplicate-btn"]',

  // ---------- Settlement detail page ----------
  settlementDetailName: '[data-testid="settlement-detail-name"]',
  settlementDeleteDetailBtn: '[data-testid="settlement-delete-detail-btn"]',
  settlementClearDetailBtn: '[data-testid="settlement-clear-detail-btn"]',
  settlementDuplicateDetailBtn: '[data-testid="settlement-duplicate-detail-btn"]',
  navHome: '[data-testid="nav-home"]',
}
