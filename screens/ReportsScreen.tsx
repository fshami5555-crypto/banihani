// Fix: Provide full content for ReportsScreen.tsx
import React, { useContext } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';

const ReportsScreen: React.FC = () => {
    const { sales, users } = useContext(AppContext);

    // This is a very basic report. A real app would use a charting library.
    const salesBySalesperson = users.map(user => {
        const userSales = sales.filter(s => s.salespersonId === user.id);
        const totalValue = userSales.reduce((acc, s) => acc + s.salePrice, 0);
        return {
            ...user,
            salesCount: userSales.length,
            totalValue
        };
    }).sort((a, b) => b.totalValue - a.totalValue);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">تقارير المبيعات</h2>
            
            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <h3 className="text-xl font-bold p-6 border-b border-gray-700">أداء موظفي المبيعات</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">الموظف</th>
                                <th className="p-4">عدد المبيعات</th>
                                <th className="p-4">إجمالي قيمة المبيعات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesBySalesperson.map(report => (
                                <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                    <td className="p-4 font-medium">{report.name}</td>
                                    <td className="p-4">{report.salesCount}</td>
                                    <td className="p-4">{report.totalValue.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen;