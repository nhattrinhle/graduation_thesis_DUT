export interface HistoryTransaction {
  transactionId: number
  userId: number
  amountInCredits: number
  balance: number
  description: string
  createdAt: string
  updatedAt: string
}
