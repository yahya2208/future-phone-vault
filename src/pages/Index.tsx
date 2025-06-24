
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FuturisticHeader from '@/components/FuturisticHeader';
import TransactionForm from '@/components/TransactionForm';
import DashboardStats from '@/components/DashboardStats';
import FooterLinks from '@/components/FooterLinks';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  timestamp: Date;
  rating?: number;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    if (data) {
      const mappedTransactions = data.map(t => ({
        id: t.id,
        sellerName: t.seller_name,
        buyerName: t.buyer_name,
        phoneModel: t.phone_model,
        brand: t.brand,
        imei: t.imei,
        purchaseDate: t.purchase_date,
        timestamp: new Date(t.created_at),
        rating: t.rating
      }));
      setTransactions(mappedTransactions);
    }
  };

  const handleTransactionSave = async (formData: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        seller_name: formData.sellerName,
        seller_email: formData.sellerEmail,
        buyer_name: formData.buyerName,
        buyer_email: formData.buyerEmail,
        phone_model: formData.phoneModel,
        brand: formData.brand,
        imei: formData.imei,
        purchase_date: formData.purchaseDate,
        buyer_id_photo: formData.buyerIdPhoto,
        signature: formData.signature,
        rating: formData.rating
      });

    if (error) {
      console.error('Error saving transaction:', error);
      return;
    }

    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  const averageRating = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + (t.rating || 0), 0) / transactions.length 
    : 0;

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <DashboardStats 
          totalTransactions={totalTransactions}
          topBrand={topBrand}
          recentTransactions={recentTransactions}
          averageRating={averageRating}
        />
        
        <div className="space-y-8">
          <TransactionForm onTransactionSave={handleTransactionSave} />
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Index;
