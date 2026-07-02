export type Role = {
  title: string;
  org: string;
  dates: string;
  description: string;
  dim?: boolean; // visually recedes on the timeline (earlier / shorter roles)
};

export const experience: Role[] = [
  {
    title: 'Founder and Director',
    org: 'Green Orbit Digital',
    dates: 'Oct 2023 – Present',
    description:
      "Leading a pioneering agency dedicated to sustainable marketing in the space industry — transforming businesses' space endeavours into eco-conscious ventures, driving a greener future beyond our planet.",
  },
  {
    title: 'Career Break',
    org: 'Professional Development',
    dates: 'Mar 2023 – Oct 2023',
    description:
      'Following a personal bereavement, took the opportunity to focus on professional development: achieved Chartered Marketer (CMktr) status, completed a summer course in science communication at UWE, and a series of online courses.',
    dim: true,
  },
  {
    title: 'Marketing and Communications Manager',
    org: 'HE Space for ESA – European Space Agency',
    dates: 'Aug 2021 – Feb 2023',
    description:
      'Led editorial content creation for ESA Business Applications. Organised and coordinated webinars for funding calls. Collaborated closely with ESA Corporate Communication, design, and legal teams.',
  },
  {
    title: 'Self-employed',
    org: 'Freelance',
    dates: 'Jul 2018 – Jul 2021',
    description:
      "Delivered the social media plan for University of Leicester's Copernicus Hackathon (2018). Created editorial content for the Point.IOT MOOC with Space Tec Partners. Editor for Ocean State Report 4 (Copernicus Marine Environment Monitoring Service, Mercator Ocean) and led social strategy for @CMEMS_EU #OceanStateReport.",
  },
  {
    title: 'Co-Founder & Director',
    org: 'Powering Space',
    dates: '2019 – 2022',
    description:
      'Co-founded and directed a global network of space organisations, foundations, and individuals fostering a passionate, informed, engaged space community — diffusing space knowledge and facilitating collaboration among space communicators and outreach practitioners.',
  },
  {
    title: 'Co-Founder & Director',
    org: 'R&R Space Ltd',
    dates: '2018 – 2021',
    description:
      'Co-founded a company advancing space technology and innovation through engaging events and hands-on training, inspiring a new generation of space entrepreneurs and explorers through education, outreach, and innovation.',
  },
  {
    title: 'Editor',
    org: 'Design & Data GmbH',
    dates: 'Jul 2015 – Jul 2021',
    description:
      'Script writer and interviewer for the "EUMETSAT and Africa" series with high-profile diplomats. Script writer and co-director of videos for the ESA Materials & Electrical Components Laboratory. Editor-in-Chief for Design & Data and Spaceoneers websites, leading content delivery and social media.',
  },
  {
    title: 'STEM Communicator',
    org: 'Bloodhound SSC',
    dates: 'Sep 2005 – Jul 2009',
    description:
      "Created online educational resources for the BLAST education platform. Delivered workshops in schools, ranging from K'nex cars to desert-living scenarios.",
    dim: true,
  },
  {
    title: 'Journalist, Intern Science Communication',
    org: 'European Southern Observatory (ESO)',
    dates: 'Jan – Jun 2014',
    description:
      'Worked within the ESO Education and Public Outreach Department (ePOD) alongside professional science communicators preparing ESO and ESA/Hubble news and photo releases, publications, web pages, video scripts, and exhibition panels.',
    dim: true,
  },
  {
    title: 'Intern (Space Scoop)',
    org: 'Universe Awareness (UNAWE), Leiden University',
    dates: 'Oct 2013 – Jan 2014',
    description:
      'Expanded Space Scoop to a diverse range of media platforms, exploring news channels available for children and investigating the best routes to improve syndication of science content for and by children into mainstream children\'s media.',
    dim: true,
  },
  {
    title: 'Intern',
    org: 'Space Generation Advisory Council (SGAC)',
    dates: 'Jan – Apr 2013',
    description:
      'Supported organisation of the Space Generation Fusion Forum and the SGAC annual report; represented SGAC at the UN COPUOS Scientific and Technical Subcommittee.',
    dim: true,
  },
  {
    title: 'Postgraduate Demonstrator',
    org: 'School of Physical Sciences, University of Kent',
    dates: 'Sep 2009 – 2012',
    description:
      'Taught undergraduates and marked assignments across PH020 (Algebra and Arithmetic, Foundation Year), PS370 (Skills for Physicists, First Year), and PH302 (Computing Skills, First Year).',
    dim: true,
  },
  {
    title: 'Outreach Support',
    org: 'South-East Physics Network (SEPnet)',
    dates: 'Sep 2009 – 2012',
    description:
      'Delivered talks and presentations to schoolchildren, including open days and presentations inside SEPnet\'s "astrodome" inflatable planetarium.',
    dim: true,
  },
  {
    title: 'Technician',
    org: 'Space Research Centre, University of Leicester',
    dates: 'Jun – Aug 2008',
    description:
      'Analysed calibration data for the GERB Focal Plane Array (FPA); built a computer program to manage and plot relevant variables for calibration checks.',
    dim: true,
  },
  {
    title: 'Student Associate',
    org: 'Brockington College, Enderby, Leicestershire',
    dates: 'Jun 2008',
    description:
      'Supported pupils aged 11–14 with science learning, in partnership with the Teaching Development Agency (TDA) and the University of Leicester.',
    dim: true,
  },
  {
    title: 'Technician',
    org: 'Dept. of Physics & Astronomy, University of Leicester',
    dates: 'Jul – Aug 2007',
    description:
      'Summer Undergraduate Research Experience placement searching for time-variable absorption in polluted white dwarfs and Si III-star interaction; analysed FUSE pipeline data and fitted spectra.',
    dim: true,
  },
];
