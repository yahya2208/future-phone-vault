
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransactionEmailRequest {
  sellerName: string;
  sellerEmail?: string;
  buyerName: string;
  buyerEmail?: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  transactionId: string;
}

const generateEmailTemplate = (transaction: TransactionEmailRequest, isSeller: boolean) => {
  const recipient = isSeller ? transaction.sellerName : transaction.buyerName;
  const role = isSeller ? "البائع" : "المشتري";
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إيصال معاملة الهاتف</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .transaction-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>غزة سايفر</h1>
                <p>إيصال معاملة الهاتف الذكي</p>
            </div>
            <div class="content">
                <h2>مرحباً ${recipient}</h2>
                <p>نود إعلامك بتسجيل معاملة جديدة كـ ${role} في نظام غزة سايفر.</p>
                
                <div class="transaction-details">
                    <h3>تفاصيل المعاملة</h3>
                    <div class="detail-row">
                        <span class="detail-label">رقم المعاملة:</span>
                        <span class="detail-value">${transaction.transactionId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">البائع:</span>
                        <span class="detail-value">${transaction.sellerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">المشتري:</span>
                        <span class="detail-value">${transaction.buyerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">الجهاز:</span>
                        <span class="detail-value">${transaction.brand} ${transaction.phoneModel}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">رقم IMEI:</span>
                        <span class="detail-value">${transaction.imei}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">تاريخ الشراء:</span>
                        <span class="detail-value">${transaction.purchaseDate}</span>
                    </div>
                </div>
                
                <p><strong>مهم:</strong> احتفظ بهذا الإيصال كدليل على المعاملة. يمكن استخدامه في حالة الحاجة للمراجعة أو الاستفسار.</p>
            </div>
            <div class="footer">
                <p>هذا إيصال آلي من نظام غزة سايفر</p>
                <p>للاستفسارات: +213551148943</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const transaction: TransactionEmailRequest = await req.json();
    
    const emailPromises = [];
    
    // إرسال إيميل للبائع
    if (transaction.sellerEmail) {
      emailPromises.push(
        resend.emails.send({
          from: "Gaza Saver <no-reply@resend.dev>",
          to: [transaction.sellerEmail],
          subject: `إيصال معاملة هاتف - ${transaction.brand} ${transaction.phoneModel}`,
          html: generateEmailTemplate(transaction, true),
        })
      );
    }
    
    // إرسال إيميل للمشتري
    if (transaction.buyerEmail) {
      emailPromises.push(
        resend.emails.send({
          from: "Gaza Saver <no-reply@resend.dev>",
          to: [transaction.buyerEmail],
          subject: `إيصال معاملة هاتف - ${transaction.brand} ${transaction.phoneModel}`,
          html: generateEmailTemplate(transaction, false),
        })
      );
    }
    
    const results = await Promise.allSettled(emailPromises);
    
    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent: results.filter(r => r.status === 'fulfilled').length,
      errors: results.filter(r => r.status === 'rejected').map(r => r.reason)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error: any) {
    console.error("Error in send-transaction-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
