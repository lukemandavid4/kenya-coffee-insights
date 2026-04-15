
-- Allow all authenticated users to view all harvests
CREATE POLICY "Authenticated users can view all harvests"
ON public.harvests
FOR SELECT
TO authenticated
USING (true);
