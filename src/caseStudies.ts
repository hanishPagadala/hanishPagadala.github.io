export const featuredIds = ['04', '05', '07']

export const caseStudies: Record<string, { problem: string; responsibility: string; approach: string; outcome: string; link?: { label: string; href: string } }> = {
  '04': {
    problem: 'Build a robot that can search for opponents and react autonomously without leaving the arena.',
    responsibility: 'Led the multidisciplinary team and programmed ESP32 control in C++, alongside electronics integration and system debugging.',
    approach: 'Combined sensor-driven search and engagement behavior with line-sensor boundary detection. Iterated through assembly, wiring, hardware debugging, and integrated testing.',
    outcome: 'Built and tested an autonomous competition prototype with opponent-search and arena-boundary behavior.',
    link: { label: 'Project update on LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7461575718167113728/' },
  },
  '05': {
    problem: 'Navigate a maze autonomously using sensor feedback while keeping the hardware simple.',
    responsibility: 'Led team planning and technical work for the hovercraft’s design, construction, embedded control, and testing.',
    approach: 'Developed sensor-based path correction and refined navigation through repeated physical tests. Component placement and control behavior were considered together as part of system integration.',
    outcome: 'Placed third in autonomous maze traversal.',
  },
  '07': {
    problem: 'Support multiple news-sharing clients while keeping shared server data consistent and recoverable.',
    responsibility: 'Developed the Python TCP/UDP client-server architecture, concurrent request handling, application features, and persistent state.',
    approach: 'Used multithreading for concurrent clients and mutex synchronization for shared resources. CSV-backed persistence supported restoring data after a restart.',
    outcome: 'Implemented registration, authentication, subscriptions, publishing, comments, and state recovery in a concurrent client-server application.',
    link: { label: 'View source code', href: 'https://github.com/hanishPagadala/CommuncationProtocols_NewsSharingProtocol' },
  },
}
