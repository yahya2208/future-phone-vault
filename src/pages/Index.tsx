
import React, { useState, useEffect } from 'react';
import FuturisticHeader from '@/components/FuturisticHeader';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import DashboardStats from '@/components/DashboardStats';

interface Transaction {
  id: string;
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  timestamp: Date;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('phone-transactions');
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      setTransactions(parsed.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('phone-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleTransactionSave = (formData: any) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Calculate stats
  const totalTransactions = transactions.length;
  const brandCounts = transactions.reduce((acc, t) => {
    acc[t.brand] = (acc[t.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topBrand = Object.keys(brandCounts).reduce((a, b) => 
    brandCounts[a] > brandCounts[b] ? a : b, ''
  );

  const today = new Date().toISOString().split('T')[0];
  const recentTransactions = transactions.filter(t => 
    t.purchaseDate === today
  ).length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <DashboardStats 
          totalTransactions={totalTransactions}
          topBrand={topBrand}
          recentTransactions={recentTransactions}
        />
        
        <div className="space-y-8">
          <TransactionForm onTransactionSave={handleTransactionSave} />
          <TransactionHistory transactions={transactions} />
        </div>
        
        {/* Neural footer */}
        <footer className="mt-16 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-4"></div>
          <p className="text-muted-foreground text-sm">
            Quantum Store Management System v2060.1 • Neural Interface Active
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
