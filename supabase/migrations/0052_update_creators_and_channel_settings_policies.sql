-- Update creators policies
DROP POLICY IF EXISTS "Enable creator access" ON creators;

CREATE POLICY "Enable creator access"
  ON creators
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update channel settings policies
DROP POLICY IF EXISTS "Enable channel settings access" ON channel_settings;

CREATE POLICY "Enable channel settings access"
  ON channel_settings
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = channel_settings.creator_id
      AND creators.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = channel_settings.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Update channels policies
DROP POLICY IF EXISTS "Enable channel access" ON channels;

CREATE POLICY "Enable channel access"
  ON channels
  TO authenticated
  USING (
    creator_id IS NULL -- Public channels
    OR EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = channels.creator_id
      AND creators.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = channels.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Create a view for creator channels
CREATE OR REPLACE VIEW creator_channels AS
SELECT c.*
FROM channels c
JOIN creators cr ON c.creator_id = cr.id
WHERE cr.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON creator_channels TO authenticated;