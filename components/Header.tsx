// Fix: Provide full content for Header.tsx
import React, { useContext } from 'react';
// Fix: Add .tsx extension to fix module resolution error.
import { AppContext } from '../App.tsx';
// Fix: Add .tsx extension to fix module resolution error.
import Button from './Button.tsx';

const Header: React.FC = () => {
  const { currentUser, logout, screen } = useContext(AppContext);
  
  const getScreenTitle = () => {
    const titles: { [key: string]: string } = {
        'dashboard': 'لوحة التحكم',
        'inventory': 'إدارة المخزون',
        'sales': 'سجل المبيعات',
        'new-sale': 'عملية بيع جديدة',
        'customers': 'إدارة العملاء',
        'users': 'إدارة المستخدمين',
        'reports': 'التقارير',
        'collection': 'تحصيل الأقساط',
    };
    if (screen.startsWith('customer-detail-')) {
        return 'تفاصيل العميل';
    }
    return titles[screen] || 'لوحة التحكم';
  }

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
      <h1 className="text-xl font-semibold text-gray-200">{getScreenTitle()}</h1>
      <div className="flex items-center">
        <div className="text-left ml-4">
          <p className="font-semibold text-white">{currentUser?.name}</p>
          <p className="text-sm text-gray-400">{currentUser?.role}</p>
        </div>
        <Button onClick={logout} variant="secondary">
          تسجيل الخروج
        </Button>
      </div>
    </header>
  );
};

export default Header;
