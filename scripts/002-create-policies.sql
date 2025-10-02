-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Plans policies (public read access)
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

-- Admins policies (only admins can access)
CREATE POLICY "Admins can view admin records" ON public.admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert admin records" ON public.admins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    ) OR NOT EXISTS (
      SELECT 1 FROM public.admins
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Profiles policies (child profiles)
CREATE POLICY "Parents can manage their children's profiles" ON public.profiles
  FOR ALL USING (auth.uid() = parent_id);

-- Collections policies
CREATE POLICY "Users can view collections they created" ON public.collections
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view collections assigned to their children" ON public.collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profile_collections pc
      JOIN public.profiles p ON pc.profile_id = p.id
      WHERE pc.collection_id = collections.id 
      AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own collections" ON public.collections
  FOR ALL USING (auth.uid() = created_by);

-- Videos policies
CREATE POLICY "Users can view videos in their collections" ON public.videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections c
      WHERE c.id = videos.collection_id 
      AND c.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view videos assigned to their children" ON public.videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profile_collections pc
      JOIN public.profiles p ON pc.profile_id = p.id
      JOIN public.collections c ON pc.collection_id = c.id
      WHERE c.id = videos.collection_id 
      AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage videos in their collections" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections c
      WHERE c.id = videos.collection_id 
      AND c.created_by = auth.uid()
    )
  );

-- Profile collections policies
CREATE POLICY "Parents can manage their children's collection assignments" ON public.profile_collections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_collections.profile_id 
      AND p.parent_id = auth.uid()
    )
  );

-- Watch history policies
CREATE POLICY "Parents can view their children's watch history" ON public.watch_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = watch_history.profile_id 
      AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can insert watch history" ON public.watch_history
  FOR INSERT WITH CHECK (true);

-- Time controls policies
CREATE POLICY "Parents can manage their children's time controls" ON public.time_controls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = time_controls.profile_id 
      AND p.parent_id = auth.uid()
    )
  );

-- API credentials policies (admin only)
CREATE POLICY "Only admins can manage API credentials" ON public.api_credentials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
