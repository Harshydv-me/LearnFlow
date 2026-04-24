BEGIN;

INSERT INTO skills (name, description)
VALUES ('Web Development', 'Learn the fundamentals of web development.')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- TOPIC 1: HTML Fundamentals
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Web Development'),
  'HTML Fundamentals',
  'Build solid HTML foundations.',
  1
)
ON CONFLICT DO NOTHING;

-- TOPIC 2: CSS Fundamentals
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Web Development'),
  'CSS Fundamentals',
  'Style and layout basics.',
  2
)
ON CONFLICT DO NOTHING;

-- TOPIC 3: JavaScript Basics
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Web Development'),
  'JavaScript Basics',
  'Programming essentials.',
  3
)
ON CONFLICT DO NOTHING;

-- TOPIC 4: JavaScript Advanced
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Web Development'),
  'JavaScript Advanced',
  'Deeper JavaScript concepts.',
  4
)
ON CONFLICT DO NOTHING;

-- TOPIC 5: React Fundamentals
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Web Development'),
  'React Fundamentals',
  'Build UI with React.',
  5
)
ON CONFLICT DO NOTHING;

-- HTML Fundamentals tasks
INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'HTML Fundamentals'), 'Understand HTML structure', 'Learn how HTML documents are structured', 1),
((SELECT id FROM topics WHERE title = 'HTML Fundamentals'), 'Learn common HTML tags', 'Study tags like div, span, h1-h6, p, img, a', 2),
((SELECT id FROM topics WHERE title = 'HTML Fundamentals'), 'Forms and Inputs', 'Build forms with input, textarea, select, button', 3),
((SELECT id FROM topics WHERE title = 'HTML Fundamentals'), 'Semantic HTML', 'Use header, nav, main, section, article, footer', 4),
((SELECT id FROM topics WHERE title = 'HTML Fundamentals'), 'Mini Project', 'Build a simple webpage using only HTML', 5)
ON CONFLICT DO NOTHING;

-- CSS Fundamentals tasks
INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'CSS Fundamentals'), 'Box Model', 'Understand margin, border, padding, content', 1),
((SELECT id FROM topics WHERE title = 'CSS Fundamentals'), 'Flexbox', 'Master flex container and flex items', 2),
((SELECT id FROM topics WHERE title = 'CSS Fundamentals'), 'CSS Grid', 'Build layouts with grid-template-columns and rows', 3),
((SELECT id FROM topics WHERE title = 'CSS Fundamentals'), 'Responsive Design', 'Use media queries and mobile-first approach', 4),
((SELECT id FROM topics WHERE title = 'CSS Fundamentals'), 'Mini Project', 'Build a responsive landing page', 5)
ON CONFLICT DO NOTHING;

-- JavaScript Basics tasks
INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'JavaScript Basics'), 'Variables and Data Types', 'var, let, const, strings, numbers, booleans', 1),
((SELECT id FROM topics WHERE title = 'JavaScript Basics'), 'Functions and Scope', 'Function declarations, expressions, closures', 2),
((SELECT id FROM topics WHERE title = 'JavaScript Basics'), 'Arrays and Objects', 'Methods, destructuring, spread operator', 3),
((SELECT id FROM topics WHERE title = 'JavaScript Basics'), 'DOM Manipulation', 'querySelector, addEventListener, innerHTML', 4),
((SELECT id FROM topics WHERE title = 'JavaScript Basics'), 'Mini Project', 'Build an interactive to-do list', 5)
ON CONFLICT DO NOTHING;

-- JavaScript Advanced tasks
INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'JavaScript Advanced'), 'Async JavaScript', 'Callbacks, Promises, async/await', 1),
((SELECT id FROM topics WHERE title = 'JavaScript Advanced'), 'Fetch API', 'GET and POST requests, error handling', 2),
((SELECT id FROM topics WHERE title = 'JavaScript Advanced'), 'ES6+ Features', 'Arrow functions, modules, template literals', 3),
((SELECT id FROM topics WHERE title = 'JavaScript Advanced'), 'Error Handling', 'try/catch, custom errors', 4),
((SELECT id FROM topics WHERE title = 'JavaScript Advanced'), 'Mini Project', 'Build a weather app using a public API', 5)
ON CONFLICT DO NOTHING;

-- React Fundamentals tasks
INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'React Fundamentals'), 'JSX and Components', 'Functional components, JSX syntax', 1),
((SELECT id FROM topics WHERE title = 'React Fundamentals'), 'Props and State', 'useState, passing props, component communication', 2),
((SELECT id FROM topics WHERE title = 'React Fundamentals'), 'useEffect', 'Side effects, data fetching, cleanup', 3),
((SELECT id FROM topics WHERE title = 'React Fundamentals'), 'React Router', 'BrowserRouter, Routes, Route, Link', 4),
((SELECT id FROM topics WHERE title = 'React Fundamentals'), 'Mini Project', 'Build a multi-page React app', 5)
ON CONFLICT DO NOTHING;

COMMIT;
