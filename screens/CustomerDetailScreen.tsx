// Fix: Provide full content for CustomerDetailScreen.tsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../App.tsx';
import Button from '../components/Button.tsx';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon.tsx';
import InstallmentDetailModal from '../components/InstallmentDetailModal.tsx';
import type { InstallmentPlan } from '../types.ts';

interface CustomerDetailScreenProps {
    customerId: number;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-semibold">{value || 'غير متوفر'}</p>
    </div>
);

const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({ customerId }) => {
    const { customers, sales, cars, installmentPlans, setScreen } = useContext(AppContext);
    const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);

    const customer = customers.find(c => c.id === customerId);
    const customerSales = sales.filter(s => s.customerId === customerId);
    const customerPlans = installmentPlans.filter(p => p.customerId === customerId);

    if (!customer) {
        return (
            <div>
                <h2 className="text-2xl font-bold">لم يتم العثور على العميل</h2>
                <Button onClick={() => setScreen('customers')}>العودة للعملاء</Button>
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex items-center mb-6">
                <button className="p-2 rounded-md hover:bg-gray-700" onClick={() => setScreen('customers')}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mr-4">تفاصيل العميل: {customer.name}</h2>
            </div>

            {/* Customer Details Card */}
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">المعلومات الشخصية</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-right">
                    <DetailItem label="الاسم الكامل" value={customer.name} />
                    <DetailItem label="الرقم الوطني" value={customer.nationalId} />
                    <DetailItem label="رقم الهاتف" value={customer.phone} />
                    <DetailItem label="البريد الإلكتروني" value={customer.email} />
                    <DetailItem label="العنوان" value={customer.address} />
                    <DetailItem label="تاريخ الميلاد" value={customer.birthDate} />
                    <DetailItem label="الحالة الاجتماعية" value={customer.maritalStatus} />
                    <DetailItem label="نظام التعامل" value={customer.customerType} />
                </div>
            </div>
            
            {/* Sales History Card */}
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">سجل الشراء</h3>
                {customerSales.length > 0 ? (
                    <div className="space-y-4">
                        {customerSales.map(sale => {
                             const car = cars.find(c => c.id === sale.carId);
                             const plan = customerPlans.find(p => p.saleId === sale.id);
                             return (
                                 <div key={sale.id} className="bg-gray-800 p-4 rounded-md flex justify-between items-center">
                                     <div>
                                         <p className="font-bold">{car ? `${car.make} ${car.model}` : 'سيارة محذوفة'}</p>
                                         <p className="text-sm text-gray-400">
                                            تاريخ الشراء: {new Date(sale.saleDate).toLocaleDateString('ar-JO')} | 
                                            السعر: {sale.salePrice.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })} | 
                                            النظام: {sale.paymentMethod}
                                         </p>
                                     </div>
                                     {plan && (
                                         <Button variant="secondary" onClick={() => setSelectedPlan(plan)}>
                                             عرض خطة الأقساط
                                         </Button>
                                     )}
                                 </div>
                             )
                        })}
                    </div>
                ) : (
                    <p>لا يوجد سجل شراء لهذا العميل.</p>
                )}
            </div>
            
            {selectedPlan && (
                <InstallmentDetailModal
                    isOpen={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    plan={selectedPlan}
                    customerName={customer.name}
                />
            )}
        </div>
    );
};

export default CustomerDetailScreen;
