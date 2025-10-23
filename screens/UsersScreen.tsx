import React, { useContext, useState } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
import Modal from '../components/Modal.tsx';
import Button from '../components/Button.tsx';
// Fix: Add .ts extension to fix module resolution error.
import type { User } from '../types.ts';
import { Role } from '../types.ts';

const UsersScreen: React.FC = () => {
    const { users, addUser } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: Role.Salesperson });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser(newUser);
        setIsModalOpen(false);
        setNewUser({ name: '', email: '', role: Role.Salesperson });
    };
    
    const roleColor = (role: Role) => {
        return role === Role.Admin ? 'bg-indigo-500' : 'bg-cyan-500';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
                <Button onClick={() => setIsModalOpen(true)}>إضافة مستخدم جديد</Button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-4">الاسم</th>
                                <th className="p-4">البريد الإلكتروني</th>
                                <th className="p-4">الدور</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-left">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${roleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة مستخدم جديد">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="الاسم" value={newUser.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <input type="email" name="email" placeholder="البريد الإلكتروني" value={newUser.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required />
                    <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-right" required>
                        <option value={Role.Salesperson}>مندوب مبيعات</option>
                        <option value={Role.Admin}>مدير</option>
                    </select>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">إضافة مستخدم</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersScreen;