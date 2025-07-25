-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" 
  ON courses FOR SELECT 
  USING (status = 'published' OR instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses" 
  ON courses FOR INSERT 
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update own courses"
  ON courses FOR UPDATE
  USING (instructor_id = auth.uid());

-- Course modules policies
CREATE POLICY "Modules viewable with course access"
  ON course_modules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_modules.course_id 
    AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
  ));

-- Lessons policies
CREATE POLICY "Lessons viewable with module access"
  ON lessons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM course_modules cm
    JOIN courses c ON c.id = cm.course_id
    WHERE cm.id = lessons.module_id
    AND (c.status = 'published' OR c.instructor_id = auth.uid())
  ));

-- Enrollments policies
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can enroll themselves"
  ON enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Feed policies
CREATE POLICY "Feed channels are viewable by everyone"
  ON feed_channels FOR SELECT
  USING (NOT is_archived);

CREATE POLICY "Official channels only by admins"
  ON feed_channels FOR INSERT
  WITH CHECK (
    (is_official = false) OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Feed posts viewable by everyone"
  ON feed_posts FOR SELECT
  USING (NOT is_draft OR author_id = auth.uid());

CREATE POLICY "Users can create posts in subscribed channels"
  ON feed_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM feed_subscriptions 
      WHERE user_id = auth.uid() AND channel_id = feed_posts.channel_id
    )
  );

CREATE POLICY "Users can update own posts"
  ON feed_posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON feed_posts FOR DELETE
  USING (author_id = auth.uid());

CREATE POLICY "Comments viewable by everyone"
  ON feed_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON feed_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments"
  ON feed_comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Reactions by authenticated users"
  ON feed_reactions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Bookmarks are private"
  ON feed_bookmarks FOR ALL
  USING (user_id = auth.uid()); 