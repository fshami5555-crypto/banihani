// Fix: Provide full content for App.tsx, including state management, AppContext, screen rendering logic, and initial data.
import React, { useState, createContext } from 'react';
// Fix: Add .ts extension to type imports.
import type { User, Car, Sale, Customer, InstallmentPlan, Payment } from './types.ts';
import { Role, CustomerType, PaymentMethod, PaymentStatus } from './types.ts';

// Screens
// Fix: Add .tsx extension to component imports.
import LoginScreen from './screens/LoginScreen.tsx';
import DashboardScreen from './screens/DashboardScreen.tsx';
import InventoryScreen from './screens/InventoryScreen.tsx';
import SalesScreen from './screens/SalesScreen.tsx';
import NewSaleScreen from './screens/NewSaleScreen.tsx';
import CustomersScreen from './screens/CustomersScreen.tsx';
import CustomerDetailScreen from './screens/CustomerDetailScreen.tsx';
import UsersScreen from './screens/UsersScreen.tsx';
import ReportsScreen from './screens/ReportsScreen.tsx';
import CollectionScreen from './screens/CollectionScreen.tsx';

// Components
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';

// Initial Data
const initialUsers: User[] = [
    { id: 1, name: 'أحمد محمود', email: 'admin@example.com', role: Role.Admin },
    { id: 2, name: 'فاطمة علي', email: 'sales@example.com', role: Role.Salesperson },
];

const initialCars: Car[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 25000, vin: '123ABC456DEF', status: 'Available', imageUrl: 'https://picsum.photos/seed/123ABC456DEF/300/200' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2023, price: 23000, vin: '789GHI012JKL', status: 'Available', imageUrl: 'https://picsum.photos/seed/789GHI012JKL/300/200' },
    { id: 3, make: 'Ford', model: 'Mustang', year: 2021, price: 45000, vin: '345MNO678PQR', status: 'Sold', imageUrl: 'https://picsum.photos/seed/345MNO678PQR/300/200' },
];

const initialCustomers: Customer[] = [
    { id: 1, name: 'خالد سعيد', phone: '0791234567', email: 'khalid@email.com', address: 'عمان, الأردن', customerType: CustomerType.Cash },
    { id: 2, name: 'ليلى رضا', phone: '0781234567', email: 'laila@email.com', address: 'الزرقاء, الأردن', customerType: CustomerType.Installment, nationalId: '9901234567', birthDate: '1990-05-15', maritalStatus: 'متزوج', incomeSource: 'راتب شهري', fixedIncome: 800, socialSecuritySubscriptions: 60 },
];

const initialSales: Sale[] = [
    { id: 1, carId: 3, customerId: 1, salespersonId: 2, saleDate: '2023-10-15T10:00:00Z', salePrice: 44500, paymentMethod: PaymentMethod.Cash },
];

const initialInstallmentPlans: InstallmentPlan[] = [];


type AppContextType = {
    currentUser: User | null;
    users: User[];
    cars: Car[];
    sales: Sale[];
    customers: Customer[];
    installmentPlans: InstallmentPlan[];
    screen: string;
    login: (user: User) => void;
    logout: () => void;
    setScreen: (screen: string) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    addCar: (car: Omit<Car, 'id'>) => void;
    addCustomer: (customer: Omit<Customer, 'id'>) => void;
    addSale: (sale: Omit<Sale, 'id'>) => Sale;
    addInstallmentPlan: (plan: Omit<InstallmentPlan, 'id'>) => void;
    updatePaymentStatus: (planId: number, paymentId: number, status: PaymentStatus) => void;
};

export const AppContext = createContext<AppContextType>(null!);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState('dashboard');
  
  // App Data State
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(initialInstallmentPlans);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    setScreen('dashboard');
  };

  const addUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: Date.now() }]);
  };

  const addCar = (car: Omit<Car, 'id'>) => {
    setCars(prev => [...prev, { ...car, id: Date.now() }]);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: Date.now() }]);
  };

  const addSale = (sale: Omit<Sale, 'id'>): Sale => {
    const newSale = { ...sale, id: Date.now() };
    setSales(prev => [...prev, newSale]);
    setCars(prev => prev.map(car => car.id === sale.carId ? { ...car, status: 'Sold' as 'Sold' } : car));
    return newSale;
  };
  
  const addInstallmentPlan = (plan: Omit<InstallmentPlan, 'id'>) => {
    setInstallmentPlans(prev => [...prev, { ...plan, id: Date.now() }]);
  };
  
  const updatePaymentStatus = (planId: number, paymentId: number, status: PaymentStatus) => {
    setInstallmentPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId) {
        const updatedPayments = plan.payments.map(p => 
          p.id === paymentId ? { ...p, status, paymentDate: new Date().toISOString() } : p
        );
        return { ...plan, payments: updatedPayments };
      }
      return plan;
    }));
  };

  const renderScreen = () => {
    if (screen.startsWith('customer-detail-')) {
        const customerId = parseInt(screen.split('-')[2]);
        return <CustomerDetailScreen customerId={customerId} />;
    }
    switch (screen) {
        case 'dashboard': return <DashboardScreen />;
        case 'inventory': return <InventoryScreen />;
        case 'sales': return <SalesScreen />;
        case 'new-sale': return <NewSaleScreen />;
        case 'customers': return <CustomersScreen />;
        case 'users': return <UsersScreen />;
        case 'reports': return <ReportsScreen />;
        case 'collection': return <CollectionScreen />;
        default: return <DashboardScreen />;
    }
  }

  if (!currentUser) {
    return <LoginScreen onLogin={login} users={users} />;
  }

  return (
    <AppContext.Provider value={{ currentUser, users, cars, sales, customers, installmentPlans, screen, login, logout, setScreen, addUser, addCar, addCustomer, addSale, addInstallmentPlan, updatePaymentStatus }}>
      <div className="flex h-screen bg-gray-800 text-gray-200" dir="rtl">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
            {renderScreen()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
