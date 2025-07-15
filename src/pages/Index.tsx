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
  is_admin?: boolean;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    subscription_status: 'trial',
    trial_transactions_used: 0,
    max_trial_transactions: 3,
    is_admin: false
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
      checkTrialStatus();
    }
  }, [user]);

  const checkTrialStatus = async () => {
    if (!user || user.email === 'yahyamanouni2@gmail.com') return;
    
    try {
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', user.id);

      const transactionCount = transactionsData?.length || 0;
      
      if (transactionCount >= 3) {
        console.log('Sending activation reminder for user:', user.email);
        const response = await supabase.functions.invoke('send-activation-reminder', {
          body: {
            user_id: user.id,
            user_email: user.email
          }
        });
        console.log('Activation reminder response:', response);
      }
    } catch (error) {
      console.log('Error sending activation reminder:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      // Use maybeSingle() instead of single() to handle cases where profile doesn't exist
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // If no profile exists, create one using an Edge Function
      if (!profileData) {
        try {
          const { error: functionError } = await supabase.functions.invoke('create-user-profile', {
            body: {
              user_id: user.id,
              email: user.email,
              username: user.email?.split('@')[0] || 'user_' + Math.random().toString(36).substring(2, 11)
            }
          });
          
          if (functionError) {
            console.error('Error invoking create-user-profile function:', functionError);
          }
        } catch (error) {
          console.error('Error in create-user-profile function call:', error);
        }
      }

      // Check admin status (default to false if no profile data)
      const isAdmin = (profileData?.is_admin || user.email === 'yahyamanouni2@gmail.com') ?? false;
      
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', user.id);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        return;
      }

      const transactionCount = transactionsData?.length || 0;
      
      if (isAdmin) {
        console.log('Admin user detected, setting unlimited transactions');
        setUserProfile({
          subscription_status: 'active',
          trial_transactions_used: 0,
          max_trial_transactions: 999999,
          is_admin: true
        });
      } else {
        setUserProfile({
          subscription_status: 'trial',
          trial_transactions_used: transactionCount,
          max_trial_transactions: 3,
          is_admin: false
        });
      }

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
        customPhoneModel: t.phone_model
      }));
      setTransactions(mappedTransactions);
    }
  };

  const handleTransactionSave = async (formData: any) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    console.log('Current user ID:', user.id);
    
    // Map the form data to the database format
    const dbFormData = {
      sellerName: formData.seller_name,
      buyerName: formData.buyer_name,
      phoneModel: formData.phone_model,
      brand: formData.brand,
      imei: formData.imei,
      purchaseDate: formData.purchase_date,
      rating: formData.rating,
      customPhoneModel: formData.phone_model
    };
    
    // Log the form data being saved
    console.log('Saving transaction with data:', {
      user_id: user.id,
      seller_name: formData.seller_name,
      buyer_name: formData.buyer_name,
      phone_model: formData.phone_model,
      brand: formData.brand,
      imei: formData.imei,
      purchase_date: formData.purchase_date,
      rating: formData.rating
    });

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          seller_name: formData.seller_name,
          seller_phone: formData.seller_phone,
          seller_email: formData.seller_email,
          buyer_name: formData.buyer_name,
          buyer_email: formData.buyer_email,
          phone_model: formData.phone_model,
          brand: formData.brand,
          imei: formData.imei,
          purchase_date: formData.purchase_date,
          rating: formData.rating,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Transaction saved successfully:', data);
      fetchUserProfile();
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error; // Re-throw so the TransactionForm can handle the error
    }
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
        
        {/* Only show trial notification for non-admin users */}
        {!userProfile.is_admin && (
          <TrialNotification 
            transactionsUsed={userProfile.trial_transactions_used}
            maxTransactions={userProfile.max_trial_transactions}
          />
        )}
        
        <DashboardStats 
          totalTransactions={totalTransactions}
          topBrand={topBrand}
          recentTransactions={recentTransactions}
          averageRating={averageRating}
        />
        
        <div className="space-y-8">
          <TransactionForm 
            onTransactionSave={handleTransactionSave}
            isLimitReached={userProfile.trial_transactions_used >= userProfile.max_trial_transactions}
          />
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Index;
