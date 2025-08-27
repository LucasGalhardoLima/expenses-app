import { apiClient } from './client';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionDto,
  TransactionSummary,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  TransactionType,
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  CreditCard,
  CreateCreditCardDto,
  UpdateCreditCardDto,
  CreditCardTransaction,
  CreateCreditCardTransactionDto,
  UpdateCreditCardTransactionDto,
  CreditCardCategory,
  CreditCardSummary,
  PaginatedResponse,
} from '../types';

// Transaction API
export const transactionApi = {
  getAll: (params?: QueryTransactionDto): Promise<PaginatedResponse<Transaction>> =>
    apiClient.get('/transactions', { params }).then(res => res.data),
    
  getById: (id: string): Promise<Transaction> =>
    apiClient.get(`/transactions/${id}`).then(res => res.data),
    
  create: (data: CreateTransactionDto): Promise<Transaction> =>
    apiClient.post('/transactions', data).then(res => res.data),
    
  update: (id: string, data: UpdateTransactionDto): Promise<Transaction> =>
    apiClient.patch(`/transactions/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> =>
    apiClient.delete(`/transactions/${id}`).then(res => res.data),
    
  getSummary: (params?: QueryTransactionDto): Promise<TransactionSummary> =>
    apiClient.get('/transactions/summary', { params }).then(res => res.data),
};

// Category API
export const categoryApi = {
  getAll: (type?: TransactionType): Promise<Category[]> =>
    apiClient.get('/categories', { params: type ? { type } : undefined }).then(res => res.data),
    
  getById: (id: string): Promise<Category> =>
    apiClient.get(`/categories/${id}`).then(res => res.data),
    
  create: (data: CreateCategoryDto): Promise<Category> =>
    apiClient.post('/categories', data).then(res => res.data),
    
  update: (id: string, data: UpdateCategoryDto): Promise<Category> =>
    apiClient.patch(`/categories/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> =>
    apiClient.delete(`/categories/${id}`).then(res => res.data),
};

// Budget API
export const budgetApi = {
  getAll: (): Promise<Budget[]> =>
    apiClient.get('/budgets').then(res => res.data),
    
  getByMonth: (month: string): Promise<Budget | null> =>
    apiClient.get(`/budgets/${month}`)
      .then(res => res.data)
      .catch(() => null),
    
  create: (data: CreateBudgetDto): Promise<Budget> =>
    apiClient.post('/budgets', data).then(res => res.data),
    
  update: (month: string, data: UpdateBudgetDto): Promise<Budget> =>
    apiClient.patch(`/budgets/${month}`, data).then(res => res.data),
    
  delete: (month: string, type: string): Promise<void> =>
    apiClient.delete(`/budgets/${month}/${type}`).then(res => res.data),
};

// Credit Card API
export const creditCardApi = {
  // Cards
  getAllCards: (): Promise<CreditCard[]> =>
    apiClient.get('/credit-cards').then(res => res.data),
    
  getCardById: (id: string): Promise<CreditCard> =>
    apiClient.get(`/credit-cards/${id}`).then(res => res.data),
    
  createCard: (data: CreateCreditCardDto): Promise<CreditCard> =>
    apiClient.post('/credit-cards', data).then(res => res.data),
    
  updateCard: (id: string, data: UpdateCreditCardDto): Promise<CreditCard> =>
    apiClient.patch(`/credit-cards/${id}`, data).then(res => res.data),
    
  deleteCard: (id: string): Promise<void> =>
    apiClient.delete(`/credit-cards/${id}`).then(res => res.data),

  // Transactions
  getAllTransactions: (cardId?: string): Promise<CreditCardTransaction[]> =>
    apiClient.get('/credit-cards/transactions/all', { params: { cardId } }).then(res => res.data),
    
  createTransaction: (data: CreateCreditCardTransactionDto): Promise<CreditCardTransaction> =>
    apiClient.post('/credit-cards/transactions', data).then(res => res.data),
    
  updateTransaction: (id: string, data: UpdateCreditCardTransactionDto): Promise<CreditCardTransaction> =>
    apiClient.patch(`/credit-cards/transactions/${id}`, data).then(res => res.data),
    
  deleteTransaction: (id: string): Promise<void> =>
    apiClient.delete(`/credit-cards/transactions/${id}`).then(res => res.data),

  // Categories
  getAllCategories: (): Promise<CreditCardCategory[]> =>
    apiClient.get('/credit-cards/categories').then(res => res.data),

  // Summary
  getSummary: (cardId?: string): Promise<CreditCardSummary> =>
    apiClient.get('/credit-cards/summary', { params: { cardId } }).then(res => res.data),

  // Card Bill
  getCardBill: (cardId: string, month: string): Promise<any> =>
    apiClient.get(`/credit-cards/${cardId}/bill/${month}`).then(res => res.data),
};
