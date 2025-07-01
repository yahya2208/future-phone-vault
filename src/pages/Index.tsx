
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FuturisticHeader from '@/components/FuturisticHeader';
import TransactionForm from '@/components/TransactionForm';
import DashboardStats from '@/components/DashboardStats';
import FooterLinks from '@/components/FooterLinks';
import PrivacyNotification from '@/components/PrivacyNotification';
import TrialNotification from '@/components/TrialNotification';
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
  customPhoneModel?: string;
}

interface UserProfile {
  subscription_status: string;
  trial_transactions_used: number;
  max_trial_transactions: number;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    subscription_status: 'trial',
    trial_transactions_used: 0,
    max_trial_transactions: 3
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      // حساب المعاملات المستخدمة من جدول المعاملات
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      // حساب المعاملات المستخدمة
      const transactionCount = data?.length || 0;
      
      setUserProfile({
        subscription_status: 'trial',
        trial_transactions_used: transactionCount,
        max_trial_transactions: 3
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        rating: t.rating,
        customPhoneModel: t.phone_model // استخدام phone_model كبديل
      }));
      setTransactions(mappedTransactions);
    }
  };

  const handleTransactionSave = async (formData: any) => {
    if (!user) return;

    if (userProfile.subscription_status === 'trial' && userProfile.trial_transactions_used >= userProfile.max_trial_transactions) {
      console.log('Trial limit reached');
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        seller_name: formData.sellerName,
        buyer_name: formData.buyerName,
        phone_model: formData.customPhoneModel || formData.phoneModel,
        brand: formData.brand,
        imei: formData.imei,
        purchase_date: formData.purchaseDate,
        rating: formData.rating
      });

    if (error) {
      console.error('Error saving transaction:', error);
      return;
    }

    fetchUserProfile();
    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
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
      <PrivacyNotification />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <TrialNotification 
          transactionsUsed={userProfile.trial_transactions_used}
          maxTransactions={userProfile.max_trial_transactions}
        />
        
        <DashboardStats 
          totalTransactions={totalTransactions}
          topBrand={topBrand}
          recentTransactions={recentTransactions}
          averageRating={averageRating}
        />
        
        <div className="space-y-8">
          <TransactionForm 
            onTransactionSave={handleTransactionSave}
            transactionsUsed={userProfile.trial_transactions_used}
            maxTransactions={userProfile.max_trial_transactions}
          />
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Index;
