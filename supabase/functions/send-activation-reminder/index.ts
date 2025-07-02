import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { user_id, user_email } = await req.json();

    // التحقق من أن المستخدم ليس أدمن وأن فترته التجريبية انتهت
    if (user_email === 'yahyamanouni2@gmail.com') {
      return new Response(JSON.stringify({ message: "Admin user, no reminder needed" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // فحص عدد المعاملات
    const { data: transactions } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', user_id);

    const transactionCount = transactions?.length || 0;

    if (transactionCount >= 3) {
      // إرسال إيميل تذكير
      const emailResponse = await resend.emails.send({
        from: "Phone Vault <noreply@app.com>",
        to: [user_email],
        subject: "انتهت فترتك التجريبية - فعل حسابك الآن",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e11d48; text-align: center;">انتهت فترتك التجريبية</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              مرحباً،<br><br>
              لقد انتهت فترتك التجريبية في تطبيق Phone Vault. لقد استخدمت ${transactionCount} معاملات من أصل 3 معاملات مجانية.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              للمتابعة في استخدام التطبيق، يرجى التواصل مع الأدمن للحصول على كود التفعيل على الرقم التالي:
            </p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 18px; color: #1f2937;">+213676070165</strong>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #666;">
              يمكنك شراء كود التفعيل من خلال التواصل مع المطور على الرقم أعلاه.
            </p>
            <p style="font-size: 14px; color: #666;">
              شكراً لاستخدامك Phone Vault<br>
              فريق التطوير
            </p>
          </div>
        `,
      });

      console.log("Activation reminder email sent:", emailResponse);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("Error in send-activation-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);