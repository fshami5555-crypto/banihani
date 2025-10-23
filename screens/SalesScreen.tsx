// Fix: Create the SalesScreen component to display sales history.
import React, { useContext } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
import Button from '../components/Button.tsx';
// Fix: Add .ts extension to fix module resolution error.
import type { User, Customer } from '../types.ts';
import { PaymentMethod } from '../types.ts';

const SalesScreen: React.FC = () => {
    const { sales, cars, customers, users, setScreen } = useContext(AppContext);

    const getEntityName = <T extends { id: number, name: string }>(entities: T[], id: number) => {
        return entities.find(e => e.id === id)?.name || 'غير معروف';
    };

    const paymentMethodColor = (method: PaymentMethod) => {
        return method === PaymentMethod.Installment ? 'bg-blue-500' : 'bg-green-500';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">سجل المبيعات</h2>
                <Button onClick={() => setScreen('new-sale')}>عملية بيع جديدة</Button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">السيارة</th>
                                <th className="p-4">العميل</th>
                                <th className="p-4">مندوب المبيعات</th>
                                <th className="p-4">تاريخ البيع</th>
                                <th className="p-4">طريقة الدفع</th>
                                <th className="p-4">سعر البيع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.sort((a,b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()).map(sale => {
                                const car = cars.find(c => c.id === sale.carId);
                                return (
                                    <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                        <td className="p-4 font-medium">{car ? `${car.make} ${car.model}` : 'غير معروف'}</td>
                                        <td className="p-4">{getEntityName<Customer>(customers, sale.customerId)}</td>
                                        <td className="p-4">{getEntityName<User>(users, sale.salespersonId)}</td>
                                        <td className="p-4">{new Date(sale.saleDate).toLocaleDateString('ar-JO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${paymentMethodColor(sale.paymentMethod)}`}>
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="p-4">{sale.salePrice.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesScreen;