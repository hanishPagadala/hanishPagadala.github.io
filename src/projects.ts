export const categories = ['All projects', 'Embedded & robotics', 'Aerospace & photonics', 'Software & games', 'Data & automation'] as const
export type Category = typeof categories[number]
export type Project = {
  id: string
  title: string
  category: Exclude<Category, 'All projects'>
  context: string
  status: string
  ongoing?: boolean
  description: string
  tags: string[]
  contributions: string[]
  drawing?: 'wing' | 'wheel' | 'optical'
}

export const projects: Project[] = [
  {
    id: '01', title: 'Oblique Wing Drone', category: 'Aerospace & photonics', context: 'CSME Concordia · Electronics lead', status: 'Work in progress', ongoing: true, drawing: 'wing',
    description: 'Electronics and avionics integration for an aircraft that approaches flight from a different angle.',
    tags: ['Avionics', 'Telemetry', 'System integration'],
    contributions: ['Lead electronics integration and selection of flight-control, sensor, telemetry, and avionics components.', 'Design wiring, component placement, and interfaces for GPS, airspeed sensing, power monitoring, and onboard logging.', 'Prepare flight-controller and telemetry setup for sensor acquisition, ground-station communication, and readiness testing.'],
  },
  {
    id: '02', title: 'Reaction Wheel', category: 'Embedded & robotics', context: 'Ongoing engineering project', status: 'Work in progress', ongoing: true, drawing: 'wheel',
    description: 'An ongoing exploration of reaction-wheel systems and attitude control.', tags: ['Control systems', 'Angular momentum'],
    contributions: ['Project currently in development. Hardware, implementation details, and test results will be shared as the work progresses.'],
  },
  {
    id: '03', title: 'Lumentum/IEEE: Laser Transmission', category: 'Aerospace & photonics', context: 'Lumentum / IEEE', status: 'Work in progress', ongoing: true, drawing: 'optical',
    description: 'An ongoing laser-transmission project exploring communication through light.', tags: ['Photonics', 'Optical communication'],
    contributions: ['Project currently in development. System architecture, individual contributions, and measurements will be documented as the work progresses.'],
  },
  {
    id: '04', title: 'Robowars Autonomous Combat Robot', category: 'Embedded & robotics', context: 'Personal · Team lead · 2026', status: 'Competition project',
    description: 'An autonomous ESP32 robot that searches for opponents while keeping itself inside the arena.', tags: ['ESP32', 'C++', 'Sensors'],
    contributions: ['Led a multidisciplinary team through design, prototyping, assembly, integration, and testing.', 'Programmed sensor-driven opponent detection, search, and engagement behavior in C++.', 'Implemented line-sensor boundary detection and contributed to custom electronics, wiring, and system debugging.'],
  },
  {
    id: '05', title: 'Autonomous Hovercraft', category: 'Embedded & robotics', context: 'Academic · Team lead', status: '3rd place · Maze traversal',
    description: 'Sensor-guided maze navigation with an emphasis on simple hardware and iterative control improvements.', tags: ['C++', 'Embedded control', 'Navigation'],
    contributions: ['Led team planning and technical work for design, construction, and testing.', 'Developed sensor-based path-correction and navigation logic while minimizing hardware complexity.', 'Refined the system through repeated testing and debugging; placed third in autonomous maze traversal.'],
  },
  {
    id: '06', title: 'FPGA Occupancy Monitor', category: 'Embedded & robotics', context: 'Academic · 2024', status: 'Digital design project',
    description: 'A VHDL system that counts room entries and exits and flags maximum occupancy.', tags: ['VHDL', 'FPGA', 'ModelSim', 'Vivado'],
    contributions: ['Designed digital logic to maintain a live occupancy count from entry and exit events.', 'Implemented a maximum-capacity alert and checked expected behavior through simulation.', 'Produced RTL and implementation schematics using ModelSim and Xilinx Vivado.'],
  },
  {
    id: '07', title: 'News Sharing Protocol', category: 'Software & games', context: 'Academic · 2026', status: 'Network programming project',
    description: 'A concurrent news-sharing service with subscriptions, publishing, comments, and recoverable server state.', tags: ['Python', 'TCP / UDP', 'Concurrency'],
    contributions: ['Designed a TCP/UDP client-server architecture supporting multiple concurrent clients.', 'Implemented multithreaded request handling and mutex synchronization for shared resources.', 'Built registration, authentication, subscriptions, publishing, and comments, with CSV persistence and state recovery.'],
  },
  {
    id: '08', title: 'Meal Planning & Nutrition App', category: 'Software & games', context: 'Academic · Scrum master · 2026', status: 'Full-stack team project',
    description: 'A database-backed nutrition application developed through collaborative Agile delivery.', tags: ['Python', 'Flask', 'SQL', 'Docker'],
    contributions: ['Built backend features and database integration, including registration, login, and password hashing.', 'Supported sprint planning, team task coordination, debugging, and iterative development as Scrum Master.', 'Used Docker-hosted SonarQube for static analysis and code-quality checks.'],
  },
  {
    id: '09', title: 'StudyHub', category: 'Software & games', context: 'MPC Hacks · 2026', status: 'Hackathon prototype',
    description: 'Helping students find, create, and manage course-specific study groups.', tags: ['React', 'TypeScript', 'Firebase', 'Google APIs'],
    contributions: ['Developed responsive interfaces for group details, host controls, membership management, and chat.', 'Integrated maps for study-session locations and Gemini-based study-guide features.', 'Used AI-assisted tools for interface prototyping and debugging while collaborating in a hackathon team.'],
  },
  {
    id: '10', title: 'Monkey See Monkey Solve', category: 'Software & games', context: 'ConUHacks · Four-person team · 2026', status: 'Hackathon prototype',
    description: 'A maze puzzle game that brings physical sensor interactions into Python gameplay.', tags: ['Python', 'Pygame', 'Arduino', 'I²C'],
    contributions: ['Developed player movement, collision detection, timed challenges, riddle gates, and power-ups.', 'Integrated an Arduino, ultrasonic sensor, and I²C LCD for physical interactions and real-time feedback.', 'Collaborated on gameplay, hardware, audio, interfaces, integration, and testing.'],
  },
  {
    id: '11', title: 'Used-Car Price Prediction', category: 'Data & automation', context: 'Academic · Team lead · 2026', status: 'Machine-learning project',
    description: 'A regression pipeline built around approximately 393,000 vehicle records.', tags: ['Python', 'Pandas', 'Scikit-learn'],
    contributions: ['Cleaned and prepared vehicle data, addressing missing values, duplicates, outliers, and inconsistent fields.', 'Developed preprocessing and feature-engineering workflows for supervised price prediction.', 'Compared models using cross-validation and error metrics, with five-fold validation and hyperparameter tuning.'],
  },
  {
    id: '12', title: 'RENTRUCK', category: 'Data & automation', context: 'Academic · 2026', status: 'Database systems project',
    description: 'A relational data model and application for truck-rental and transportation operations.', tags: ['SQL', '3NF', 'Data modeling'],
    contributions: ['Designed a relational schema normalized to third normal form.', 'Modeled customers, vehicles, drivers, missions, invoices, and invoice lines with primary and foreign keys.', 'Connected the database to a simple frontend/backend for managing and retrieving rental data.'],
  },
  {
    id: '13', title: 'Business Process Automation Bot', category: 'Data & automation', context: 'Personal · 2026', status: 'Automation demonstration',
    description: 'A rules-based request-validation workflow with reporting and automated mock-portal submissions.', tags: ['Python', 'Pandas', 'Selenium'],
    contributions: ['Validated requests against required fields, costs, priorities, deadlines, and business rules.', 'Implemented duplicate detection, exception handling, routing decisions, logging, and approval/error reports.', 'Automated submissions to a simulated portal using Selenium; this is a personal demonstration rather than an employer deployment.'],
  },
]
