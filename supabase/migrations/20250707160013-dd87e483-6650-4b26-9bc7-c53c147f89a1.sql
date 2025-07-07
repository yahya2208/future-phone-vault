-- إصلاح صلاحيات رفع الصور للملفات الشخصية
-- تحديث صلاحيات bucket avatars
DELETE FROM storage.objects WHERE bucket_id = 'avatars';

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- إنشاء سياسات جديدة أكثر مرونة
CREATE POLICY "Public avatar access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatar upload for authenticated users" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Avatar update for authenticated users" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  ) WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Avatar delete for authenticated users" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- إصلاح صلاحيات عرض المستخدمين للإدارة
-- حذف السياسات القديمة المتضاربة
DROP POLICY IF EXISTS "Allow admin to read" ON profiles;
DROP POLICY IF EXISTS "Allow admin to update" ON profiles;
DROP POLICY IF EXISTS "Allow self to read" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- إنشاء سياسات جديدة واضحة
-- المستخدمون يمكنهم رؤية وتعديل ملفهم الشخصي
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- الإدارة يمكنها رؤية جميع الملفات الشخصية
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- الإدارة يمكنها تعديل جميع الملفات الشخصية
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.is_admin = true
    )
  );