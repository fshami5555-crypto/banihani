// Fix: Provide full content for types.ts with all necessary type definitions and enums for the application.
export enum Role {
    Admin = 'مدير',
    Salesperson = 'مندوب مبيعات',
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    vin: string;
    status: 'Available' | 'Sold';
    imageUrl: string;
}

export enum CustomerType {
    Cash = 'كاش',
    Installment = 'أقساط',
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    customerType: CustomerType;
    // Optional fields for installment customers
    birthDate?: string;
    maritalStatus?: 'أعزب' | 'متزوج';
    nationalId?: string;
    incomeSource?: string;
    fixedIncome?: number;
    socialSecuritySubscriptions?: number;
    idFrontUrl?: string; // a real app would handle file uploads
    idBackUrl?: string;
    proofOfIncomeUrl?: string;
    salaryCertificateUrl?: string;
}

export enum PaymentMethod {
    Cash = 'كاش',
    Installment = 'أقساط',
}

export interface Sale {
    id: number;
    carId: number;
    customerId: number;
    salespersonId: number;
    saleDate: string; // ISO string
    salePrice: number;
    paymentMethod: PaymentMethod;
}

export type PaymentStatus = 'مدفوع' | 'غير مدفوع' | 'متأخر';

export interface Payment {
    id: number;
    dueDate: string; // ISO string
    amount: number;
    status: PaymentStatus;
    paymentDate?: string; // ISO string
}

export interface InstallmentPlan {
    id: number;
    saleId: number;
    customerId: number;
    totalAmount: number;
    downPayment: number;
    installmentsCount: number;
    monthlyPayment: number;
    payments: Payment[];
}
