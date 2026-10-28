// All site copy lives here. Imported from the previous site (refs/viandwi24.github.io);
// statuses like "currently studying" are from 2024, so double-check them.

export interface Link {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  type: string
  year: number
  description: string
  tech: string[]
  links: Link[]
  /** Screenshot under /public, or null. */
  image: string | null
  /** Featured projects get a cartridge of this color on the Projects room wall. */
  cartridge?: string
}

export { projects } from './data/projects'

export const profile = {
  name: 'Alfian Dwi Nugraha',
  handle: 'viandwi24',
  avatar: '/avatar.webp',
  role: 'Web & blockchain developer',
  bio: [
    "Hi, I'm Alfian! I've loved the internet since I was 10: browsing blogs, then making desktop apps, and eventually falling for web programming.",
    'I build web front ends, server side apps, web games and a bit of desktop software, with a focus on web front end and Solana / web3.',
  ],
  now: [
    'Working freelance as a web developer',
    'Learning Golang, Python and Solana web3',
    'Studying Informatics Engineering at Surabaya State University',
  ],
  highlights: [
    { image: '/photos/bangkit-2023.webp', caption: 'Bangkit Academy 2023 · Link D Law' },
    { image: '/photos/lks-2020.webp', caption: 'LKS SMK Jawa Timur 2020 · 2nd place, Web Technology' },
  ],
  links: [
    { label: 'GitHub', url: 'https://github.com/viandwi24' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/viandwi24/' },
    { label: 'Email', url: 'mailto:viandwi24@pm.me' },
    { label: 'Linktree', url: 'https://linktr.ee/viandwi24' },
    { label: 'Instagram', url: 'https://instagram.com/viandwi_24' },
  ] as Link[],
}

/** [name, year started] */
export const skills: { title: string; items: [string, number][] }[] = [
  {
    title: 'Languages',
    items: [['TypeScript', 2019], ['JavaScript', 2014], ['Golang', 2022], ['Rust', 2023], ['Python', 2019], ['PHP', 2017], ['C#', 2018], ['Java', 2018]],
  },
  {
    title: 'Frameworks',
    items: [['Vue', 2019], ['Nuxt', 2019], ['React', 2021], ['Next', 2023], ['Laravel', 2018], ['Express', 2021], ['Flutter', 2019], ['Phaser', 2020], ['Tailwind', 2019], ['Unity', 2018]],
  },
  {
    title: 'Runtime & DevOps',
    items: [['Node.js', 2019], ['Bun', 2023], ['Deno', 2020], ['Docker', 2020], ['Kubernetes', 2023], ['Terraform', 2023], ['GitHub Actions', 2021]],
  },
  {
    title: 'Data & Cloud',
    items: [['PostgreSQL', 2018], ['MySQL', 2017], ['MongoDB', 2020], ['Redis', 2020], ['Firebase', 2019], ['AWS', 2020], ['GCP', 2021]],
  },
]

/** Work history, kept for the upcoming Experience room. */
export const experience = [
  { role: 'Blockchain Division', company: 'BRAINCORE.ID', date: 'Dec 2023 – now', tasks: ['Lead the blockchain division', 'Smart contracts for presence dApps and digital identity on Ethereum'] },
  { role: 'Cloud Computing cohort', company: 'Bangkit Academy (Google, GoTo, Traveloka)', date: 'Aug 2023 – Jan 2024', tasks: ['Google Cloud Platform and computer networking', 'Top 1,000 students in English courses & tests'] },
  { role: 'Blockchain Developer', company: 'Valutac Inovasi Kreasi', date: 'Feb 2023 – Jun 2023', tasks: ['Smart contracts in Rust on Solana', 'Connected contracts to React and React Native apps'] },
  { role: 'Blockchain Developer', company: 'NOKIAMON', date: 'Jan 2022 – now', tasks: ['Mobile apps with React Native and Solana wallets', 'xNFT apps on Backpack', 'Smart contract for badges'] },
  { role: 'Web Developer', company: 'Team Mojokerto Developer', date: 'Sep 2019 – now', tasks: ['E-commerce, food supply chain and e-laundry web apps'] },
  { role: 'Programmer & Web Admin', company: 'LSP SMKN 1 Mojokerto', date: 'Sep 2019 – now', tasks: ['Web interface, API backend and server maintenance'] },
  { role: 'Web Game Developer', company: 'FLAGZ', date: 'Sep 2019 – now', tasks: ['Multiplayer top-down pixel RPG with Phaser.js and voice chat'] },
  { role: 'Freelance programmer', company: 'viandwi24', date: 'Jun 2018 – now', tasks: ['E-commerce, WordPress sites, supply chain systems and Telegram bots'] },
]
