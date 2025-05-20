-- Seed initial content
INSERT OR REPLACE INTO content (key, page, section, type, value, sort_order) VALUES
-- Hero Section
('hero_title', 'home', 'hero', 'text', 'Building Excellence in Every Project', 1),
('hero_subtitle', 'home', 'hero', 'text', 'Providing quality construction and renovation services since 2010.', 2),
('hero_image', 'home', 'hero', 'image', '/assets/hero-image.jpg', 3),

-- Services Section
('services_intro_title', 'home', 'services', 'text', 'Our Services', 1),
('services_intro_text', 'home', 'services', 'text', 'We offer a comprehensive range of construction and renovation services tailored to your specific needs.', 2),
('service_1_title', 'home', 'services', 'text', 'Renovations', 3),
('service_1_text', 'home', 'services', 'text', 'Transform your existing space with our expert renovation services, focusing on quality craftsmanship and attention to detail.', 4),
('service_1_image', 'home', 'services', 'image', '/assets/renovations.jpg', 5),
('service_2_title', 'home', 'services', 'text', 'Extensions', 6),
('service_2_text', 'home', 'services', 'text', 'Expand your living space with our seamless home extensions, perfectly integrated with your existing structure.', 7),
('service_2_image', 'home', 'services', 'image', '/assets/extensions.jpg', 8),
('service_3_title', 'home', 'services', 'text', 'New Builds', 9),
('service_3_text', 'home', 'services', 'text', 'Create your dream home from the ground up with our comprehensive new build services.', 10),
('service_3_image', 'home', 'services', 'image', '/assets/new-builds.jpg', 11),
('service_4_title', 'home', 'services', 'text', 'Commercial', 12),
('service_4_text', 'home', 'services', 'text', 'Professional commercial construction and fit-out services for businesses of all sizes.', 13),
('service_4_image', 'home', 'services', 'image', '/assets/commercial.jpg', 14),

-- About Section
('about_title', 'home', 'about', 'text', 'About Us', 1),
('about_text', 'home', 'about', 'text', 'Our company has been creating quality spaces since 2010. We believe in transparent communication, sustainable practices, and delivering projects on time and within budget.', 2),
('about_image', 'home', 'about', 'image', '/assets/about-image.jpg', 3),

-- Contact Section
('contact_phone', 'home', 'contact', 'text', '000-000-0000', 1),
('contact_email', 'home', 'contact', 'text', 'info@example.com', 2),
('contact_address', 'home', 'contact', 'text', 'Example City, XX', 3),

-- Projects Section
('projects_intro_title', 'projects', 'intro', 'text', 'Featured Projects', 1),
('projects_intro_text', 'projects', 'intro', 'text', 'Take a look at some of our recent work that demonstrates our expertise and dedication to excellence.', 2),

-- Meta Information
('meta_title', 'global', 'meta', 'text', 'Your Company | Construction & Renovation Specialists', 1),
('meta_description', 'global', 'meta', 'text', 'Providing quality construction and renovation services since 2010.', 2),

-- Section Ordering
('home_sections_order', 'global', 'settings', 'text', 'hero,services,projects,about,contact', 1)
;

-- Seed projects
INSERT OR REPLACE INTO projects (title, description, details, image_url, slug, published, is_featured, sort_order) VALUES
('Modern Waterfront Home', 
 'A stunning waterfront property featuring open plan living, floor-to-ceiling windows, and premium finishes throughout.',
 'Location: Northern Beaches
Completion: 2023
Scope: New Build
Features: 4 bedrooms, 3 bathrooms, infinity pool, smart home technology',
 '/assets/project-waterfront.jpg',
 'modern-waterfront-home',
 1, 1, 1),

('Heritage Cottage Renovation', 
 'Careful restoration of a 1920s cottage, preserving character features while adding modern amenities.',
 'Location: Inner West
Completion: 2024
Scope: Heritage Renovation
Features: Original fireplaces restored, modern kitchen extension, landscaped gardens',
 '/assets/project-heritage.jpg',
 'heritage-cottage-renovation',
 1, 1, 2),

('Boutique Apartment Complex', 
 'Design and construction of a boutique apartment building with six luxury apartments.',
 'Location: Eastern Suburbs
Completion: 2023
Scope: Commercial New Build
Features: 6 apartments, underground parking, rooftop terrace, sustainable design elements',
 '/assets/project-apartments.jpg',
 'boutique-apartment-complex',
 1, 1, 3),

('Contemporary Kitchen Renovation', 
 'Complete transformation of an outdated kitchen into a modern cooking and entertaining space.',
 'Location: North Shore
Completion: 2024
Scope: Interior Renovation
Features: Custom cabinetry, island bench, premium appliances, butler''s pantry',
 '/assets/project-kitchen.jpg',
 'contemporary-kitchen-renovation',
 1, 0, 4),

('Sustainable Family Home', 
 'An eco-friendly new build utilizing sustainable materials and energy-efficient design principles.',
 'Location: Hills District
Completion: 2023
Scope: New Build
Features: Solar power, rainwater harvesting, passive design, recycled materials',
 '/assets/project-sustainable.jpg',
 'sustainable-family-home',
 1, 0, 5);
