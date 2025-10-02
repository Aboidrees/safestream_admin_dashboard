-- Insert sample data for development/testing

-- Sample admin permissions structure
INSERT INTO public.admins (user_id, role, permissions, is_active) VALUES
-- This will be populated by the create-admin script
-- Example structure:
-- ('uuid-here', 'super_admin', '{"users": ["read", "write", "delete"], "families": ["read", "write", "delete"], "content": ["read", "write", "delete", "moderate"], "admins": ["read", "write", "delete"]}', true)
ON CONFLICT (user_id) DO NOTHING;

-- Sample content ratings and categories
-- This could be expanded with actual video data
INSERT INTO public.videos (youtube_id, title, description, thumbnail_url, duration, channel_name, content_rating, tags) VALUES
('dQw4w9WgXcQ', 'Sample Educational Video', 'A sample educational video for children', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 212, 'Educational Channel', 'G', ARRAY['education', 'children', 'learning']),
('9bZkp7q19f0', 'Fun Learning Songs', 'Educational songs for kids', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 180, 'Kids Songs Channel', 'G', ARRAY['music', 'education', 'songs'])
ON CONFLICT (youtube_id) DO NOTHING;

-- Insert sample admin permissions
INSERT INTO admins (user_id, role, permissions, is_active) VALUES
-- This will be populated by the create-admin script
-- Example structure:
-- ('user-uuid-here', 'super_admin', '{"users": ["read", "write", "delete"], "content": ["read", "write", "moderate"], "system": ["read", "write", "admin"]}', true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample video categories and age ratings
-- This can be expanded based on your content strategy
INSERT INTO public.videos (youtube_id, title, description, thumbnail_url, duration, channel_name, content_rating, tags) VALUES
('video-id-1', 'Sample Video for Adults', 'A sample video for adult audience', 'https://img.youtube.com/vi/video-id-1/maxresdefault.jpg', 360, 'Adult Channel', 'PG-13', ARRAY['adult', 'entertainment', 'movies']),
('video-id-2', 'Documentary Series', 'Educational documentary series', 'https://img.youtube.com/vi/video-id-2/maxresdefault.jpg', 720, 'Documentary Channel', 'PG', ARRAY['documentary', 'history', 'education'])
ON CONFLICT (youtube_id) DO NOTHING;

-- Create function to generate secure admin tokens
CREATE OR REPLACE FUNCTION public.generate_admin_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify admin access
CREATE OR REPLACE FUNCTION public.verify_admin_access(user_uuid UUID)
RETURNS TABLE(
  admin_id UUID,
  role TEXT,
  permissions JSONB,
  is_active BOOLEAN,
  token_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.role,
    a.permissions,
    a.is_active,
    CASE 
      WHEN a.token_expires_at IS NULL THEN true
      WHEN a.token_expires_at > NOW() THEN true
      ELSE false
    END as token_valid
  FROM public.admins a
  WHERE a.user_id = user_uuid 
    AND a.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update admin last login
CREATE OR REPLACE FUNCTION public.update_admin_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.admins 
  SET 
    last_login = NOW(),
    session_token = public.generate_admin_token(),
    token_expires_at = NOW() + INTERVAL '30 days'
  WHERE user_id = user_uuid AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
