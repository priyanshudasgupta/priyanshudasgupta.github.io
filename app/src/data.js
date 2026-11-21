// All site content lives here. Edit this file to update the website;
// the components only handle layout.

export const site = {
  name: 'Priyanshu Dasgupta',
  lede: 'I build imaging systems, simulations, and machine learning models for experimental physics.',
  now: "Current work: measuring pulse wave velocity from a wrist-worn sensor array, and building theory for Team USA at the International Physicists' Tournament.",
  study: 'Physics, with minors in Materials Science and Optimization & Quantitative Decision Science',
  school: 'Princeton University',
  schoolUrl: 'https://www.princeton.edu',
  place: 'Princeton, NJ',
  email: 'priyanshu@princeton.edu',
  linkedin: 'https://www.linkedin.com/in/priyanshu-dasgupta-a95588289/',
  github: 'https://github.com/priyanshudasgupta',
  url: 'https://priyanshudasgupta.github.io',
  resumePath: 'files/Priyanshu_Dasgupta_Resume.pdf',
};

export const nav = [
  { id: 'research', label: 'Research' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const research = [
  {
    when: '2026 – now', now: true,
    title: 'Research Engineer, Biomedical Signal Processing',
    demo: 'pulse',
    where: 'Health-tech startup',
    text: 'Leading the pulse wave velocity pipeline for a piezoelectric wrist-sensor array built in house and referenced to chest ECG. I designed its physiology-based signal-quality framework, and build U-Net and LSTM models that track blood pressure, SpO₂, and cardiac health.',
  },
  {
    when: 'Sep 2026 – now', now: true,
    title: 'Theorist and Data Analyst',
    where: "Team USA, International Physicists' Tournament (Authentic Research Partners)",
    text: "One of five members representing the U.S.; I build the theoretical models and lead the data analysis behind the team's papers.",
  },
  {
    when: 'Jul – Aug 2025',
    title: 'Quarknet Particle Physics Program',
    where: 'Rutgers University–New Brunswick',
    text: "Analyzed MINERvA neutrino data and Fermilab accelerator data, detected muons with scintillators, and gave a talk to more than 100 people on Grover's algorithm in Qiskit.",
  },
  {
    when: 'Jun 2024 – Aug 2025',
    title: 'Student Researcher',
    where: 'Mikhailova ETOILES Lab and Fleischer Imaging Lab, Princeton University',
    demo: 'layer',
    text: 'Imaged an argon current-carrying plasma double layer with Schlieren imaging and two-color interferometry, and wrote Schlieren airflow algorithms in MATLAB and Python for 3D models of aircraft turbulence. First author and presenter of a nonlinear optics poster at the APS 66th Annual Division of Plasma Physics meeting.',
  },
  {
    when: 'Mar – Sep 2024',
    title: 'Student Research Assistant',
    where: 'Nokia Bell Labs, with Dr. Yury Deshko',
    demo: 'diamond',
    text: 'Studied the zero phonon line in CVD-grown diamond implanted with Xe⁺ ions, and modeled V-Xe-V "artificial atom" centers and their interactions with the lattice in Python and MATLAB.',
  },
];

// In author lists, the entry equal to `me` is shown in bold.
export const me = 'P. Dasgupta';

export const publications = [
  {
    when: 'Feb 2025',
    title: 'Plasma densities for re-entry vehicles and high-harmonic generation crystals',
    authors: ['P. Dasgupta'],
    venue: 'Poster, North Jersey Junior Science and Humanities Symposium, Rutgers Aresty Research Center',
    note: '3rd place poster presenter overall; 1st place, physical sciences',
  },
  {
    when: 'Oct 2024',
    title: 'Characterizing gas and plasma densities in ultrafast laser-plasma interactions using shadowgraphy, Schlieren, and interferometry',
    authors: ['P. Dasgupta', 'A. Qin', 'E. Kretschmer', 'M. M. Wang', 'A. Das', 'I. Tigges-Green', 'A. V. Morozov', 'M. Mason', 'T. Gurcan', 'J. M. Mikhailova', 'J. W. Fleischer', 'M. R. Edwards'],
    venue: 'Poster CP12.00150, 66th Annual Meeting of the APS Division of Plasma Physics, Atlanta, GA',
    links: [
      { label: 'APS abstract', href: 'https://meetings.aps.org/Meeting/DPP24/Session/CP12.150' },
      { label: 'NSF record', href: 'https://par.nsf.gov/biblio/10654067' },
    ],
  },
  {
    when: 'Patent',
    title: 'STREAMS: a programmable, modular wind-tunnel fan array',
    authors: ['P. Dasgupta', 'J. W. Fleischer'],
    venue: 'U.S. provisional patent application (expired)',
    demo: 'fans',
    links: [
      { label: 'Read the manuscript (PDF)', href: 'files/STREAMS_Provisional_Patent_Manuscript.pdf' },
    ],
  },
];

export const featuredProject = {
  title: 'Schlieren imaging toolkit',
  sub: 'The code behind my Schlieren research and the STREAMS fan array',
  text: 'A full pipeline for seeing airflow: capture a background, measure how a density gradient displaces it, and turn that displacement into an image of the flow. It runs on a webcam outdoors as well as in the lab.',
  parts: [
    { name: 'Background-oriented Schlieren', text: 'OpenCV processing of live webcam video, with Kalman-filter tracking and wavelength-coded color backgrounds.' },
    { name: 'MATLAB simulations', text: 'Lens optics and air-density gradient models used to design the imaging setup.' },
    { name: 'STREAMS fan array', text: 'A programmable, modular wind-tunnel fan array driven by Arduino PWM, with a 3D control GUI. Filed as a provisional patent.' },
    { name: 'Live feed', text: 'A Flask site and an Android app that stream the processed Schlieren video.' },
  ],
  tech: ['Python', 'OpenCV', 'MATLAB', 'Arduino', 'Flask', 'Android'],
  repo: 'https://github.com/priyanshudasgupta/schlierensims-paper-patent',
};

export const projects = [
  {
    title: '3D molecule modeler',
    href: 'https://github.com/priyanshudasgupta/demomolecmodeling',
    text: 'A desktop app that builds molecules in 3D from atoms and bonds, with a distinct material for each element.',
    tech: 'Java, JavaFX',
    repoLabel: 'Repository', repo: 'https://github.com/priyanshudasgupta/demomolecmodeling',
  },
  {
    title: 'Star data pipeline',
    demo: 'stars',
    href: 'https://github.com/priyanshudasgupta/Star-Data-API',
    text: 'Scrapes, cleans, and merges star catalog data, converts mass and radius to SI units to compute surface gravity, charts the results, and serves them through a Flask API.',
    tech: 'Python, pandas, Flask',
    repoLabel: 'Repository', repo: 'https://github.com/priyanshudasgupta/Star-Data-API',
  },
  {
    title: 'Live handwriting recognition',
    href: 'https://github.com/priyanshudasgupta/Flask-Alphabet-Classifier',
    text: 'A scikit-learn classifier trained on MNIST and served through Flask, paired with a React Native camera app that sends it images to read.',
    tech: 'Python, scikit-learn, React Native',
    repoLabel: 'App repository', repo: 'https://github.com/priyanshudasgupta/Live-Image-Prediction',
  },
  {
    title: 'ManageEZ',
    href: 'https://github.com/priyanshudasgupta/manage-ez',
    text: 'A Flask web app that automates day-to-day management for rental communities.',
    tech: 'Python, Flask, SQLite',
    repoLabel: 'Repository', repo: 'https://github.com/priyanshudasgupta/manage-ez',
  },
];

export const about = {
  paragraphs: [
    "I'm studying physics at Princeton, with minors in materials science and in optimization and quantitative decision science. Most of my work comes down to one loop: build a model of something messy, measure it, and find out where the model is wrong.",
    'Outside the lab, I sing with Tarana, play lead guitar in an Indo-rock band, co-founded a catering business that supports families in Kolkata, and spent four years teaching English to refugees.',
  ],
  facts: [
    ['Honors', 'USA Physics Olympiad Gold Medal (2026); USA Computing Olympiad, Gold Division (2025)'],
    ['Competition', 'Captained my high school Science Olympiad team to 4th, 10th, and 7th at Nationals'],
    ['Princeton', 'PHY 105 course assistant, physics department web development, Electric Speedboating autonomy team, HackPrinceton'],
    ['Tools', 'Python, MATLAB, Java, PyTorch, scikit-learn, OpenCV, Qiskit, Flask, React'],
    ['Languages', 'English, Bengali, and Hindi; professional Spanish; some Russian'],
  ],
};
