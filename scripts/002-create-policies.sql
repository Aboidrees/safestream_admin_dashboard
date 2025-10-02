-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins policies (only admins can access)
CREATE POLICY "Only admins can view admin records" ON admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

CREATE POLICY "Only super admins can modify admin records" ON admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.role = 'super_admin' AND a.is_active = true
    )
  );

-- Families policies
CREATE POLICY "Users can view their own families" ON families
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create families" ON families
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own families" ON families
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own families" ON families
  FOR DELETE USING (created_by = auth.uid());

-- Child profiles policies
CREATE POLICY "Users can view child profiles in their families" ON child_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM families f 
      WHERE f.id = child_profiles.family_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create child profiles in their families" ON child_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM families f 
      WHERE f.id = child_profiles.family_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update child profiles in their families" ON child_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM families f 
      WHERE f.id = child_profiles.family_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete child profiles in their families" ON child_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM families f 
      WHERE f.id = child_profiles.family_id AND f.created_by = auth.uid()
    )
  );

-- Collections policies
CREATE POLICY "Users can view public collections" ON collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own collections" ON collections
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create collections" ON collections
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own collections" ON collections
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own collections" ON collections
  FOR DELETE USING (created_by = auth.uid());

-- Videos policies (read-only for users, admins can manage)
CREATE POLICY "Anyone can view approved videos" ON videos
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can view all videos" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

CREATE POLICY "Admins can manage videos" ON videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

-- Collection videos policies
CREATE POLICY "Users can view collection videos for public collections" ON collection_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections c 
      WHERE c.id = collection_videos.collection_id AND c.is_public = true
    )
  );

CREATE POLICY "Users can view collection videos for their own collections" ON collection_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections c 
      WHERE c.id = collection_videos.collection_id AND c.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage collection videos for their own collections" ON collection_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM collections c 
      WHERE c.id = collection_videos.collection_id AND c.created_by = auth.uid()
    )
  );

-- Watch history policies
CREATE POLICY "Users can view watch history for their child profiles" ON watch_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM child_profiles cp
      JOIN families f ON f.id = cp.family_id
      WHERE cp.id = watch_history.child_profile_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create watch history for their child profiles" ON watch_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM child_profiles cp
      JOIN families f ON f.id = cp.family_id
      WHERE cp.id = watch_history.child_profile_id AND f.created_by = auth.uid()
    )
  );
