
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('OCR function called with image data');

    if (!imageData) {
      console.log('No image data provided');
      return new Response(
        JSON.stringify({ error: 'No image data provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // محاولة استخراج النص من الصورة باستخدام نمط بسيط
    // في الواقع، هذه الوظيفة تحتاج إلى خدمة OCR حقيقية مثل Google Vision API أو Azure Cognitive Services
    console.log('Processing image for OCR...');
    
    // لأغراض التجربة، سنعيد اسم وهمي
    // في التطبيق الحقيقي، يجب استخدام خدمة OCR متقدمة
    const mockResult = {
      name: '', // لا نستطيع استخراج الاسم بدون خدمة OCR حقيقية
      success: false,
      message: 'OCR feature requires external service integration'
    };

    console.log('OCR processing completed:', mockResult);

    return new Response(
      JSON.stringify(mockResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in OCR function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
