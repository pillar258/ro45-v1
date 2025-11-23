-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT event_registrations_unique UNIQUE (event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" ON public.event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registrations" ON public.event_registrations
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON public.event_registrations TO anon;
GRANT SELECT, INSERT, DELETE ON public.event_registrations TO authenticated;