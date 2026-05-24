import type { Settlement } from '../types'

export const DEFAULT_SETTLEMENT: Settlement = {
  id: 'draft',
  name: '',
  members: [],
  bills: [],
  sendPayments: {},
  receivePayments: {},
  updatedAt: new Date(),
}
