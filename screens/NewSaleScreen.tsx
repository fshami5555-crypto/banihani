// Fix: Create the NewSaleScreen component for adding new sales records.
import React, { useContext, useState, useEffect } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
import Button from '../components/Button.tsx';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon.tsx';
// Fix: Add .ts extension to fix module resolution error.
import { PaymentMethod, CustomerType } from '../types.ts';

const NewSaleScreen: React.FC = () => {
    const { cars, customers, currentUser, addSale, addInstallmentPlan, setScreen } = useContext(AppContext);
    
    // Form State
    const [selectedCarId, setSelectedCarId] = useState<string>('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [salePrice, setSalePrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
    
    // Installment State
    const [downPayment, setDownPayment] = useState<number>(0);
    const [installmentsCount, setInstallmentsCount] = useState<number>(12);
    const [firstInstallmentDate, setFirstInstallmentDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Derived State
    const availableCars = cars.filter(c => c.status === 'Available');
    const selectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId));
    const amountToFinance = salePrice - downPayment;
    const monthlyPayment = amountToFinance > 0 && installmentsCount > 0 ? amountToFinance / installmentsCount : 0;


    useEffect(() => {
        if (selectedCustomer && selectedCustomer.customerType === CustomerType.Cash) {
            setPaymentMethod(PaymentMethod.Cash);
        }
    }, [selectedCustomerId, selectedCustomer]);


    const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const carId = e.target.value;
        setSelectedCarId(carId);
        const car = availableCars.find(c => c.id === parseInt(carId));
        if (car) {
            setSalePrice(car.price);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCarId || !selectedCustomerId || !currentUser) {
            alert('يرجى تعبئة جميع الحقول.');
            return;
        }

        const newSale = addSale({
            carId: parseInt(selectedCarId),
            customerId: parseInt(selectedCustomerId),
            salespersonId: currentUser.id,
            saleDate: new Date().toISOString(),
            salePrice,
            paymentMethod,
        });

        if (paymentMethod === PaymentMethod.Installment) {
            const payments = Array.from({ length: installmentsCount }, (_, i) => {
                const date = new Date(firstInstallmentDate);
                date.setMonth(date.getMonth() + i);
                return { id: Date.now() + i, dueDate: date.toISOString(), amount: monthlyPayment, status: 'غير مدفوع' as 'غير مدفوع' };
            });

            addInstallmentPlan({
                saleId: newSale.id,
                customerId: newSale.customerId,
                totalAmount: salePrice,
                downPayment,
                installmentsCount,
                monthlyPayment,
                payments,
            });
            alert('تم تسجيل عملية البيع وإنشاء خطة الأقساط بنجاح!');
            setScreen(`customer-detail-${newSale.customerId}`);
        } else {
            alert('تم تسجيل عملية البيع بنجاح!');
            setScreen('sales');
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button className="p-2 rounded-md hover:bg-gray-700" onClick={() => setScreen('sales')}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mr-4">عملية بيع جديدة</h2>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="car" className="block text-sm font-medium text-gray-300 text-right mb-1">اختر السيارة</label>
                            <select id="car" value={selectedCarId} onChange={handleCarChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required>
                                <option value="" disabled>-- اختر سيارة --</option>
                                {availableCars.map(car => (
                                    <option key={car.id} value={car.id}>{car.make} {car.model} ({car.year})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="customer" className="block text-sm font-medium text-gray-300 text-right mb-1">اختر العميل</label>
                            <select id="customer" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required>
                                <option value="" disabled>-- اختر عميل --</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name} ({customer.customerType})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-300 text-right mb-1">سعر البيع الإجمالي (د.أ)</label>
                        <input type="number" id="salePrice" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    </div>

                    <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300 text-right mb-1">نظام البيع</label>
                        <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" disabled={selectedCustomer?.customerType === CustomerType.Cash}>
                            <option value={PaymentMethod.Cash}>كاش</option>
                            <option value={PaymentMethod.Installment}>أقساط</option>
                        </select>
                        {selectedCustomer?.customerType === CustomerType.Cash && <p className="text-xs text-yellow-400 mt-1 text-right">هذا العميل مسجل بنظام الكاش فقط.</p>}
                    </div>

                    {paymentMethod === PaymentMethod.Installment && (
                        <div className="bg-gray-800 p-4 rounded-lg space-y-4 border border-gray-700">
                             <h3 className="text-lg font-semibold text-white">تفاصيل الأقساط</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-300 text-right mb-1">الدفعة الأولى (د.أ)</label>
                                    <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right"/>
                                </div>
                                 <div>
                                    <label htmlFor="installmentsCount" className="block text-sm font-medium text-gray-300 text-right mb-1">عدد الأشهر</label>
                                    <input type="number" id="installmentsCount" value={installmentsCount} onChange={(e) => setInstallmentsCount(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" />
                                </div>
                                 <div>
                                    <label htmlFor="firstInstallmentDate" className="block text-sm font-medium text-gray-300 text-right mb-1">تاريخ أول قسط</label>
                                    <input type="date" id="firstInstallmentDate" value={firstInstallmentDate} onChange={(e) => setFirstInstallmentDate(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" />
                                </div>
                             </div>
                             <div className="bg-gray-900 p-4 rounded-md text-center">
                                <p className="text-gray-400">القسط الشهري المحسوب</p>
                                <p className="text-2xl font-bold text-green-400">{monthlyPayment.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD', minimumFractionDigits: 2 })}</p>
                             </div>
                        </div>
                    )}


                    <div className="pt-4 flex justify-end">
                        <Button type="submit">تسجيل البيع</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewSaleScreen;