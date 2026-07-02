export type EducationItem = {
  title: string;
  org: string;
  dates: string;
  description: string;
};

export const education: EducationItem[] = [
  {
    title: 'Applied Science Communication: Online and Media Writing',
    org: 'University of the West of England (UWE)',
    dates: 'Apr – Jun 2023',
    description:
      'Gained expertise in communicating scientific concepts to non-academic audiences; developed the ability to evaluate and adapt writing styles across formats, platforms, and audiences.',
  },
  {
    title: 'CIM Level 4 Certificate in Professional Digital Marketing',
    org: 'Loughborough College',
    dates: 'Dec 2020 – Dec 2021',
    description:
      'Built tactical marketing skills across Applied Marketing, Planning Campaigns, and Digital Marketing Techniques modules, developing practical expertise in delivering effective marketing strategies.',
  },
  {
    title: 'Space Studies Programme (SSP)',
    org: 'International Space University · Department: Space Applications',
    dates: 'Jun – Aug 2013',
    description:
      'Team project: AMBIEnT — Affordable Microsatellite-Based Internet Access and Environmental moniToring.',
  },
  {
    title: 'PhD Candidate, Astronomy',
    org: 'University of Kent',
    dates: 'Sep 2009 – 2012',
    description:
      "Studied Jupiter-family comets as part of the international SEPPCoN collaboration, characterising the physical properties of cometary nuclei. Processed and analysed optical imaging data from the VLT, Palomar, and Keck telescopes, and contributed to interpretation of thermal-IR data from NASA's Spitzer Space Telescope. Findings supported spacecraft missions including ESA's Rosetta and NASA's Stardust-NExT and EPOXI.",
  },
  {
    title: 'Physics with Astrophysics, MPhys (Hons)',
    org: 'University of Leicester',
    dates: 'Sep 2005 – Jul 2009',
    description:
      'Studied the core of fundamental physics and mathematics based on Institute of Physics (IOP) "core of physics" material, specialising in astrophysics.',
  },
];
