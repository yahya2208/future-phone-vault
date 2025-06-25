
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
  rating?: number;
}

const generateEmailTemplate = (transaction: TransactionEmailRequest, isSeller: boolean) => {
  const recipient = isSeller ? transaction.sellerName : transaction.buyerName;
  const role = isSeller ? "البائع" : "المشتري";
  const ratingStars = transaction.rating ? "★".repeat(transaction.rating) + "☆".repeat(5 - transaction.rating) : "لم يتم التقييم";
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إيصال معاملة الهاتف - غزة سايفر</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f5f5f5; 
                direction: rtl;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .transaction-details { 
                background: #f8f9fa; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
            }
            .detail-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 10px 0; 
                padding: 8px 0; 
                border-bottom: 1px solid #eee; 
            }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .rating { color: #ffa500; font-size: 18px; }
            .footer { 
                background: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                color: #666; 
                font-size: 12px; 
            }
            .important-note {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>غزة سايفر</h1>
                <p>نظام تسجيل معاملات الهواتف الذكية</p>
            </div>
            <div class="content">
                <h2>مرحباً ${recipient}</h2>
                <p>نود إعلامك بتسجيل معاملة جديدة كـ <strong>${role}</strong> في نظام غزة سايفر.</p>
                
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
                        <span class="detail-value">${new Date(transaction.purchaseDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">تقييم المعاملة:</span>
                        <span class="detail-value rating">${ratingStars}</span>
                    </div>
                </div>
                
                <div class="important-note">
                    <p><strong>مهم:</strong> احتفظ بهذا الإيصال كدليل على المعاملة. يمكن استخدامه في حالة الحاجة للمراجعة أو الاستفسار.</p>
                </div>
            </div>
            <div class="footer">
                <p>هذا إيصال آلي من نظام غزة سايفر</p>
                <p>للاستفسارات: yahyamanouni@gmail.com</p>
                <p>تم الإرسال في: ${new Date().toLocaleString('ar-EG')}</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Email function called:', req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const transaction: TransactionEmailRequest = await req.json();
    console.log('Transaction data received:', transaction);
    
    // التحقق من وجود بيانات الإيميل
    if (!transaction.sellerEmail && !transaction.buyerEmail) {
      console.log('No email addresses provided');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No email addresses provided'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // التحقق من وجود RESEND_API_KEY
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error('RESEND_API_KEY not found');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email service not configured'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailPromises = [];
    const results = { sent: [], failed: [] };
    
    // إرسال إيميل للبائع
    if (transaction.sellerEmail) {
      console.log('Sending email to seller:', transaction.sellerEmail);
      try {
        const sellerResult = await resend.emails.send({
          from: "Gaza Saver <onboarding@resend.dev>",
          to: [transaction.sellerEmail],
          subject: `إيصال معاملة هاتف - ${transaction.brand} ${transaction.phoneModel}`,
          html: generateEmailTemplate(transaction, true),
        });
        console.log('Seller email sent successfully:', sellerResult);
        results.sent.push({ type: 'seller', email: transaction.sellerEmail, result: sellerResult });
      } catch (error) {
        console.error('Failed to send seller email:', error);
        results.failed.push({ type: 'seller', email: transaction.sellerEmail, error: error.message });
      }
    }
    
    // إرسال إيميل للمشتري
    if (transaction.buyerEmail) {
      console.log('Sending email to buyer:', transaction.buyerEmail);
      try {
        const buyerResult = await resend.emails.send({
          from: "Gaza Saver <onboarding@resend.dev>",
          to: [transaction.buyerEmail],
          subject: `إيصال معاملة هاتف - ${transaction.brand} ${transaction.phoneModel}`,
          html: generateEmailTemplate(transaction, false),
        });
        console.log('Buyer email sent successfully:', buyerResult);
        results.sent.push({ type: 'buyer', email: transaction.buyerEmail, result: buyerResult });
      } catch (error) {
        console.error('Failed to send buyer email:', error);
        results.failed.push({ type: 'buyer', email: transaction.buyerEmail, error: error.message });
      }
    }
    
    const response = {
      success: results.sent.length > 0,
      emailsSent: results.sent.length,
      emailsFailed: results.failed.length,
      details: results
    };
    
    console.log('Final response:', response);
    
    return new Response(JSON.stringify(response), {
      status: results.sent.length > 0 ? 200 : 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error: any) {
    console.error("Error in send-transaction-email function:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
