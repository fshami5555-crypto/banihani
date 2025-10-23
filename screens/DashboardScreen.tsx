// Fix: Provide full content for DashboardScreen.tsx
import React, { useContext } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
// Fix: Add .tsx extension to fix module resolution error.
import { CarIcon } from '../components/icons/CarIcon.tsx';
import { DollarSignIcon } from '../components/icons/DollarSignIcon.tsx';
import { UserIcon } from '../components/icons/UserIcon.tsx';
import Button from '../components/Button.tsx';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 flex items-center space-x-4 space-x-reverse">
        <div className="bg-[#992537] p-3 rounded-full">
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardScreen: React.FC = () => {
    const { cars, sales, customers, setScreen } = useContext(AppContext);
    
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.salePrice, 0).toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' });
    const carsSold = sales.length;
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">نظرة عامة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="إجمالي الإيرادات" value={totalRevenue} icon={DollarSignIcon} />
                <StatCard title="السيارات المباعة" value={carsSold} icon={CarIcon} />
                <StatCard title="العملاء المسجلون" value={customers.length} icon={UserIcon} />
            </div>

            <div className="mt-10 bg-gray-900 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">السيارات المتاحة</h3>
                    <Button onClick={() => setScreen('inventory')}>عرض الكل</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">السيارة</th>
                                <th className="p-4">السنة</th>
                                <th className="p-4">السعر</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.filter(c => c.status === 'Available').slice(0, 5).map(car => (
                                <tr key={car.id} className="border-b border-gray-800 hover:bg-gray-800">
                                    <td className="p-4 font-medium">{car.make} {car.model}</td>
                                    <td className="p-4">{car.year}</td>
                                    <td className="p-4">{car.price.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;