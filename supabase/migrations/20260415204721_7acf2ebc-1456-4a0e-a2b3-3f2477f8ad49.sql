
-- Drop the restrictive select policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow all authenticated users to read profiles (only public info like name/role)
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
