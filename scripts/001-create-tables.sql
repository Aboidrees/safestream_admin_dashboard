-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table for platform administration
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Families table
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child profiles table
CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  avatar_url TEXT,
  content_restrictions JSONB DEFAULT '{}',
  screen_time_limits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  channel_name TEXT,
  age_rating TEXT,
  tags TEXT[],
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection videos junction table
CREATE TABLE IF NOT EXISTS collection_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, video_id)
);

-- Watch history table
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_families_created_by ON families(created_by);
CREATE INDEX IF NOT EXISTS idx_child_profiles_family_id ON child_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_by ON collections(created_by);
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_collection_videos_collection_id ON collection_videos(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_videos_video_id ON collection_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_child_profile_id ON watch_history(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_video_id ON watch_history(video_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_profiles_updated_at BEFORE UPDATE ON child_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
