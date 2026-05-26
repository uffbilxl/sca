import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60)


function mapType(t: string): 'INTERNSHIP' | 'PLACEMENT' | 'GRADUATE' | 'SPRING_WEEK' {
  const s = t.toLowerCase()
  if (s.includes('spring week')) return 'SPRING_WEEK'
  if (s.includes('placement')) return 'PLACEMENT'
  if (
    s.includes('graduate') || s.includes('new grad') ||
    s.includes('apprenticeship') || s.includes('early career') ||
    (s.includes('programme') && !s.includes('intern'))
  ) return 'GRADUATE'
  return 'INTERNSHIP'
}

const companyInfo: Record<string, string> = {
  'Amazon': 'Amazon is one of the world\'s most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.',
  'AWS': 'Amazon Web Services (AWS) is the world\'s leading cloud computing platform, offering over 200 fully featured services from data centres globally to millions of customers.',
  'Apple': 'Apple is one of the world\'s most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.',
  'Arm': 'Arm designs the CPU architectures that power the vast majority of the world\'s smartphones, IoT devices, and increasingly cloud servers and AI accelerators.',
  'Marshall Wace': 'Marshall Wace is one of Europe\'s leading hedge funds, managing over $60 billion in assets and combining systematic and discretionary investment strategies powered by proprietary technology.',
  'Point72': 'Point72 is a global asset management firm managing $30+ billion, blending fundamental research with quantitative and macro strategies across equities, fixed income, and macro.',
  'Intropic': 'Intropic is a proprietary trading and technology firm building cutting-edge quantitative models and high-performance systems that operate across global financial markets.',
  'Qube Research & Technologies': 'Qube Research & Technologies (QRT) is a quantitative and systematic investment manager operating at the intersection of data science, advanced technology, and global finance.',
  'G-Research': 'G-Research is a leading quantitative research and technology firm, using advanced data analysis and machine learning to generate and capture alpha in financial markets.',
  'Guggenheim Securities': 'Guggenheim Securities is a global investment bank providing advisory, financing, sales, trading, and research services to corporations, governments, and institutional investors.',
  'Cloudflare': 'Cloudflare is a global cloud services provider making the internet faster, more secure, and more reliable — protecting millions of websites and applications worldwide.',
  'Axon': 'Axon is a public safety technology company building connected devices and cloud software — including body cameras, TASER, and AI-powered evidence management platforms.',
  'Deliveroo': 'Deliveroo is a leading food delivery platform operating across the UK and Europe, building logistics, marketplace, and payments technology at rapid scale.',
  'Quantinuum': 'Quantinuum is the world\'s largest integrated quantum computing company, formed from the combination of Honeywell Quantum Solutions and Cambridge Quantum Computing.',
  'Pear VC': 'Pear VC is an early-stage venture capital firm investing in and partnering with ambitious founders building transformative technology companies from day one.',
  'LHV Bank UK': 'LHV Bank UK is a growing commercial bank and fintech infrastructure provider specialising in banking-as-a-service for financial technology companies across Europe.',
  'Mastercard': 'Mastercard is a global technology company in the payments industry, enabling secure and seamless digital transactions for billions of people and businesses worldwide.',
  'Visa': 'Visa is the world\'s largest payment network, facilitating over 200 billion transactions annually and connecting consumers, businesses, banks, and governments globally.',
  'MUFG': 'MUFG (Mitsubishi UFJ Financial Group) is one of the world\'s largest financial institutions, with a strong technology innovation practice across banking, securities, and asset management.',
  'Accenture': 'Accenture is a global professional services company specialising in digital, cloud, and security solutions, helping clients across every major industry and geography.',
  'Procter & Gamble': 'Procter & Gamble (P&G) is one of the world\'s largest consumer goods companies, with a significant technology organisation driving digital manufacturing, AI, and product innovation.',
  'Unisys': 'Unisys is a global IT company delivering enterprise technology solutions, digital workplace services, cloud, and infrastructure to public sector and private organisations worldwide.',
  'Pfizer': 'Pfizer is one of the world\'s largest pharmaceutical companies, with a growing digital and AI division transforming drug discovery, clinical trials, and healthcare delivery.',
  'AVEVA': 'AVEVA is a global leader in industrial software, providing engineering and operational technology solutions to help industries achieve operational efficiency and sustainability.',
  'HP': 'HP Inc. is a global technology company delivering innovations in personal computing, printing, and 3D printing to individuals and enterprises worldwide.',
  'Graphcore': 'Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.',
  'BAE Systems': 'BAE Systems is the UK\'s largest defence contractor, developing advanced technology for air, maritime, land, cyber, and space domains for governments worldwide.',
  'TPP': 'TPP (The Phoenix Partnership) is a UK health IT company that builds clinical software used across primary care, pharmacy, social care, and community healthcare settings.',
}

function buildDescription(company: string, title: string, typeStr: string, location: string): string {
  const base = companyInfo[company] ?? `${company} is a leading organisation offering exciting opportunities for technology students and graduates.`
  const s = typeStr.toLowerCase()
  let roleDesc: string
  if (s.includes('placement year') || (s.includes('placement') && s.includes('year'))) {
    roleDesc = `The ${title} is a year-long industrial placement where you will contribute to real engineering projects alongside experienced professionals, building skills that set you apart when you graduate.`
  } else if (s.includes('placement')) {
    roleDesc = `The ${title} is an industrial placement giving you extended hands-on experience in a live technology environment, working on real challenges that matter to the business.`
  } else if (s.includes('graduate') || s.includes('new grad') || s.includes('apprenticeship') || s.includes('early career') || (s.includes('programme') && !s.includes('intern'))) {
    roleDesc = `The ${title} is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.`
  } else {
    roleDesc = `The ${title} is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.`
  }
  return `${base}\n\n${roleDesc}\n\nBased in ${location}.`
}

// [company, title, typeStr, location, deadlineStr, applyUrl, logoUrl, website]
type E = [string, string, string, string, string, string, string, string]

const entries: E[] = [
  // Amazon
  ['Amazon', '2026 Software Dev Engineer Intern - UK', 'Software Engineering Internship', 'London; Cambridge; Edinburgh', 'Rolling',
    'https://www.amazon.jobs/en-gb/jobs/3072061/2026-software-dev-engineer-intern-uk',
    'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=256', 'https://www.amazon.co.uk'],
  ['Amazon', 'Security Specialist Intern, Data Centre Security', 'Cyber Security Internship', 'London', 'Rolling',
    'https://www.amazon.jobs/en-gb/jobs/3191381/security-specialist-intern-data-centre-security',
    'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=256', 'https://www.amazon.co.uk'],
  ['Amazon', 'UX Design Intern, Interaction Design', 'Technology / Product Design Internship', 'London', 'Rolling',
    'https://www.amazon.jobs/en-gb/jobs/3189014/ux-design-intern-interaction-design',
    'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=256', 'https://www.amazon.co.uk'],
  ['Amazon', 'Engineering Intern', 'Engineering / Infrastructure Internship', 'London', 'Rolling',
    'https://www.amazon.jobs/en-gb/jobs/3083028/engineering-intern',
    'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=256', 'https://www.amazon.co.uk'],
  // AWS
  ['AWS', 'Associate Solutions Architect Intern 2026', 'Cloud / Solutions Architecture Internship', 'London', 'Rolling',
    'https://www.amazon.jobs/en-gb/jobs/3143769/associate-solutions-architect-intern-2026',
    'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=256', 'https://aws.amazon.com'],
  // Apple
  ['Apple', 'Software Undergrad Engineering Internships', 'Software Engineering Internship', 'United Kingdom', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200664785/software-undergrad-engineering-internships',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  ['Apple', 'GPU Internship - Platform Architecture', 'Hardware / Software Internship', 'Cambridge; London; St Albans', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200617616-2114/gpu-internship-platform-architecture',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  ['Apple', 'SoC Performance Modeling Internship - Platform Architecture', 'Hardware / Software Internship', 'London', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200629965-2114/soc-performance-modeling-internship-platform-architecture',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  ['Apple', 'Camera Algorithms Intern', 'AI / Computer Vision Internship', 'Cambridge', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200647028-1251/camera-algorithms-intern?team=HRDWR',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  ['Apple', 'Software Engineering Intern (Machine Learning & AI Workflows)', 'AI / ML Software Internship', 'United Kingdom', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200655115-1731/software-engineering-intern-machine-learning-ai-workflows?team=HRDWR',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  ['Apple', 'Machine Learning Engineer - NLP/LLM (2026 New Grad)', 'Machine Learning Graduate / New Grad', 'United Kingdom', 'Rolling',
    'https://jobs.apple.com/en-gb/details/200658046-0351/machine-learning-engineer-nlp-llm-2026-new-grad?team=MLAI',
    'https://www.google.com/s2/favicons?domain=apple.com&sz=256', 'https://www.apple.com/uk'],
  // Arm
  ['Arm', 'Graduate Engineer - Edge AI System Performance', 'AI / Software Engineering Graduate Scheme', 'Cambridge', 'Rolling',
    'https://careers.arm.com/job/cambridge/graduate-engineer-edge-ai-system-performance/33099/95262406992',
    'https://www.google.com/s2/favicons?domain=arm.com&sz=256', 'https://www.arm.com'],
  ['Arm', 'Graduate Engineer - System Performance Team', 'Hardware / Software Graduate Scheme', 'Cambridge', 'Rolling',
    'https://careers.arm.com/en/job/cambridge/graduate-engineer-system-performance-team/33099/95128344880',
    'https://www.google.com/s2/favicons?domain=arm.com&sz=256', 'https://www.arm.com'],
  // Marshall Wace
  ['Marshall Wace', 'Technology Intern - London - Summer 2026', 'Technology Summer Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/mwinternshipprogram/jobs/7998360002',
    'https://www.google.com/s2/favicons?domain=mwam.com&sz=256', 'https://www.mwam.com'],
  // Point72
  ['Point72', '2026 Summer Internship - Data Engineer, Long/Short Equities', 'Data Engineering Summer Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/point72/jobs/8183047002?gh_jid=8183047002',
    'https://www.google.com/s2/favicons?domain=point72.com&sz=256', 'https://point72.com'],
  // Intropic
  ['Intropic', 'Quantrepreneur - Research Analyst', 'Quant / Trading Internship', 'London', 'Rolling',
    'https://jobs.lever.co/intropic/a4a5fb03-4a97-4f18-a680-7dd5663955a2',
    'https://www.google.com/s2/favicons?domain=intropic.io&sz=256', 'https://www.intropic.io'],
  ['Intropic', 'Quantrepreneur - Quantitative Developer', 'Quant Developer Internship', 'London', 'Rolling',
    'https://jobs.lever.co/intropic/1427876a-fb80-4ee1-96da-79cac32a7803',
    'https://www.google.com/s2/favicons?domain=intropic.io&sz=256', 'https://www.intropic.io'],
  ['Intropic', 'Quantitative Developer', 'Quant Developer Graduate / Early Career', 'London', 'Rolling',
    'https://jobs.lever.co/intropic/e7f90e06-05e2-40d8-b9f5-df4c96792dd2',
    'https://www.google.com/s2/favicons?domain=intropic.io&sz=256', 'https://www.intropic.io'],
  // Qube Research & Technologies
  ['Qube Research & Technologies', '2026 - Internship, Data Engineering', 'Data Engineering Internship', 'Paris; London', 'Rolling',
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8078338002',
    'https://www.google.com/s2/favicons?domain=qube-rt.com&sz=256', 'https://www.qube-rt.com'],
  ['Qube Research & Technologies', '2026 - Internship, Quantitative Developer', 'Quant Developer Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8068131002',
    'https://www.google.com/s2/favicons?domain=qube-rt.com&sz=256', 'https://www.qube-rt.com'],
  ['Qube Research & Technologies', '2026 - Internship, Quantitative Research/Trading', 'Quant / Trading Internship', 'London; Paris; Geneva; Zurich', 'Rolling',
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8052341002',
    'https://www.google.com/s2/favicons?domain=qube-rt.com&sz=256', 'https://www.qube-rt.com'],
  ['Qube Research & Technologies', '2026 - Internship, Machine Learning Engineer', 'Machine Learning Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8511818002',
    'https://www.google.com/s2/favicons?domain=qube-rt.com&sz=256', 'https://www.qube-rt.com'],
  // G-Research
  ['G-Research', 'Natural Language Processing Internship', 'AI / NLP Internship', 'London', 'Rolling',
    'https://gresearch.wd103.myworkdayjobs.com/en-US/G-Research/job/Natural-Language-Processing-Internship_R3269',
    'https://www.google.com/s2/favicons?domain=gresearch.com&sz=256', 'https://www.gresearch.com'],
  // Guggenheim Securities
  ['Guggenheim Securities', '2026 Investment Banking Intern - Technology & Services', 'Technology & Services Summer Internship', 'London', 'Rolling',
    'https://guggenheim.wd1.myworkdayjobs.com/en-US/Guggenheim_Careers_Campus/job/XMLNAME-2026-Investment-Banking-Intern---Technology---Services--London-_14631',
    'https://www.google.com/s2/favicons?domain=guggenheimpartners.com&sz=256', 'https://www.guggenheimpartners.com'],
  // Cloudflare
  ['Cloudflare', 'GRC Team Intern (Summer 2026)', 'Cyber Security / GRC Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/cloudflare/jobs/7577564',
    'https://www.google.com/s2/favicons?domain=cloudflare.com&sz=256', 'https://www.cloudflare.com'],
  ['Cloudflare', 'Security Engineer Intern (Summer 2026)', 'Cyber Security Engineering Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/cloudflare/jobs/7582169',
    'https://www.google.com/s2/favicons?domain=cloudflare.com&sz=256', 'https://www.cloudflare.com'],
  // Axon
  ['Axon', '2026 UK Software Engineering Internship', 'Software Engineering Internship', 'London', 'Rolling',
    'https://job-boards.greenhouse.io/axontalentcommunity/jobs/7122432003',
    'https://www.google.com/s2/favicons?domain=axon.com&sz=256', 'https://www.axon.com'],
  // Deliveroo
  ['Deliveroo', 'Software Engineer Intern', 'Software Engineering Internship', 'London', 'Rolling',
    'https://jobs.ashbyhq.com/deliveroo/3e0440a9-7abc-45b0-8520-d3e13083d0f3',
    'https://www.google.com/s2/favicons?domain=deliveroo.co.uk&sz=256', 'https://deliveroo.co.uk'],
  // Quantinuum
  ['Quantinuum', 'Internship Opportunities with Quantinuum 2026 - UK/Germany', 'Quantum / ML Internship', 'London; Cambridge', 'Rolling',
    'https://jobs.eu.lever.co/quantinuum/dc2f6f9e-b409-4640-807d-0339a12dc3cd',
    'https://www.google.com/s2/favicons?domain=quantinuum.com&sz=256', 'https://www.quantinuum.com'],
  // Pear VC
  ['Pear VC', 'Software Engineering Intern', 'Software Engineering Internship', 'London', 'Rolling',
    'https://jobs.ashbyhq.com/Pear-VC/781a43c0-a13a-4e27-95a8-0dde6279d33f',
    'https://www.google.com/s2/favicons?domain=pear.vc&sz=256', 'https://www.pear.vc'],
  // LHV Bank UK
  ['LHV Bank UK', 'IT Infrastructure / Platform Services Intern', 'Infrastructure Internship', 'London', 'Rolling',
    'https://boards.greenhouse.io/lhvuk/jobs/4846825101',
    'https://www.google.com/s2/favicons?domain=lhv.com&sz=256', 'https://www.lhv.com'],
  // Mastercard
  ['Mastercard', 'Technology Risk Analyst, Launch Graduate Program 2026', 'Technology Risk Graduate Programme', 'London', 'Rolling',
    'https://mastercard.wd1.myworkdayjobs.com/Campus/job/Technology-Risk-Analyst--Launch-Graduate-Program-2026---London--UK_R-256701/apply',
    'https://www.google.com/s2/favicons?domain=mastercard.co.uk&sz=256', 'https://www.mastercard.co.uk'],
  // Visa
  ['Visa', 'Data Engineering Graduate', 'Data Engineering Graduate Scheme', 'United Kingdom', 'Rolling',
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Data-Engineering-Graduate_REF97107Z-1',
    'https://www.google.com/s2/favicons?domain=visa.co.uk&sz=256', 'https://www.visa.co.uk'],
  ['Visa', 'Data Science Graduate', 'Data Science Graduate Scheme', 'United Kingdom', 'Rolling',
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Data-Science-Graduate_REF93870J',
    'https://www.google.com/s2/favicons?domain=visa.co.uk&sz=256', 'https://www.visa.co.uk'],
  ['Visa', 'Software Engineering Higher (Level 4) Apprenticeship', 'Software Engineering Apprenticeship', 'Reading', 'Rolling',
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Software-Engineering-Higher--Level-4--Apprenticeship_REF97167S',
    'https://www.google.com/s2/favicons?domain=visa.co.uk&sz=256', 'https://www.visa.co.uk'],
  // MUFG
  ['MUFG', '2026 MUFG UK Summer Internship - Technology Innovation Management', 'Technology Summer Internship', 'London', 'Rolling',
    'https://mufgub.wd3.myworkdayjobs.com/en-US/MUFG-Careers/job/London/XMLNAME-2026-MUFG-UK-Summer-Internship-Programme--Technology-Innovation-Management_10072523-WD-1/apply/useMyLastApplication?source=BuiltInNationwide',
    'https://www.google.com/s2/favicons?domain=mufg.com&sz=256', 'https://www.mufg.com'],
  // Accenture
  ['Accenture', 'Accenture Internship Opportunities (June / July / August 2026 Intake)', 'Technology / Consulting Internship', 'United Kingdom', 'Rolling',
    'https://www.accenture.com/gb-en/careers/jobdetails?id=R00276795_en',
    'https://www.google.com/s2/favicons?domain=accenture.com&sz=256', 'https://www.accenture.com/gb-en'],
  ['Accenture', 'Infrastructure & Capital Projects - Graduate Development Program - Data Center Cost Management', 'Technology / Data Centre Graduate Programme', 'Multiple UK Locations', 'Rolling',
    'https://www.accenture.com/gb-en/careers/jobdetails?id=695a805e-ff4a-437b-bd01-1b9a524bd4c3_en',
    'https://www.google.com/s2/favicons?domain=accenture.com&sz=256', 'https://www.accenture.com/gb-en'],
  // Unisys
  ['Unisys', 'Projects Technical Support Intern (Placement Year, 2026 - 2027)', 'Technical Support / Infrastructure Placement Year', 'Manchester', 'Rolling',
    'https://unisys.wd5.myworkdayjobs.com/en-US/External/job/Manchester-United-Kingdom/Projects-Technical-Support-Intern--Placement-Year--2026---2027-_REQ571527/apply/autofillWithResume?q=science',
    'https://www.google.com/s2/favicons?domain=unisys.com&sz=256', 'https://www.unisys.com'],
  // Pfizer
  ['Pfizer', 'AI Application Developer Undergraduate', 'AI / Software Industrial Placement', 'Walton Oaks', 'Rolling',
    'https://pfizer.wd1.myworkdayjobs.com/en-US/pfizercareers/job/United-Kingdom---Walton-Oaks/AI-Application-Developer-Undergraduate_4956412',
    'https://www.google.com/s2/favicons?domain=pfizer.co.uk&sz=256', 'https://www.pfizer.co.uk'],
  // AVEVA
  ['AVEVA', 'Cloud Operations & Infrastructure Graduate', 'Cloud / Infrastructure Graduate Scheme', 'Cambridge', 'Rolling',
    'https://aveva.wd3.myworkdayjobs.com/en-US/AVEVA_careers/job/Cloud-Developer-Graduate_R011704',
    'https://www.google.com/s2/favicons?domain=aveva.com&sz=256', 'https://www.aveva.com'],
  // HP
  ['HP', 'Graduate Software Developer (C#) - 2-year Placement', 'Graduate Software Placement', 'Cambridge', 'Rolling',
    'https://hp.wd5.myworkdayjobs.com/en-US/ExternalCareerSite/job/Cambridge-Cambridgeshire-United-Kingdom/Graduate-Software-Developer--C----2-year-Placement_3156191-1/apply/autofillWithResume?source=MyGWorks',
    'https://www.google.com/s2/favicons?domain=hp.com&sz=256', 'https://www.hp.com/gb-en'],
  // Graphcore
  ['Graphcore', 'Intern - Research', 'AI Research Internship', 'Bristol; Cambridge; London', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8287389002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Machine Learning Engineer - Applied AI', 'AI / ML Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8234675002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate IT Infrastructure Engineer', 'IT Infrastructure Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8425273002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Firmware Engineer', 'Firmware Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8238597002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - Drivers', 'Software Engineering Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8238605002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - Analysis Tools', 'Software Engineering Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8420657002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - ML Kernels & Runtime Team', 'AI / ML Software Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8230202002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - Triton', 'AI / ML Software Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8238577002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - AI/ML Test Systems', 'AI / ML Software Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8245655002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  ['Graphcore', '2026 Graduate Software Engineer - DevOps', 'DevOps Graduate Scheme', 'Bristol', 'Rolling',
    'https://job-boards.greenhouse.io/graphcore/jobs/8282735002',
    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256', 'https://www.graphcore.ai'],
  // BAE Systems
  ['BAE Systems', 'Graduate Software Engineer', 'Software Engineering Graduate Scheme', 'Christchurch', 'Rolling',
    'https://jobsearch.baesystems.com/job/graduate-software-engineer-v05928-10397',
    'https://www.google.com/s2/favicons?domain=baesystems.com&sz=256', 'https://www.baesystems.com/en-uk'],
  ['BAE Systems', 'National Security Cyber Accelerator', 'Cyber Security Programme', 'Gloucester; Manchester', 'Rolling',
    'https://jobsearch.baesystems.com/job/national-security-cyber-accelerator-122986',
    'https://www.google.com/s2/favicons?domain=baesystems.com&sz=256', 'https://www.baesystems.com/en-uk'],
  ['BAE Systems', 'Graduate Computing and IT Engineer', 'Computing / IT Graduate Scheme', 'Frimley', 'Rolling',
    'https://jobsearch.baesystems.com/job/graduate-computing-and-it-engineer-v05900-10384',
    'https://www.google.com/s2/favicons?domain=baesystems.com&sz=256', 'https://www.baesystems.com/en-uk'],
  ['BAE Systems', 'Graduate Information Management & Technology', 'Technology Graduate Scheme', 'Barrow-in-Furness', 'Rolling',
    'https://jobsearch.baesystems.com/job/graduate-information-management-technology-v05923-10395',
    'https://www.google.com/s2/favicons?domain=baesystems.com&sz=256', 'https://www.baesystems.com/en-uk'],
  ['BAE Systems', 'Graduate Systems Engineer', 'Systems / Software Engineering Graduate Scheme', 'Broad Oak', 'Rolling',
    'https://jobsearch.baesystems.com/job/graduate-systems-engineer-v05857-10184',
    'https://www.google.com/s2/favicons?domain=baesystems.com&sz=256', 'https://www.baesystems.com/en-uk'],
  // TPP
  ['TPP', 'Graduate Software Developer', 'Software Engineering Graduate Scheme', 'Leeds', 'Rolling',
    'https://tpp-careers.com/roles/graduate-software-developer/',
    'https://media.licdn.com/dms/image/v2/D4E0BAQHrF5WnLhhi8g/company-logo_200_200/B4EZfFOF7bHwAI-/0/1751360496561/the_phoenix_partnership_tpp__logo?e=2147483647&v=beta&t=T1HmYFQOD_LCRd_yfDY_VdQgiQhQzgG6Th95g0vOhpY', 'https://tpp-careers.com'],
  ['TPP', 'Graduate Technical Engineer', 'Technical Engineering Graduate Scheme', 'Leeds', 'Rolling',
    'https://tpp-careers.com/roles/graduatetechnicalengineer/',
    'https://media.licdn.com/dms/image/v2/D4E0BAQHrF5WnLhhi8g/company-logo_200_200/B4EZfFOF7bHwAI-/0/1751360496561/the_phoenix_partnership_tpp__logo?e=2147483647&v=beta&t=T1HmYFQOD_LCRd_yfDY_VdQgiQhQzgG6Th95g0vOhpY', 'https://tpp-careers.com'],
  ['TPP', 'Summer Internship - Software Developer', 'Software Development Summer Internship', 'Leeds', 'Rolling',
    'https://tpp-careers.com/roles/summer-internship-software-developer/',
    'https://media.licdn.com/dms/image/v2/D4E0BAQHrF5WnLhhi8g/company-logo_200_200/B4EZfFOF7bHwAI-/0/1751360496561/the_phoenix_partnership_tpp__logo?e=2147483647&v=beta&t=T1HmYFQOD_LCRd_yfDY_VdQgiQhQzgG6Th95g0vOhpY', 'https://tpp-careers.com'],
]

async function main() {
  console.log('Clearing existing data…')
  await prisma.opportunityTag.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.company.deleteMany()
  console.log('Cleared.\n')

  console.log(`Inserting ${entries.length} opportunities…`)
  const companyMap: Record<string, string> = {}
  const usedSlugs: Record<string, boolean> = {}

  const featuredCompanies = new Set([
    'Amazon', 'AWS', 'Apple', 'Arm', 'Cloudflare', 'Deliveroo',
    'Mastercard', 'Visa', 'Accenture', 'BAE Systems', 'Graphcore',
    'Marshall Wace', 'G-Research', 'Point72',
    'Pfizer', 'MUFG', 'Quantinuum',
  ])

  for (const [company, title, typeStr, location, , applyUrl, logoUrl, website] of entries) {
    if (!companyMap[company]) {
      const compSlug = toSlug(company)
      const comp = await prisma.company.upsert({
        where: { slug: compSlug },
        update: { logo: logoUrl, website },
        create: { name: company, slug: compSlug, logo: logoUrl, website },
      })
      companyMap[company] = comp.id
    }

    let base = toSlug(`${company}-${title}`)
    let oppSlug = base
    let n = 2
    while (usedSlugs[oppSlug]) oppSlug = `${base}-${n++}`
    usedSlugs[oppSlug] = true

    try {
      await prisma.opportunity.create({
        data: {
          title,
          slug: oppSlug,
          description: buildDescription(company, title, typeStr, location),
          type: mapType(typeStr),
          location,
          workMode: 'HYBRID',
          deadline: null,
          sponsored: false,
          featured: featuredCompanies.has(company),
          status: 'OPEN',
          applyUrl,
          companyId: companyMap[company],
        },
      })
      console.log(`✓ [${mapType(typeStr)}] ${company} — ${title}`)
    } catch (e: any) {
      console.error(`✗ ${company} — ${title}: ${e.message}`)
    }
  }

  const total = await prisma.opportunity.count()
  console.log(`\nDone! ${total} opportunities in database.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
