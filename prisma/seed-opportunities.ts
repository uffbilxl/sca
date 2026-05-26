import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60)

const today = new Date('2026-05-26')

function status(deadline: Date | null) {
  if (!deadline) return 'OPEN' as const
  if (deadline < today) return 'CLOSED' as const
  const week = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return deadline <= week ? 'CLOSING_SOON' as const : 'OPEN' as const
}

function d(s: string | null): Date | null {
  return s ? new Date(s) : null
}

// [company, title, location, deadline YYYY-MM-DD | null, sponsors visa]
type E = [string, string, string, string | null, boolean]

const data: E[] = [
  // ── Software Engineering ─────────────────────────────────────────────────
  ['Google', 'Software Engineering Intern, 2026', 'London, Covent Garden', '2025-10-24', true],
  ['Google', 'Student Researcher, 2026', 'London, Covent Garden', null, true],
  ['Amazon', '2026 Software Dev Engineer Intern', 'London, St Paul\'s', null, true],
  ['Apple', 'Internship', 'London, Covent Garden', null, true],
  ['Apple', 'Intern Software Engineer', 'London, Covent Garden', '2026-01-27', true],
  ['Nvidia', 'Technology Intern - 2026', 'London', '2025-11-08', true],
  ['Nvidia', 'Software Engineering Intern, Networking Software', 'London', '2025-11-01', true],
  ['Meta', 'Software Engineer Intern', 'London, Mayfair', '2026-01-27', true],
  ['Meta', 'Security Engineer Intern', 'London, Mayfair', '2026-01-27', true],
  ['Microsoft', 'Software Engineer Internship Opportunities', 'London, Paddington', '2025-09-16', true],
  ['Netflix', 'Internship Program 2026', 'London, Fitzrovia', null, false],
  ['CFP Energy', 'Software & Data Engineering - Summer Internship', 'London', null, true],
  ['Snyk', 'Software Engineer Intern', 'London', null, true],
  ['Deliveroo', 'Software Engineer Intern', 'London, Cannon Street', null, true],
  ['Deliveroo', 'Machine Learning Intern', 'London, Cannon Street', null, true],
  ['Arctic Lake', 'Software Engineer Intern', 'London, Liverpool Street', null, true],
  ['Baker Hughes', 'Emerging Talent – Digital Technology Intern 2026', 'London, Hammersmith', null, true],
  ['Squarepoint Capital', 'Intern Software Development - Summer 2026', 'London, Barbican', null, true],
  ['TPP', 'Summer Internship - Software Developer', 'London', null, false],
  ['Marshall Wace', 'Technology Intern - 2026', 'London, Knightsbridge', null, true],
  ['Citadel', 'Software Engineer - Intern (Europe)', 'London, Barbican', null, true],
  ['G-P', 'Software Engineering Internship', 'London', '2026-05-18', true],
  ['Giant Ventures', 'Software Engineering Intern', 'London, Notting Hill', '2026-05-18', true],
  ['PrOXisense', 'Software Engineer Intern', 'London, Marylebone', '2026-05-18', true],
  ['Hiscox', '2026 Summer Intern', 'London, Bishopsgate', '2026-05-18', true],
  ['Waters Corporation', 'Software Engineering Summer Intern', 'Borehamwood', '2026-03-23', true],
  ['F5', 'Software Engineering & Data Science Internship 2026', 'London, Barbican', '2026-05-18', false],
  ['S&P Global', 'Software Engineer Intern', 'London, Barbican', '2026-05-18', true],
  ['S&P Global', 'Data Engineer Summer Intern', 'London, Barbican', null, true],
  ['TE Connectivity', 'Software Engineer Intern', 'London', '2026-05-18', true],
  ['Thought Machine', 'Software Engineering Intern', 'London, Bloomsbury', '2026-03-20', true],
  ['Runna', 'Software Engineering Intern, App', 'London, Southwark', '2026-04-02', true],
  ['Runna', 'Data Engineer Intern', 'London, Southwark', '2026-04-01', true],
  ['MUFG', '2026 Summer Internship Programme: Technology', 'London, Barbican', '2026-03-29', true],
  ['JetBrains', 'Internship Projects Summer/Fall 2026', 'London, Shoreditch', '2026-03-16', true],
  ['Viasat', 'Software Engineer Intern', 'London, Shoreditch', '2026-05-18', true],
  ['UserTesting', 'Software Engineer Intern', 'London', '2026-05-18', true],
  ['eSourcing Data', 'Software Development Intern (Summer)', 'London', '2026-05-18', false],
  ['Udemy', 'Software Engineer Intern, Dublin', 'Dublin', '2026-05-18', true],
  ['Aize', 'Software Engineering Intern', 'London, Fitzrovia', '2026-05-18', true],
  ['Motorola Solutions', 'Software Engineering Internship', 'London, Victoria', '2026-05-18', true],
  ['UnlikelyAI', 'Software Engineer Intern', 'London, Tower Hill', '2026-03-20', true],
  ['UnlikelyAI', 'Machine Learning Engineer Intern', 'London, Tower Hill', '2026-03-20', true],
  ['Compare The Market', 'Software Engineer Intern', 'London, Old Street', '2026-03-09', true],
  ['Compare The Market', 'Data Intern', 'London, Old Street', '2026-03-09', true],
  ['MongoDB', '2026 - Software Engineering Intern, Dublin', 'Dublin', '2026-05-18', true],
  ['MongoDB', '2026 - Security Intern, Dublin', 'Dublin', null, true],
  ['Keysight', 'Software Engineering Internship', 'London', '2026-05-18', true],
  ['UiPath', 'Software Engineer Intern', 'London, Bishopsgate', '2026-03-04', true],
  ['Vanguard', 'Technology Internship (Summer 2026)', 'London, Bank', '2026-05-18', true],
  ['Dojo', 'Intern, Associate Software Engineer', 'London, Paddington', '2026-05-18', true],
  ['AustralianSuper', '2026 Summer Intern Program', 'London, Islington', '2026-03-01', true],
  ['Squarespace', 'Software Engineering Intern - Summer 2026 (Dublin)', 'Dublin', '2026-05-18', true],
  ['WTW', '2026 Software Developer Internship', 'London, Lloyd\'s', '2026-05-18', true],
  ['Blockchain.com', 'Software Engineer Intern (6 months)', 'London, Clerkenwell', '2026-05-18', true],
  ['Mastercard', 'Software Engineering Intern, Summer 2026', 'London, Cannon Street', '2026-05-18', true],
  ['Mastercard', 'Intern, Technology Risk Management', 'London, Cannon Street', null, true],
  ['Siemens', 'Summer Intern – Software Development', 'London, St James\'s Park', '2026-02-14', true],
  ['eBay', 'SWE Intern, Dublin (6 months)', 'Dublin', '2026-02-14', true],
  ['Salesforce', '2026 Software Engineering Intern (Dublin)', 'Dublin', '2026-05-18', true],
  ['Spotify', '2026 Summer Internship, Engineering & Data Science', 'London, Covent Garden', '2026-02-05', true],
  ['Spotify', '2026 Summer Internship, Machine Learning Engineering', 'London, Covent Garden', '2026-02-05', true],
  ['Roku', 'Software Engineer Intern', 'London, Fitzrovia', '2026-05-18', true],
  ['Convergent', 'Software Engineer Intern', 'London, Southwark', '2026-05-18', true],
  ['Sportlight Technology', 'Software Intern Role', 'London, St Paul\'s', '2026-02-14', true],
  ['Bloomberg', '2026 Software Engineer Internship', 'London, Bank', '2026-01-27', true],
  ['Clear-Com', 'Software Engineering Intern', 'London', '2026-05-18', true],
  ['Cadence', 'Intern - Software Engineering', 'London, Bloomsbury', '2026-02-14', true],
  ['FactSet', 'Engineering Internship - Summer 2026', 'London, Shoreditch', '2026-02-14', false],
  ['Viator', 'Software Engineering Internship 2026', 'London, Soho', '2026-01-27', true],
  ['Oxford Nanopore Technologies', 'Software Developer Intern', 'London', '2026-01-19', true],
  ['Oxford Nanopore Technologies', 'Machine Learning Intern', 'London', '2026-01-19', true],
  ['Phasecraft', 'Quantum Software Intern', 'London, Fitzrovia', '2026-02-08', true],
  ['AVEVA', 'Software Developer Intern', 'London, St Paul\'s', '2026-02-14', true],
  ['AVEVA', 'Artificial Intelligence and Machine Learning Intern', 'London, St Paul\'s', '2026-02-14', true],
  ['AVEVA', 'Information Technology Intern', 'London, St Paul\'s', '2026-02-14', true],
  ['Ripple', 'Software Engineer Intern (Summer)', 'London', '2026-01-27', true],
  ['Frazer-Nash Consultancy', 'Data Science & Software Engineer Summer Internship', 'Leatherhead', '2026-01-12', true],
  ['Thales', 'Software Engineering Intern', 'London', '2026-02-14', false],
  ['M&G', 'Summer Internship', 'London, Lloyd\'s', '2026-01-09', true],
  ['Aries Global', 'Software Engineer Intern', 'London, Fitzrovia', '2026-02-14', true],
  ['Aries Global', 'Data Intern', 'London, Fitzrovia', '2026-02-14', true],
  ['Arondite', 'Software Engineer - Summer 2026 Intern', 'London, Chancery Lane', '2026-01-06', true],
  ['Nuveen', 'Technology & Operations - Summer Intern', 'London, Liverpool Street', '2025-12-19', true],
  ['Trainline', 'Engineering Internship Summer 2026', 'London, Chancery Lane', '2025-12-19', true],
  ['Severn Trent', 'Technology Summer Placement', 'London', '2026-01-27', true],
  ['Cirrus Logic', 'Software Developer Internship', 'London', '2026-02-14', true],
  ['Citi', '2026, Technology Summer Analyst', 'London, Old Street', '2026-01-27', true],
  ['SPAICE', 'Computer Vision Engineer Intern', 'London, Fulham', '2026-05-18', true],
  ['Stripe', 'Software Engineer, Intern', 'London, Southwark', '2026-02-14', true],
  ['Coinbase', 'Software Engineer Intern', 'London, Clerkenwell', '2026-02-14', true],
  ['Helsing', 'Software Engineer - Intern', 'London', '2025-12-28', true],
  ['Onestream', 'Summer Intern', 'London, Guildhall', '2026-01-27', true],
  ['Rokos Capital Management', 'RCM Internship Programme 2026', 'London, Mayfair', '2026-01-27', true],
  ['Certara', 'Junior Software Developer (Student Intern)', 'London', '2026-01-27', true],
  ['Wise', 'Software Engineering Intern 2026', 'London, Shoreditch', '2026-01-13', true],
  ['Wise', 'Analytics Intern', 'London, Shoreditch', '2026-01-13', true],
  ['Capgemini', 'Internship - Consulting or Technical routes 2026', 'London, Blackfriars', '2026-01-27', true],
  ['Nordic Semiconductor', 'UK Internships & Placements 2026 - Wi-Fi', 'London', '2026-01-27', true],
  ['Samsara', 'Software Engineering Intern', 'London, Whitechapel', '2026-02-14', true],
  ['BGC Group', '2026 Technology Summer Internship Programme', 'London, Canary Wharf', '2026-01-27', true],
  ['RBC Capital Markets', '2026 Summer Analyst - Developer / Data Analyst', 'London, Liverpool Street', '2025-12-10', true],
  ['RBC Capital Markets', '2026 Summer Analyst - Data Management Office', 'London, Liverpool Street', '2026-02-09', true],
  ['RBC Capital Markets', '2026 Summer Analyst - IT Engineering', 'London, Liverpool Street', '2026-01-23', true],
  ['Redgate', 'Software Engineer Internship 2026', 'London', '2025-12-12', true],
  ['PGIM', 'Technology Internship Program', 'London, Bishopsgate', '2026-01-27', true],
  ['Leonardo', 'Summer Placement Software Engineer', 'London, St James\'s', '2026-05-18', true],
  ['Pexip', 'Software Engineer Interns - Internship Summer 2026', 'London', '2026-01-27', true],
  ['Qualcomm', 'FY26 Intern - Software Engineer', 'London, Chiswick', '2026-05-18', true],
  ['Cloudflare', 'Software Engineer - Intern (Summer 2026)', 'London, Southwark', '2026-05-18', true],
  ['Cloudflare', 'Security Engineer Intern', 'London, Southwark', null, true],
  ['Perplexity', 'UK Internship Program', 'London', '2026-01-27', true],
  ['Visa', 'Software Engineer Intern', 'London, St James\'s', '2026-01-27', true],
  ['Man Group', '2026 Summer Technology Internship Programme', 'London, Cannon Street', '2025-11-14', true],
  ['Gearset', 'Software Engineering Intern 2026', 'London', '2025-11-08', true],
  ['Centrica', 'Technology Summer Internship', 'London, Mayfair', '2025-10-31', true],
  ['CommonAI CIC', 'Software Engineer (Summer 2026 Internship)', 'London', '2025-12-06', true],
  ['Financial Conduct Authority', '2026 Technology Summer Internship', 'London, Stratford', '2025-12-15', true],
  ['Rothesay', 'Internship - Software Engineering', 'London, Bloomsbury', '2025-11-07', true],
  ['Schonfeld', '2026 Software Engineer Summer Internship', 'London', '2026-01-27', true],
  ['Rolls-Royce', 'Engineering and Technology Summer Internship', 'London, Islington', '2025-11-14', false],
  ['Deutsche Bank', 'Internship Programme - Technology, Data & Innovation', 'London, Barbican', '2025-11-02', true],
  ['NCR Atleos', 'Software Internship - Summer 2026 (12 Weeks)', 'London, Camden', '2026-05-18', true],
  ['Riverlane', 'Summer Internship 2026', 'London', '2025-11-16', true],
  ['Hubspot', 'Software Engineer Internship Program', 'London, Liverpool Street', '2026-02-14', true],
  ['SLB', 'Software Engineer Intern (3 months)', 'London', '2026-01-27', true],
  ['Autodesk', 'Intern, Software Engineer', 'London, Covent Garden', '2026-01-27', true],
  ['Epic Games', 'Gameplay Programmer Intern', 'London, Belgravia', '2026-01-27', true],
  ['Blackstone', '2026 Software Developer Summer Analyst', 'London, Mayfair', '2026-01-27', true],
  ['MathWorks', 'Software Development Internship', 'London', '2026-05-18', true],
  ['Fleek', 'Software Engineering Intern (London-based)', 'London, Whitechapel', '2026-02-14', true],
  ['Qube RT', '2026 Internship - Software Engineering', 'London, Victoria', '2026-05-18', true],
  ['Symphony', 'Intern, Software Development', 'London, Liverpool Street', '2026-02-14', true],
  ['MBDA', 'Software Engineering - Summer Placement 2026', 'London, Covent Garden', '2026-01-06', false],
  ['NatWest Markets', 'Engineering - Internship', 'London, Liverpool Street', '2026-05-18', true],
  ['Tesco', 'Technology Internship', 'London, Clerkenwell', '2026-05-18', true],
  ['AMD', 'Summer 2026 Software Engineer Intern', 'London, Soho', '2026-01-27', true],
  ['Arm', 'Software Intern', 'London, Covent Garden', '2025-10-22', true],
  ['American Express', 'Campus - Internship Programme - Technology', 'London, Belgravia', '2026-01-27', true],
  ['American Express', 'Campus - Technology Operations Engineering Intern', 'London, Belgravia', null, true],
  ['Monzo', 'Software Engineering Internship (Summer 2026)', 'London, Shoreditch', '2025-11-14', true],
  ['BNY Mellon', '2026 Summer Internship Program', 'London, Blackfriars', '2026-05-18', false],
  ['BAE Systems', 'Summer Internship - Software Engineer', 'London, St James\'s', '2026-01-27', false],
  ['Barclays', 'Technology Summer Internship Programme 2026', 'London, Mayfair', '2026-01-27', true],
  ['Tencent', 'Various Tech Internships', 'London, Shoreditch', '2026-05-18', false],
  ['Tencent', 'Data Science Intern', 'London, Shoreditch', null, true],
  ['Netcraft', 'Software Engineering - Student Application', 'London, Victoria', '2025-11-18', true],
  ['London Stock Exchange Group', 'Engineering Summer Internship Programme (2026)', 'London, Shoreditch', '2025-11-28', true],
  ['Zurich Insurance', 'Summer Internship 2026', 'London, Camden', '2025-10-26', true],
  ['Shell', 'Assessed Internship Programme 2026', 'London, Canary Wharf', '2026-01-31', true],
  ['Baillie Gifford', 'Technology Summer Internship 2026', 'London, Aldgate', '2025-11-03', false],
  ['Figma', 'Software Engineer Intern, Developer Tools (2026)', 'London, Liverpool Street', '2026-05-18', true],
  ['PIMCO', '2026 Summer Intern - Technology Analyst', 'London, Marylebone', '2026-02-14', true],
  ['UBS', '2026 Summer Internship Program - GOTO Technology', 'London, Liverpool Street', '2025-10-31', true],
  ['Macquarie Group', '2026 Summer Internship Programme', 'London, Barbican', '2025-10-31', true],
  ['LCP', 'Technology - Summer Internship 2026', 'London, Soho', '2025-11-07', false],
  ['J.P. Morgan', '2026 Software Engineer Immersion Program - Summer Internship', 'London, Canary Wharf', '2025-11-02', true],
  ['Morgan Stanley', '2026 Technology Summer Analyst Program', 'London, Canary Wharf', '2025-11-23', true],
  ['Talos', 'Client Service Intern', 'London, Fitzrovia', '2025-12-06', true],
  ['Talos', 'Software Engineer Intern, Backend, Trading', 'London, Fitzrovia', null, true],
  ['Crowdstrike', 'Intern - Summer 2026', 'London, Shoreditch', '2026-01-27', true],
  ['Crowdstrike', 'Red Team (Cyber Security) Intern 2026', 'London, Shoreditch', '2026-02-14', true],
  ['Goldman Sachs', '2026 Summer Analyst Programme', 'London, Chancery Lane', '2026-05-18', true],
  ['Millennium Management', 'Software Engineering Intern', 'London, Mayfair', '2026-01-27', true],
  ['BNP Paribas', '2026 Summer Internship - Technology', 'London, Camden', '2025-09-16', true],
  ['Balyasny Asset Management', 'Software Engineering (Summer Internship)', 'London, St James\'s', '2026-02-14', true],
  ['Balyasny Asset Management', 'Quantitative Developer, Systematic Investment Teams (Summer Internship)', 'London, St James\'s', '2026-01-27', true],
  ['Cogna', 'Software Engineer Intern (2026 Cohort)', 'London, Monument', '2026-01-27', true],
  ['Confluent', '2026 Software Engineering Intern Opportunity', 'London, Bloomsbury', '2026-01-27', true],
  ['DV Trading', '2026 Summer Internship - Software Development', 'London', '2026-05-18', true],
  ['Palantir', 'Software Engineer, Internship', 'London, Soho', '2026-05-18', true],
  ['The Trade Desk', '2026 Summer Intern - Software Engineer', 'London, St Paul\'s', '2026-01-27', true],
  ['BlackRock', '2026 Summer Internship Programme', 'London, Bishopsgate', '2025-10-24', true],
  ['GIC', 'GIC Internship Programme 2026', 'London, Marylebone', '2026-01-27', true],
  ['Revolut', 'Rev-celerator Internship Programme 2026', 'London, Canary Wharf', '2025-12-14', true],
  ['Bending Spoons', 'Software Engineer, Intern', 'London', '2026-05-18', true],
  // ── Data / Analytics ─────────────────────────────────────────────────────
  ['Julius Baer', 'Data Analytics & Business Management Intern', 'London, Farringdon', null, true],
  ['Legal & General', 'Data Internship 2026', 'London, Bank', null, true],
  ['Cboe Global Markets', 'Intern - DPE (Data Pipeline Engineering)', 'London, Monument', null, true],
  ['Cboe Global Markets', 'Intern - Data & Analytics', 'London, Monument', null, true],
  ['Moloco', 'Data Science Intern', 'London, Fitzrovia', null, true],
  ['Moloco', 'Machine Learning Engineer Intern', 'London, Fitzrovia', null, true],
  ['Point72', '2026 Summer Internship – Data Engineer, Long/Short Equities', 'London, St James\'s', null, true],
  ['Ithaca Energy', 'Data Science Intern', 'London, Islington', '2026-03-30', true],
  ['Climate Policy Initiative', 'Data Science Intern', 'London, Southwark', '2026-03-16', true],
  ['Red Bull', 'Field Data Intern', 'London, Covent Garden', '2026-03-29', true],
  ['Frontier Economics', '2026 Junior Data Scientist Internship', 'London, Shoreditch', '2026-03-02', true],
  ['Checkout.com', 'Intern, Data Analytics', 'London, Islington', '2026-02-14', true],
  ['General Electric', 'GE Vernova - Data Analyst Intern', 'London', '2026-02-14', true],
  ['First Bank of Nigeria', '2026 Summer Internship Programme', 'London, Liverpool Street', '2026-01-27', true],
  ['NASDAQ', 'Data Science Intern', 'London, Bishopsgate', '2026-01-27', true],
  ['Dow Jones', 'Summer 2026 Internship – Data Analyst Intern', 'London, Southwark', '2026-02-27', true],
  ['AstraZeneca', 'Digital & Data Internship', 'London, Islington', '2026-01-19', true],
  ['Allianz Insurance', 'Summer Intern 2026', 'London', '2026-02-14', false],
  ['Bristol Myers Squibb', 'Intern, Statistical Programming', 'Uxbridge', '2026-02-14', false],
  ['Caxton Associates', '2026 Summer Internship Programme', 'London, St James\'s', '2026-01-31', true],
  ['Brevan Howard', '2026 Summer Internship – Systematic Data Engineering', 'London', '2026-01-27', true],
  ['Brevan Howard', '2026 Summer Internship Programme – AI & Quant', 'London', '2026-01-27', true],
  ['AXA', 'Intern (IDA - Data Science and AI)', 'London, Bank', '2025-11-30', true],
  ['Government Statistical Service', 'Summer Student Placements 2026', 'London, Westminster', '2025-11-11', false],
  ['Deloitte', 'Summer Vacation Scheme', 'London', '2025-10-06', true],
  ['Bank of America', 'Quantitative Data Analytics, Summer 2026 Analyst', 'London, St Paul\'s', '2025-10-05', true],
  // ── AI / ML ───────────────────────────────────────────────────────────────
  ['LEC AI', 'AI Engineer Summer Internship 2026', 'London', '2026-05-31', true],
  ['Avis Budget Group', 'AI Engineer Intern - Summer 2026', 'London', null, true],
  ['FAIR Football AI', 'AI Football Analyst Intern', 'London', null, true],
  ['Multus', 'Machine Learning / Software Engineer Intern', 'London, Shepherd\'s Bush', null, true],
  ['STMicroelectronics', 'Intern - Machine Learning & AI', 'Marlow', null, true],
  ['Snap', 'Machine Learning Engineering Intern', 'London, Soho', null, true],
  ['Parexel', 'AI Summer Intern', 'London, Islington', null, true],
  ['Quantum Dice', 'Summer Internship Programme', 'London', null, true],
  ['Mewburn Ellis', 'Summer Internship - Artificial Intelligence & Machine Learning', 'London, Bishopsgate', '2026-03-12', true],
  ['Johnson & Johnson', 'AI/ML Summer Intern - Statistics & Decision Sciences', 'London, Whitehall', '2026-02-25', true],
  ['Treefera', 'Treefera Internship Programme', 'London, Southwark', '2026-02-25', true],
  ['Bose', 'Audio Machine Learning Research Intern', 'London, Mayfair', '2026-01-27', true],
  ['Quilter', 'Early Careers Programme - AI Summer Internship', 'London, Blackfriars', '2026-01-26', true],
  ['HSBC', 'Quant Trading and Machine Learning Associate - Internship', 'London, Canary Wharf', '2026-01-04', true],
  ['HSBC', 'Digital Business Services - Summer Internship 2025-2026', 'London, Canary Wharf', null, true],
  ['OakNorth', 'AI Innovation Intern', 'London, Carnaby', '2026-01-27', true],
  ['Binome', 'AI Engineer Intern', 'London', null, true],
  ['Nannie', 'AI Startup Internship', 'London, Soho', null, true],
  ['Hacktron AI', 'Member of Technical Staff Intern', 'London, Shoreditch', null, true],
  // ── Trading / Quant ───────────────────────────────────────────────────────
  ['Hudson River Trading', 'Software Engineering Internship - Summer 2026', 'London, Liverpool Street', null, true],
  ['IMC Trading', 'Software Engineer Intern (2026)', 'London, Liverpool Street', null, true],
  ['IMC Trading', 'Women in Technology', 'London, Liverpool Street', '2026-03-13', true],
  ['Jane Street', 'Software Engineer Internship', 'London, Liverpool Street', null, true],
  ['Gresham Investment Management', 'Quantitative Developer Summer Internship', 'London, Covent Garden', '2026-02-14', true],
  ['Aspect Capital', 'Quantitative Research Intern - Execution Research', 'London, Marylebone', '2026-01-27', true],
  ['Mako Trading', 'Summer Internship - Trading & Technology', 'London', '2026-01-27', true],
  ['Quantbot Technologies', 'Data Trading Analyst Summer Internship - 2026', 'London, Bishopsgate', '2025-12-06', true],
  ['G-Research', 'Software Engineering Internship', 'London, Soho', '2026-01-27', true],
  ['Maven Securities', 'Software Developer Summer Internship 2026', 'London, Liverpool Street', '2026-01-27', true],
  ['Point72', '2026 Cubist Quant Academy – Developers', 'London, St James\'s', '2026-01-27', true],
  ['XTX Markets', 'Software Engineering Intern - Summer 2026', 'London, Islington', '2026-01-01', true],
  ['Quadrature', 'Quant Developer Internship', 'London, Bank', '2025-12-31', true],
  ['Tower Research Capital', 'Software Developer Intern (Summer 2026)', 'London, Monument', '2026-01-27', true],
  ['Susquehanna International Group', 'Software Development Internship: Summer 2026', 'London', '2026-01-27', true],
  ['Aquatic Capital Management', 'Software Engineer, Intern (Summer 2026)', 'London, Mayfair', '2026-01-27', true],
  ['Optiver', 'Software Engineer Internship (2026 Start)', 'London, St Paul\'s', '2026-01-27', true],
  ['Jump Trading', 'Campus Software Engineer (Intern)', 'London, Barbican', '2025-09-16', true],
  ['Xantium', 'Quantitative Developer Intern', 'London, Guildhall', '2026-01-27', true],
  ['Castleton Commodities International', 'Software Engineer Internship (Summer 2026)', 'London, Guildhall', '2025-09-14', true],
  ['GSA Capital', 'Software Developer - Intern', 'London, Mayfair', '2025-09-16', true],
  ['DRW', 'Software Developer Intern', 'London, Bank', '2026-01-27', true],
  // ── Consulting ────────────────────────────────────────────────────────────
  ['L.E.K. Consulting', '2026 Data & Analytics Summer Internship', 'London, Victoria', '2026-01-04', true],
  ['FTI Consulting', '2026 Summer Internship', 'London, Covent Garden', '2025-11-27', true],
  ['PA Consulting', '2026 Summer Internship - Software & Controls Engineer', 'London, Victoria', '2026-01-27', true],
  ['TTP', 'Consultant Software Engineer Summer Internship', 'London, Carnaby', '2025-11-07', true],
  ['EY', 'Technology Summer Internship - 2026', 'London, Covent Garden', '2026-01-27', true],
  // ── Cyber Security ────────────────────────────────────────────────────────
  ['Gallagher', 'Cyber Security Internship - 8-Week Summer Placement', 'London, Bank', null, true],
  ['Houlihan Lokey', 'IT Governance, Risk & Cybersecurity Internship - Summer 2026', 'London, Mayfair', null, true],
  ['PQShield', 'Software Prototype Intern – Post-Quantum Cryptography', 'London', null, true],
  ['National Gas', 'Cyber Security Internship', 'London, Canary Wharf', '2026-01-25', true],
  ['Copper.co', 'Information Security Summer Internship', 'London, Soho', '2026-02-13', true],
  ['Lloyds Banking Group', 'Cyber Security - Summer Internship', 'London, Guildhall', null, false],
  // ── IT ────────────────────────────────────────────────────────────────────
  ['Aventum Group', 'IT Intern', 'London, Monument', null, true],
  ['Fuse Energy', 'IT Operations Intern', 'London, Canary Wharf', null, true],
  ['NFU Mutual', 'IT Summer Internship Programme', 'London', '2026-03-13', true],
  ['CITIC CLSA', '2026 CLSA Internship - Information Technology', 'London, Bishopsgate', '2025-12-31', true],
  ['Crédit Agricole', 'Summer Internship Programme 2026 - IT', 'London, Shoreditch', '2026-01-27', true],
  ['Arch Insurance International', 'IT Summer Internship - 2026', 'London, Monument', '2026-01-31', true],
  ['Arbuthnot Latham', 'Internship 2026 - IT Service Delivery', 'London, Liverpool Street', '2025-11-07', true],
  ['Mizuho', 'IT Developer Summer Internship', 'London, St Paul\'s', '2026-01-27', true],
  // ── Other ─────────────────────────────────────────────────────────────────
  ['Legal & General', 'OneTech Services Intern 2026', 'London, Bank', null, true],
  ['Precisely', 'Cloud Engineering Intern', 'London', null, true],
  ['Harbor', 'Summer Intern - Legal Technology + Operations', 'London, Covent Garden', '2026-01-27', true],
  ['GSK', 'GSK Summer Internships 2026', 'London, Bloomsbury', null, true],
  ['British Business Bank', 'Summer Internship Programme 2026', 'London', null, true],
  ['Wincent', 'Engineers – Internship 2026', 'London', null, true],
]

async function main() {
  console.log(`Seeding ${data.length} opportunities…`)

  // 1. Upsert all unique companies
  const uniqueCompanies = data.map(e => e[0]).filter((v, i, a) => a.indexOf(v) === i)
  const companyMap: Record<string, string> = {}

  for (const name of uniqueCompanies) {
    let baseSlug = toSlug(name)
    // handle potential slug collisions for different company names
    let finalSlug = baseSlug
    let n = 2
    while (true) {
      const existing = await prisma.company.findUnique({ where: { slug: finalSlug } })
      if (!existing || existing.name === name) break
      finalSlug = `${baseSlug}-${n++}`
    }
    const company = await prisma.company.upsert({
      where: { slug: finalSlug },
      update: {},
      create: { name, slug: finalSlug },
    })
    companyMap[name] = company.id
  }

  // 2. Create opportunities
  const usedSlugs: Record<string, boolean> = {}

  for (const [company, title, location, deadlineStr, sponsored] of data) {
    const deadline = d(deadlineStr)
    const companyId = companyMap[company]

    let baseSlug = toSlug(`${company}-${title}`)
    let oppSlug = baseSlug
    let n = 2
    while (usedSlugs[oppSlug]) oppSlug = `${baseSlug}-${n++}`
    usedSlugs[oppSlug] = true

    try {
      await prisma.opportunity.create({
        data: {
          title,
          slug: oppSlug,
          description: `${title} opportunity at ${company}. Based in ${location}.`,
          type: 'INTERNSHIP',
          location,
          workMode: 'HYBRID',
          deadline,
          sponsored,
          status: status(deadline),
          companyId,
        },
      })
      console.log(`✓ ${company} — ${title}`)
    } catch (e: any) {
      console.error(`✗ ${company} — ${title}: ${e.message}`)
    }
  }

  console.log('\nDone!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
