
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { transaction } = await req.json();
    
    // Validate purchase date
    const purchaseDate = new Date(transaction.purchase_date);
    const today = new Date();
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    purchaseDate.setHours(0, 0, 0, 0);
    
    if (purchaseDate < today) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'لا يمكن إنشاء معاملة بتاريخ سابق لليوم الحالي'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Additional validation for future dates (optional)
    const maxFutureDate = new Date(today);
    maxFutureDate.setDate(maxFutureDate.getDate() + 30);
    
    if (purchaseDate > maxFutureDate) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'لا يمكن إنشاء معاملة بتاريخ أكثر من 30 يوم في المستقبل'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Transaction date is valid'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
