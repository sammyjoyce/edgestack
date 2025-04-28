-- Define the schema for the content table
DROP TABLE IF EXISTS content;
CREATE TABLE content (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);

-- Insert initial placeholder content
INSERT INTO content (key, value) VALUES
('hero_title', 'Placeholder Hero Title'),
('hero_subtitle', 'Placeholder hero subtitle text goes here.'),
('hero_image_url', '/assets/placeholder.jpg'), -- Placeholder image
('about_title', 'About Us Placeholder'),
('about_text', 'Placeholder text describing the company or project.'),
('services_intro_title', 'Our Services Placeholder'),
('services_intro_text', 'Placeholder text introducing the services offered.'),
('service_1_title', 'Placeholder Service One'),
('service_1_text', 'Description for placeholder service one.'),
('service_2_title', 'Placeholder Service Two'),
('service_2_text', 'Description for placeholder service two.'),
('projects_intro_title', 'Recent Projects Placeholder'),
('projects_intro_text', 'Placeholder text introducing recent projects.');
