// Fix: Provide full content for CollectionScreen.tsx
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App.tsx';
import type { Payment, Customer } from '../types.ts';
import { PaymentStatus } from '../types.ts';

interface DuePayment extends Payment {
    customerName: string;
    customerPhone: string;
    planId: number;
}

const CollectionScreen: React.FC = () => {
    const { installmentPlans, customers } = useContext(AppContext);
    
    const getCustomerName = (id: number) => customers.find(c => c.id === id)?.name || 'غير معروف';
    const getCustomerPhone = (id: number) => customers.find(c => c.id === id)?.phone || 'غير معروف';
    
    const duePayments = useMemo<DuePayment[]>(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        
        const allDuePayments: DuePayment[] = [];

        installmentPlans.forEach(plan => {
            plan.payments.forEach(payment => {
                const dueDate = new Date(payment.dueDate);
                if (payment.status === 'غير مدفوع') {
                    const isOverdue = dueDate < today;
                    if (isOverdue || dueDate.getTime() === today.getTime()) {
                         allDuePayments.push({
                            ...payment,
                            status: isOverdue ? 'متأخر' : 'غير مدفوع',
                            customerName: getCustomerName(plan.customerId),
                            customerPhone: getCustomerPhone(plan.customerId),
                            planId: plan.id,
                        });
                    }
                }
            });
        });

        return allDuePayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [installmentPlans, customers]);
    
    const statusColor = (status: PaymentStatus) => {
        return status === 'متأخر' ? 'bg-red-500' : 'bg-yellow-500';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">تحصيل الأقساط المستحقة</h2>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">العميل</th>
                                <th className="p-4">رقم الهاتف</th>
                                <th className="p-4">تاريخ الاستحقاق</th>
                                <th className="p-4">المبلغ المستحق</th>
                                <th className="p-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {duePayments.length > 0 ? (
                                duePayments.map(payment => (
                                    <tr key={`${payment.planId}-${payment.id}`} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                        <td className="p-4 font-medium">{payment.customerName}</td>
                                        <td className="p-4">{payment.customerPhone}</td>
                                        <td className="p-4">{new Date(payment.dueDate).toLocaleDateString('ar-JO')}</td>
                                        <td className="p-4">{payment.amount.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusColor(payment.status)}`}>
                                                {payment.status === 'متأخر' ? 'متأخر' : 'مستحق اليوم'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">
                                        لا توجد أقساط مستحقة حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CollectionScreen;
