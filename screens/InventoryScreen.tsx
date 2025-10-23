// Fix: Provide full content for InventoryScreen.tsx
import React, { useContext, useState } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
import Modal from '../components/Modal.tsx';
import Button from '../components/Button.tsx';
// Fix: Add .ts extension to fix module resolution error.
import type { Car } from '../types.ts';

const InventoryScreen: React.FC = () => {
    const { cars, addCar } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCar, setNewCar] = useState<Omit<Car, 'id' | 'status' | 'imageUrl'>>({ make: '', model: '', year: new Date().getFullYear(), price: 0, vin: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setNewCar(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCar({ ...newCar, status: 'Available', imageUrl: `https://picsum.photos/seed/${newCar.vin}/300/200` });
        setIsModalOpen(false);
        setNewCar({ make: '', model: '', year: new Date().getFullYear(), price: 0, vin: '' });
    };
    
    const statusColor = (status: 'Available' | 'Sold') => {
        return status === 'Available' ? 'bg-green-500' : 'bg-red-500';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">إدارة المخزون</h2>
                <Button onClick={() => setIsModalOpen(true)}>إضافة سيارة جديدة</Button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">صورة</th>
                                <th className="p-4">النوع</th>
                                <th className="p-4">الموديل</th>
                                <th className="p-4">السنة</th>
                                <th className="p-4">السعر</th>
                                <th className="p-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                    <td className="p-2"><img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-24 h-16 object-cover rounded-md" /></td>
                                    <td className="p-4 font-medium">{car.make}</td>
                                    <td className="p-4">{car.model}</td>
                                    <td className="p-4">{car.year}</td>
                                    <td className="p-4">{car.price.toLocaleString('ar-JO', { style: 'currency', currency: 'JOD' })}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusColor(car.status)}`}>
                                            {car.status === 'Available' ? 'متاحة' : 'مباعة'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة سيارة جديدة">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="make" placeholder="النوع (مثل: تويوتا)" value={newCar.make} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="text" name="model" placeholder="الموديل (مثل: كامري)" value={newCar.model} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="number" name="year" placeholder="سنة الصنع" value={newCar.year} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="number" name="price" placeholder="السعر" value={newCar.price} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="text" name="vin" placeholder="رقم الهيكل (VIN)" value={newCar.vin} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <div className="flex justify-end pt-4">
                        <Button type="submit">إضافة السيارة</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InventoryScreen;