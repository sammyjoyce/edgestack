-- Seed initial content
INSERT OR REPLACE INTO content (key, page, section, type, value, sort_order) VALUES
-- Hero Section
('hero_title', 'home', 'hero', 'text', 'Big Impact for Modern Brands', 1),
('hero_subtitle', 'home', 'hero', 'text', 'Delivering high-quality solutions since 2010.', 2),
('hero_image', 'home', 'hero', 'image', '/assets/hero-image.jpg', 3),

-- Services Section
('services_intro_title', 'home', 'services', 'text', 'Our Services', 1),
('services_intro_text', 'home', 'services', 'text', 'We offer a variety of services to help your business grow.', 2),
('service_1_title', 'home', 'services', 'text', 'Design', 3),
('service_1_text', 'home', 'services', 'text', 'Creative designs tailored to your brand.', 4),
('service_1_image', 'home', 'services', 'image', '/assets/service-design.jpg', 5),
('service_2_title', 'home', 'services', 'text', 'Development', 6),
('service_2_text', 'home', 'services', 'text', 'Robust solutions built with the latest technologies.', 7),
('service_2_image', 'home', 'services', 'image', '/assets/service-development.jpg', 8),
('service_3_title', 'home', 'services', 'text', 'Marketing', 9),
('service_3_text', 'home', 'services', 'text', 'Strategies that connect you with your audience.', 10),
('service_3_image', 'home', 'services', 'image', '/assets/service-marketing.jpg', 11),
('service_4_title', 'home', 'services', 'text', 'Support', 12),
('service_4_text', 'home', 'services', 'text', 'Reliable support to keep things running smoothly.', 13),
('service_4_image', 'home', 'services', 'image', '/assets/service-support.jpg', 14),

-- About Section
('about_title', 'home', 'about', 'text', 'About Us', 1),
('about_text', 'home', 'about', 'text', 'Our team delivers results with a focus on quality and clear communication.', 2),
('about_image', 'home', 'about', 'image', '/assets/about-image.jpg', 3),

-- Contact Section
('contact_phone', 'home', 'contact', 'text', '000-000-0000', 1),
('contact_email', 'home', 'contact', 'text', 'info@example.com', 2),
('contact_address', 'home', 'contact', 'text', 'Example City, XX', 3),

-- Projects Section
('projects_intro_title', 'projects', 'intro', 'text', 'Featured Projects', 1),
('projects_intro_text', 'projects', 'intro', 'text', 'Browse a few examples of what we can create together.', 2),

-- Meta Information
('meta_title', 'global', 'meta', 'text', 'Your Company | Digital Solutions', 1),
('meta_description', 'global', 'meta', 'text', 'Delivering high-quality solutions since 2010.', 2),

-- Section Ordering
('home_sections_order', 'global', 'settings', 'text', 'hero,services,projects,about,contact', 1);

-- Seed projects
INSERT OR REPLACE INTO projects (title, description, details, image_url, slug, published, is_featured, sort_order) VALUES
('Responsive Website',
 'A modern responsive website for a local business.',
 'Features: accessible design, CMS integration',
 '/assets/project-waterfront.jpg',
 'responsive-website',
 1, 1, 1),

('Productivity App',
 'A mobile app that helps users stay organized.',
 'Features: cross-platform support, offline mode, push notifications',
 '/assets/project-heritage.jpg',
 'productivity-app',
 1, 1, 2),

('E-commerce Platform',
 'A scalable online store with secure payments.',
 'Features: custom integrations, flexible catalog, analytics',
 '/assets/project-apartments.jpg',
 'ecommerce-platform',
 1, 1, 3),

('Analytics Dashboard',
 'A dashboard providing real-time insights for your team.',
 'Features: dynamic charts, exportable reports',
 '/assets/project-kitchen.jpg',
 'analytics-dashboard',
 1, 0, 4),

('Portfolio Showcase',
 'A clean and simple portfolio site.',
 'Features: image galleries, contact form',
 '/assets/project-sustainable.jpg',
 'portfolio-showcase',
 1, 0, 5);
