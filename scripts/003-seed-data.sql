-- Insert default subscription plans
INSERT INTO public.plans (id, name, description, price, interval, max_profiles, max_collections, features, is_active) VALUES
  (
    uuid_generate_v4(),
    'Free',
    'Perfect for trying out SafeStream with basic features',
    0.00,
    'month',
    2,
    3,
    '["Basic content filtering", "2 child profiles", "3 collections", "Standard support"]'::jsonb,
    true
  ),
  (
    uuid_generate_v4(),
    'Family',
    'Great for families with multiple children and extensive content needs',
    9.99,
    'month',
    5,
    20,
    '["Advanced content filtering", "5 child profiles", "20 collections", "Time controls", "Watch history", "Priority support"]'::jsonb,
    true
  ),
  (
    uuid_generate_v4(),
    'Premium',
    'Ultimate family experience with unlimited access and premium features',
    19.99,
    'month',
    10,
    -1,
    '["All Family features", "10 child profiles", "Unlimited collections", "Advanced analytics", "Custom content ratings", "24/7 support"]'::jsonb,
    true
  );

-- Insert sample API credentials (you'll need to update these with real values)
INSERT INTO public.api_credentials (service_name, api_key) VALUES
  ('youtube', 'your-youtube-api-key-here'),
  ('content_filter', 'your-content-filter-api-key-here')
ON CONFLICT (service_name) DO NOTHING;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to generate unique login codes for child profiles
CREATE OR REPLACE FUNCTION generate_login_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate a 6-digit code
    code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_check 
    FROM public.profiles 
    WHERE login_code = code;
    
    -- If code doesn't exist, return it
    IF exists_check = 0 THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
