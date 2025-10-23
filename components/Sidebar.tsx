// Fix: Provide full content for Sidebar.tsx
import React, { useContext } from 'react';
// Fix: Add .tsx extension to App import
import { AppContext } from '../App.tsx';
import { DashboardIcon } from './icons/DashboardIcon.tsx';
import { CarIcon } from './icons/CarIcon.tsx';
import { DollarSignIcon } from './icons/DollarSignIcon.tsx';
import { UserIcon } from './icons/UserIcon.tsx';
import { UsersIcon } from './icons/UsersIcon.tsx';
import { ChartBarIcon } from './icons/ChartBarIcon.tsx';
import { CalendarCheckIcon } from './icons/CalendarCheckIcon.tsx';

const NavItem: React.FC<{ screenName: string; label: string; icon: React.ElementType }> = ({ screenName, label, icon: Icon }) => {
    const { screen, setScreen } = useContext(AppContext);
    const isActive = screen === screenName;

    return (
        <li
            onClick={() => setScreen(screenName)}
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                isActive ? 'bg-[#992537] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="w-6 h-6" />
            <span className="mr-4 font-medium">{label}</span>
        </li>
    );
};

const Sidebar: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    return (
        <aside className="w-64 bg-gray-900 flex flex-col p-4 border-l border-gray-700">
            <div className="text-center mb-10 mt-4">
                <h2 className="text-2xl font-bold text-white tracking-wider">
                    معرض بني <span className="text-[#992537]">هاني</span>
                </h2>
                <p className="text-sm text-gray-500">نظام الإدارة</p>
            </div>
            <nav className="flex-1">
                <ul>
                    <NavItem screenName="dashboard" label="لوحة التحكم" icon={DashboardIcon} />
                    <NavItem screenName="inventory" label="إدارة المخزون" icon={CarIcon} />
                    <NavItem screenName="sales" label="سجل المبيعات" icon={DollarSignIcon} />
                    <NavItem screenName="customers" label="إدارة العملاء" icon={UserIcon} />
                    <NavItem screenName="collection" label="تحصيل الأقساط" icon={CalendarCheckIcon} />
                    {currentUser?.role === 'مدير' && (
                        <>
                            <hr className="my-4 border-gray-700" />
                            <NavItem screenName="users" label="إدارة المستخدمين" icon={UsersIcon} />
                            <NavItem screenName="reports" label="التقارير" icon={ChartBarIcon} />
                        </>
                    )}
                </ul>
            </nav>
            <div className="mt-auto text-center text-xs text-gray-600">
                <p>&copy; {new Date().getFullYear()} Bani Hani Showroom</p>
            </div>
        </aside>
    );
};

export default Sidebar;
