export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum BudgetType {
  INCOME_BASED = 'INCOME_BASED',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface CreateTransactionDto {
  date: string;
  amount: string; // Changed to string to match backend validation
  type: TransactionType;
  description?: string;
  categoryId: string;
}

export interface UpdateTransactionDto {
  date?: string;
  amount?: string; // Changed to string to match backend validation
  type?: TransactionType;
  description?: string;
  categoryId?: string;
}

export interface QueryTransactionDto {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  categoryBreakdown: Array<{
    categoryId: string;
    category: Category;
    _sum: { amount: number };
    _count: number;
  }>;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  type: TransactionType;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  type?: TransactionType;
}

export interface Budget {
  id: string;
  month: string;
  amount: number;
  type: BudgetType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  month: string;
  amount: number;
  type: BudgetType;
}

export interface UpdateBudgetDto {
  month?: string;
  amount?: number;
  type?: BudgetType;
}

// Credit Card interfaces
export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  transactions?: CreditCardTransaction[];
}

export interface CreditCardCategory {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  transactions?: CreditCardTransaction[];
}

export interface CreditCardTransaction {
  id: string;
  date: string;
  amount: number;
  description?: string;
  categoryId: string;
  cardId: string;
  createdAt: string;
  updatedAt: string;
  category: CreditCardCategory;
  card: CreditCard;
}

export interface CreateCreditCardDto {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

export interface UpdateCreditCardDto {
  name?: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
  color?: string;
}

export interface CreateCreditCardTransactionDto {
  date: string;
  amount: number;
  description?: string;
  categoryId: string;
  cardId: string;
  installments?: number;
  currentInstallment?: number;
}

export interface UpdateCreditCardTransactionDto {
  date?: string;
  amount?: number;
  description?: string;
  categoryId?: string;
  cardId?: string;
}

export interface CreditCardSummary {
  totalSpent: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    categoryId: string;
    category: CreditCardCategory;
    total: number;
    count: number;
  }>;
  cardBreakdown: Array<{
    cardId: string;
    card: CreditCard;
    total: number;
    count: number;
  }>;
}