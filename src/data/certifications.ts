export type CertLink = { label: string; href?: string };
export type CertGroup = { title: string; items: CertLink[]; subgroups?: { subhead: string; items: CertLink[] }[] };

export const certifications: CertGroup[] = [
  {
    title: 'Chartered Institute of Marketing (CIM)',
    items: [
      { label: 'Certificate in Professional Digital Marketing', href: 'https://www.credly.com/earner/earned/badge/9b363b0c-71e4-4ab6-9c7c-6c02db537c51' },
      { label: 'Marketing Strategy Masterclass', href: 'https://www.cim.co.uk/events/event/?id=114375' },
      { label: 'Applied Marketing', href: 'https://www.credly.com/earner/earned/badge/c8332af1-f0f5-46bf-80b9-c5976681a52b' },
      { label: 'Copywriting Masterclass', href: 'https://www.credly.com/earner/earned/badge/7b298323-929d-4bda-92a5-3fcce9da5678' },
      { label: 'Planning Campaigns', href: 'https://www.credly.com/earner/earned/badge/ab8f07ff-9a94-4662-a01f-8d060e6a46ca' },
      { label: 'Digital Marketing Techniques', href: 'https://www.credly.com/earner/earned/badge/34934015-edf7-4e0c-a234-ce6599f1e837' },
      { label: 'Digital Copywriting for Websites' },
      { label: 'Marketing Fundamentals' },
    ],
  },
  {
    title: 'Chartered Institute of Public Relations (CIPR)',
    items: [
      { label: 'Equity, Diversity and Inclusion: Series 1', href: 'https://api.eu.badgr.io/public/assertions/Ni65N6e-SpOs3vCctjHETg?identity__email=rjmlaird%40gmail.com' },
      { label: 'Introduction to PR' },
    ],
  },
  {
    title: 'First Aid & Business',
    items: [
      { label: 'Emergency First Aid at Work', href: 'https://foxmedics.co.uk/first-aid-awareness' },
      { label: 'Rebel Business School', href: 'https://therebelschool.com' },
      { label: 'Level 1 Award in Enterprising Skills and Employability', href: 'https://sfediawards.co.uk/qualifications/level-1-certificate-in-enterprising-skills-and-employability/' },
      { label: 'Level 1 Award in Understanding Enterprise', href: 'https://sfediawards.co.uk/qualifications/level-1-award-in-understanding-enterprise/' },
      { label: 'Enterprise Design Thinking Practitioner', href: 'https://www.credly.com/badges/e8a1b73b-78cf-4d0e-92ce-617ab846be20/linked_in_profile' },
      { label: 'Enterprise Design Thinking Co-Creator', href: 'https://www.credly.com/badges/3e35bc4a-9d66-4c08-9f56-590a8765be63/linked_in_profile' },
    ],
  },
  {
    title: 'Project Management',
    items: [
      { label: 'APM Associate', href: 'https://www.credly.com/earner/earned/badge/0da010d9-d7ff-4a71-9ca5-5c472cd8d988' },
      { label: 'Die Beratung Judith Andresen — Project Management Training' },
    ],
  },
  {
    title: 'Google',
    items: [
      { label: 'Google Analytics', href: 'https://skillshop.credential.net/b2a982ec-9164-4e0f-87ca-c08213189669' },
      { label: 'Fundamentals of Digital Marketing', href: 'https://learndigital.withgoogle.com/link/1qsdpcedm9s' },
      { label: 'Google News Initiative Training Center Certification' },
    ],
  },
  {
    title: 'HubSpot Academy',
    items: [
      { label: 'Content Marketing', href: 'https://app-eu1.hubspot.com/academy/achievements/tv2z8yvd/en/1/ryan-laird/content-marketing' },
      { label: 'Inbound Marketing', href: 'https://app-eu1.hubspot.com/academy/achievements/p6vsv2c1/en/1/ryan-laird/inbound-marketing' },
      { label: 'Social Media Marketing', href: 'https://app-eu1.hubspot.com/academy/achievements/dv18qhgy/en/1/ryan-laird/social-media-marketing' },
    ],
  },
  {
    title: 'Cybersecurity — (ISC)²',
    items: [
      { label: 'Certified in Cybersecurity (CC) Self-Paced Training', href: 'https://learn.isc2.org/d2l/awards/v1/9541/certificate/render/754122' },
      { label: 'Certified in Cybersecurity (CC)', href: 'https://www.credly.com/badges/da1aee17-41b1-4099-80ae-093fdbe1b9ad/linked_in_profile' },
      { label: 'Data Privacy & Protection: Compliance Requirements' },
      { label: 'Supply Chain Security Fundamentals' },
      { label: 'Introduction to Denial of Service Attacks' },
      { label: 'Open Systems Intelligence' },
      { label: 'Security in the IoT Ecosystem' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'INCO Academy — Green Digital Skills Certificate', href: 'https://learning.inco-group.co/admin/tool/certificate/index.php' },
      { label: 'The Open University — Effective Communication in the Workplace' },
    ],
    subgroups: [
      {
        subhead: 'LinkedIn Learning — Communication',
        items: [
          { label: 'Amplifying Your Message Through Storytelling' },
          { label: 'Communicate to Influence' },
          { label: 'Communicating Across Cultures' },
        ],
      },
      {
        subhead: 'LinkedIn Learning — Leadership',
        items: [
          { label: 'Agile Project Leadership' },
          { label: 'Leadership Foundations: Styles & Models' },
          { label: 'Building Resilience' },
        ],
      },
      {
        subhead: 'LinkedIn Learning — Strategy & Technical',
        items: [
          { label: 'Strategic Planning Foundations' },
          { label: 'Lean Technology Strategy' },
          { label: 'Video Strategies for High Engagement' },
          { label: '5G Technology Strategy' },
          { label: 'Introduction to Digital Twins' },
          { label: 'Introduction to ESG' },
          { label: 'Satellite Internet & Communications' },
        ],
      },
    ],
  },
];
