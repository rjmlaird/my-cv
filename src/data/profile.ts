export const profile = {
  name: 'Ryan Laird',
  role: 'Director of Green Orbit Digital — elevating brands with tailored strategies and sustainable marketing solutions for the space sector.',
  credentials: 'MPhys (Hons) · MInstP · CMktr · MCIPR',
  summary: [
    'Results-driven communications and marketing professional with over a decade of experience in the space industry. As a Chartered Marketer (CMktr), I have led numerous successful campaigns, driving brand growth and engagement through data-informed strategy, content creation, and audience-focused communications. I combine technical knowledge in physics and space studies with marketing, digital strategy, and public relations to communicate complex topics clearly and persuasively across diverse audiences.',
    'Beyond Green Orbit Digital, I maintain a portfolio of projects spanning software development, marketing, and space research, bridging disciplines to create meaningful connections between complex subjects and the audiences they serve.',
  ],
  tags: [
    'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media Strategy',
    'Lead Generation', 'Sustainability', 'Space Industry', 'Earth Observation',
    'Brand Strategy', 'Data Analytics', 'Project Management', 'Leadership',
  ],
  portfolioLinks: [
    { label: 'greenorbit.space', href: 'https://greenorbit.space' },
    { label: 'rjmlaird.dev', href: 'https://rjmlaird.dev' },
    { label: 'rjmlaird.digital', href: 'https://rjmlaird.digital' },
    { label: 'rjmlaird.space', href: 'https://rjmlaird.space' },
  ],
  contact: [
    { label: 'rjmlaird@gmail.com', href: 'mailto:rjmlaird@gmail.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/rjmlaird87' },
    { label: 'GitHub', href: 'https://github.com/rjmlaird' },
    { label: 'X / Twitter', href: 'https://x.com/rjmlaird' },
    { label: 'Muck Rack', href: 'https://muckrack.com/rjmlaird' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-5992-684X' },
  ],
};

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Memberships', href: '#memberships' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
];
