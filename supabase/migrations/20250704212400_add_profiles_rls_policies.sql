-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
        )
    );

CREATE POLICY "Admins can insert any profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
        )
    );

CREATE POLICY "Admins can delete any profile"
    ON public.profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('yahyamanouni2@gmail.com', 'y220890@gmail.com')
        )
    );
