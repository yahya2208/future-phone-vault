
-- حذف السياسات المتضاربة الحالية
DROP POLICY IF EXISTS "Allow all for admins on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all to view profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- إنشاء دالة آمنة للتحقق من صلاحيات الإدارة
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
  );
$$;

-- إنشاء سياسات جديدة آمنة
-- المستخدمون يمكنهم رؤية ملفهم الشخصي
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- المستخدمون يمكنهم تعديل ملفهم الشخصي
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- المستخدمون يمكنهم إنشاء ملفهم الشخصي
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- الإدارة يمكنها رؤية جميع الملفات الشخصية
CREATE POLICY "Admins can view all profiles safe" ON profiles
  FOR SELECT USING (public.is_admin_safe());

-- الإدارة يمكنها تعديل جميع الملفات الشخصية
CREATE POLICY "Admins can update all profiles safe" ON profiles
  FOR UPDATE USING (public.is_admin_safe());

-- الإدارة يمكنها إنشاء ملفات شخصية
CREATE POLICY "Admins can insert profiles safe" ON profiles
  FOR INSERT WITH CHECK (public.is_admin_safe());

-- الإدارة يمكنها حذف الملفات الشخصية
CREATE POLICY "Admins can delete profiles safe" ON profiles
  FOR DELETE USING (public.is_admin_safe());
