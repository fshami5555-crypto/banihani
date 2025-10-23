// Fix: Provide full content for InstallmentDetailModal.tsx
import React, { useContext } from 'react';
import { AppContext } from '../App.tsx';
import Modal from './Modal.tsx';
import Button from './Button.tsx';
import type { InstallmentPlan } from '../types.ts';
import { PaymentStatus } from '../types.ts';

interface InstallmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: InstallmentPlan;
    customerName: string;
}

const InstallmentDetailModal: React.FC<InstallmentDetailModalProps> = ({ isOpen, onClose, plan, customerName }) => {
    const { updatePaymentStatus } = useContext(AppContext);
    
    const statusColor = (status: PaymentStatus) => {
        switch(status) {
            case 'مدفوع': return 'bg-green-500';
            case 'متأخر': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    };

    const handleMarkAsPaid = (paymentId: number) => {
        if (window.confirm('هل أنت متأكد من تسجيل هذا القسط كمدفوع؟')) {
            updatePaymentStatus(plan.id, paymentId, 'مدفوع');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`خطة أقساط العميل: ${customerName}`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-700 p-4 rounded-lg">
                     <div><p className="text-sm text-gray-400">المبلغ الإجمالي</p><p>{plan.totalAmount.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</p></div>
                     <div><p className="text-sm text-gray-400">الدفعة الأولى</p><p>{plan.downPayment.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</p></div>
                     <div><p className="text-sm text-gray-400">القسط الشهري</p><p>{plan.monthlyPayment.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</p></div>
                     <div><p className="text-sm text-gray-400">عدد الأقساط</p><p>{plan.installmentsCount}</p></div>
                </div>
                
                <h4 className="text-lg font-semibold border-t border-gray-600 pt-4 mt-4">جدول الدفعات</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-600 text-gray-400">
                                <th className="p-2">تاريخ الاستحقاق</th>
                                <th className="p-2">المبلغ</th>
                                <th className="p-2">الحالة</th>
                                <th className="p-2">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plan.payments.map((payment, index) => (
                                <tr key={payment.id} className="border-b border-gray-700">
                                    <td className="p-2">{new Date(payment.dueDate).toLocaleDateString('ar-JO')}</td>
                                    <td className="p-2">{payment.amount.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        {payment.status === 'غير مدفوع' && (
                                            <Button variant="secondary" onClick={() => handleMarkAsPaid(payment.id)}>
                                                تسجيل كمدفوع
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex justify-end pt-4">
                    <Button onClick={onClose} variant="secondary">إغلاق</Button>
                </div>
            </div>
        </Modal>
    );
};

export default InstallmentDetailModal;
