
-- حذف الحقول التي قد تسبب مشاكل قانونية من جدول المعاملات
ALTER TABLE public.transactions 
DROP COLUMN IF EXISTS buyer_id_photo,
DROP COLUMN IF EXISTS signature;

-- إضافة حقل بديل للرسم البسيط (ليس توقيعاً قانونياً)
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS simple_drawing text;

-- تحديث التعليقات للوضوح
COMMENT ON COLUMN public.transactions.simple_drawing IS 'رسم بسيط للتذكر فقط - ليس توقيعاً قانونياً';
COMMENT ON TABLE public.transactions IS 'جدول لحفظ معلومات المعاملات الشخصية - للتوثيق الشخصي فقط وليس للاستخدام القانوني';
