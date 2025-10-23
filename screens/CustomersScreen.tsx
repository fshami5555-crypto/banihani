// Fix: Create the CustomersScreen component to manage and display customer data.
import React, { useContext, useState } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
import Modal from '../components/Modal.tsx';
import Button from '../components/Button.tsx';
// Fix: Add .ts extension to fix module resolution error.
import type { Customer } from '../types.ts';
import { CustomerType } from '../types.ts';

const CustomersScreen: React.FC = () => {
    const { customers, addCustomer, setScreen } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialCustomerState: Omit<Customer, 'id'> = {
        name: '', phone: '', email: '', address: '', customerType: CustomerType.Cash,
        birthDate: '', maritalStatus: 'أعزب', nationalId: '',
        incomeSource: '', fixedIncome: 0, socialSecuritySubscriptions: 0
    };
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>(initialCustomerState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In a real app, this would handle file uploads. Here we'll just log it.
        if (e.target.files && e.target.files[0]) {
            console.log(`File selected for ${e.target.name}: ${e.target.files[0].name}`);
            // You could store a fake URL or file name in state if needed
            // setNewCustomer(prev => ({ ...prev, [e.target.name]: e.target.files[0].name }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCustomer(newCustomer);
        setIsModalOpen(false);
        setNewCustomer(initialCustomerState);
    };

    const handleViewDetails = (customerId: number) => {
        setScreen(`customer-detail-${customerId}`);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">إدارة العملاء</h2>
                <Button onClick={() => setIsModalOpen(true)}>إضافة عميل جديد</Button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">الاسم</th>
                                <th className="p-4">رقم الهاتف</th>
                                <th className="p-4">نظام التعامل</th>
                                <th className="p-4">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                    <td className="p-4 font-medium">{customer.name}</td>
                                    <td className="p-4">{customer.phone}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${customer.customerType === CustomerType.Installment ? 'bg-blue-500' : 'bg-green-500'}`}>
                                            {customer.customerType}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="secondary" onClick={() => handleViewDetails(customer.id)}>
                                            عرض التفاصيل
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة عميل جديد">
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Customer Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 text-right mb-1">نظام التعامل</label>
                        <select name="customerType" value={newCustomer.customerType} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required>
                            <option value={CustomerType.Cash}>كاش</option>
                            <option value={CustomerType.Installment}>أقساط</option>
                        </select>
                    </div>

                    {/* Basic Info */}
                    <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4">المعلومات الأساسية</h4>
                    <input type="text" name="name" placeholder="الاسم الكامل" value={newCustomer.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="text" name="nationalId" placeholder="الرقم الوطني" value={newCustomer.nationalId} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="date" name="birthDate" value={newCustomer.birthDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <select name="maritalStatus" value={newCustomer.maritalStatus} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required>
                        <option value="أعزب">أعزب</option>
                        <option value="متزوج">متزوج</option>
                    </select>
                    <input type="tel" name="phone" placeholder="رقم الهاتف" value={newCustomer.phone} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="email" name="email" placeholder="البريد الإلكتروني" value={newCustomer.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" />
                    <input type="text" name="address" placeholder="العنوان" value={newCustomer.address} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />

                    {/* File Inputs for ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 text-right mb-1">صورة الهوية (الأمام)</label>
                            <input type="file" name="idFrontUrl" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#992537] file:text-white hover:file:bg-red-700"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 text-right mb-1">صورة الهوية (الخلف)</label>
                            <input type="file" name="idBackUrl" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#992537] file:text-white hover:file:bg-red-700"/>
                        </div>
                    </div>
                    
                    {/* Installment Info */}
                    {newCustomer.customerType === CustomerType.Installment && (
                        <>
                            <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-6">معلومات الأقساط</h4>
                            <input type="text" name="incomeSource" placeholder="مصدر الدخل" value={newCustomer.incomeSource} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                            <input type="number" name="fixedIncome" placeholder="قيمة الدخل الثابت (د.أ)" value={newCustomer.fixedIncome} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                            <input type="number" name="socialSecuritySubscriptions" placeholder="عدد اشتراكات الضمان" value={newCustomer.socialSecuritySubscriptions} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 text-right mb-1">إرفاق إثبات الدخل (ضمان اجتماعي)</label>
                                <input type="file" name="proofOfIncomeUrl" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#992537] file:text-white hover:file:bg-red-700"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 text-right mb-1">إرفاق شهادة راتب</label>
                                <input type="file" name="salaryCertificateUrl" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#992537] file:text-white hover:file:bg-red-700"/>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit">إضافة عميل</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomersScreen;