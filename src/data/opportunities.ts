import type { Opportunity, OpportunityType, WorkMode } from '@/types'

function co(name: string, logo: string, website: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return { id: slug, name, slug, logo, website, description: null }
}

function opp(
  slug: string, title: string, description: string,
  type: OpportunityType, location: string, workMode: WorkMode,
  featured: boolean, sponsored: boolean, applyUrl: string | null,
  company: ReturnType<typeof co>, index: number
): Opportunity {
  return {
    id: slug, title, slug, description, type, location, workMode,
    featured, sponsored, status: 'OPEN', applyUrl, company,
    requirements: null, responsibilities: null,
    salary: null, salaryMin: null, salaryMax: null,
    deadline: null, startDate: null, duration: null,
    tags: [], _count: { comments: 0 },
    createdAt: new Date(new Date('2025-05-01').getTime() - index * 86_400_000),
  }
}

const C = {
  Amazon:     co('Amazon',                       'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=256',              'https://www.amazon.co.uk'),
  AWS:        co('AWS',                          'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=256',             'https://aws.amazon.com'),
  Apple:      co('Apple',                        'https://www.google.com/s2/favicons?domain=apple.com&sz=256',                 'https://www.apple.com/uk'),
  Arm:        co('Arm',                          'https://www.google.com/s2/favicons?domain=arm.com&sz=256',                   'https://www.arm.com'),
  MarshallWace: co('Marshall Wace',              'https://www.google.com/s2/favicons?domain=mwam.com&sz=256',                  'https://www.mwam.com'),
  Point72:    co('Point72',                      'https://www.google.com/s2/favicons?domain=point72.com&sz=256',               'https://point72.com'),
  Intropic:   co('Intropic',                     'https://www.google.com/s2/favicons?domain=intropic.io&sz=256',               'https://www.intropic.io'),
  Qube:       co('Qube Research & Technologies', 'https://www.google.com/s2/favicons?domain=qube-rt.com&sz=256',               'https://www.qube-rt.com'),
  GResearch:  co('G-Research',                   'https://www.google.com/s2/favicons?domain=gresearch.com&sz=256',             'https://www.gresearch.com'),
  Guggenheim: co('Guggenheim Securities',        'https://www.google.com/s2/favicons?domain=guggenheimpartners.com&sz=256',    'https://www.guggenheimpartners.com'),
  Cloudflare: co('Cloudflare',                   'https://www.google.com/s2/favicons?domain=cloudflare.com&sz=256',            'https://www.cloudflare.com'),
  Axon:       co('Axon',                         'https://www.google.com/s2/favicons?domain=axon.com&sz=256',                  'https://www.axon.com'),
  Deliveroo:  co('Deliveroo',                    'https://www.google.com/s2/favicons?domain=deliveroo.co.uk&sz=256',           'https://deliveroo.co.uk'),
  Quantinuum: co('Quantinuum',                   'https://www.google.com/s2/favicons?domain=quantinuum.com&sz=256',            'https://www.quantinuum.com'),
  PearVC:     co('Pear VC',                      'https://www.google.com/s2/favicons?domain=pear.vc&sz=256',                   'https://www.pear.vc'),
  LHV:        co('LHV Bank UK',                  'https://www.google.com/s2/favicons?domain=lhv.com&sz=256',                   'https://www.lhv.com'),
  Mastercard: co('Mastercard',                   'https://www.google.com/s2/favicons?domain=mastercard.co.uk&sz=256',          'https://www.mastercard.co.uk'),
  Visa:       co('Visa',                         'https://www.google.com/s2/favicons?domain=visa.co.uk&sz=256',                'https://www.visa.co.uk'),
  MUFG:       co('MUFG',                         'https://www.google.com/s2/favicons?domain=mufg.com&sz=256',                  'https://www.mufg.com'),
  Accenture:  co('Accenture',                    'https://www.google.com/s2/favicons?domain=accenture.com&sz=256',             'https://www.accenture.com/gb-en'),
  Unisys:     co('Unisys',                       'https://www.google.com/s2/favicons?domain=unisys.com&sz=256',                'https://www.unisys.com'),
  Pfizer:     co('Pfizer',                       'https://www.google.com/s2/favicons?domain=pfizer.co.uk&sz=256',              'https://www.pfizer.co.uk'),
  AVEVA:      co('AVEVA',                        'https://www.google.com/s2/favicons?domain=aveva.com&sz=256',                 'https://www.aveva.com'),
  HP:         co('HP',                           'https://www.google.com/s2/favicons?domain=hp.com&sz=256',                    'https://www.hp.com/gb-en'),
  Graphcore:  co('Graphcore',                    'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=256',              'https://www.graphcore.ai'),
  TPP:        co('TPP',                          'https://media.licdn.com/dms/image/v2/D4E0BAQHrF5WnLhhi8g/company-logo_200_200/B4EZfFOF7bHwAI-/0/1751360496561/the_phoenix_partnership_tpp__logo?e=2147483647&v=beta&t=T1HmYFQOD_LCRd_yfDY_VdQgiQhQzgG6Th95g0vOhpY', 'https://tpp-careers.com'),
  PG:         co('Procter & Gamble',             'https://www.google.com/s2/favicons?domain=pg.co.uk&sz=256',                 'https://www.pg.co.uk'),
  DRW:        co('DRW',                          'https://www.google.com/s2/favicons?domain=drw.com&sz=256',                  'https://drw.com'),
  MandG:      co('M&G',                          'https://www.google.com/s2/favicons?domain=mandg.com&sz=256',                'https://www.mandg.com'),
  Ultra:      co('Ultra',                        'https://www.google.com/s2/favicons?domain=ultra.group&sz=256',              'https://www.ultra.group'),
  DXC:        co('DXC Technology',               'https://www.google.com/s2/favicons?domain=dxc.com&sz=256',                  'https://dxc.com'),
  Motorola:   co('Motorola Solutions',           'https://www.google.com/s2/favicons?domain=motorolasolutions.com&sz=256',    'https://www.motorolasolutions.com'),
  NatWest:    co('NatWest Group',                'https://www.google.com/s2/favicons?domain=natwestgroup.com&sz=256',         'https://www.natwestgroup.com'),
}

export const OPPORTUNITIES: Opportunity[] = [
  opp('amazon-2026-software-dev-engineer-intern-uk', '2026 Software Dev Engineer Intern - UK',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe 2026 Software Dev Engineer Intern - UK is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London; Cambridge; Edinburgh.",
    'INTERNSHIP', 'London; Cambridge; Edinburgh', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3072061/2026-software-dev-engineer-intern-uk', C.Amazon, 0),

  opp('amazon-security-specialist-intern-data-centre-security', 'Security Specialist Intern, Data Centre Security',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe Security Specialist Intern, Data Centre Security is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3191381/security-specialist-intern-data-centre-security', C.Amazon, 1),

  opp('amazon-ux-design-intern-interaction-design', 'UX Design Intern, Interaction Design',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe UX Design Intern, Interaction Design is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3189014/ux-design-intern-interaction-design', C.Amazon, 2),

  opp('amazon-engineering-intern', 'Engineering Intern',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe Engineering Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3083028/engineering-intern', C.Amazon, 3),

  opp('aws-associate-solutions-architect-intern-2026', 'Associate Solutions Architect Intern 2026',
    "Amazon Web Services (AWS) is the world's leading cloud computing platform, offering over 200 fully featured services from data centres globally to millions of customers.\n\nThe Associate Solutions Architect Intern 2026 is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3143769/associate-solutions-architect-intern-2026', C.AWS, 4),

  opp('apple-software-undergrad-engineering-internships', 'Software Undergrad Engineering Internships',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Software Undergrad Engineering Internships is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200664785/software-undergrad-engineering-internships', C.Apple, 5),

  opp('apple-gpu-internship-platform-architecture', 'GPU Internship - Platform Architecture',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe GPU Internship - Platform Architecture is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Cambridge; London; St Albans.",
    'INTERNSHIP', 'Cambridge; London; St Albans', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200617616-2114/gpu-internship-platform-architecture', C.Apple, 6),

  opp('apple-soc-performance-modeling-internship-platform-architect', 'SoC Performance Modeling Internship - Platform Architecture',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe SoC Performance Modeling Internship - Platform Architecture is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200629965-2114/soc-performance-modeling-internship-platform-architecture', C.Apple, 7),

  opp('apple-camera-algorithms-intern', 'Camera Algorithms Intern',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Camera Algorithms Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Cambridge.",
    'INTERNSHIP', 'Cambridge', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200647028-1251/camera-algorithms-intern?team=HRDWR', C.Apple, 8),

  opp('apple-software-engineering-intern-machine-learning-ai-workfl', 'Software Engineering Intern (Machine Learning & AI Workflows)',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Software Engineering Intern (Machine Learning & AI Workflows) is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200655115-1731/software-engineering-intern-machine-learning-ai-workflows?team=HRDWR', C.Apple, 9),

  opp('apple-machine-learning-engineer-nlp-llm-2026-new-grad', 'Machine Learning Engineer - NLP/LLM (2026 New Grad)',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Machine Learning Engineer - NLP/LLM (2026 New Grad) is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200658046-0351/machine-learning-engineer-nlp-llm-2026-new-grad?team=MLAI', C.Apple, 10),

  opp('arm-graduate-engineer-edge-ai-system-performance', 'Graduate Engineer - Edge AI System Performance',
    "Arm designs the CPU architectures that power the vast majority of the world's smartphones, IoT devices, and increasingly cloud servers and AI accelerators.\n\nThe Graduate Engineer - Edge AI System Performance is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Cambridge.",
    'GRADUATE', 'Cambridge', 'HYBRID', true, false,
    'https://careers.arm.com/job/cambridge/graduate-engineer-edge-ai-system-performance/33099/95262406992', C.Arm, 11),

  opp('arm-graduate-engineer-system-performance-team', 'Graduate Engineer - System Performance Team',
    "Arm designs the CPU architectures that power the vast majority of the world's smartphones, IoT devices, and increasingly cloud servers and AI accelerators.\n\nThe Graduate Engineer - System Performance Team is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Cambridge.",
    'GRADUATE', 'Cambridge', 'HYBRID', true, false,
    'https://careers.arm.com/en/job/cambridge/graduate-engineer-system-performance-team/33099/95128344880', C.Arm, 12),

  opp('marshall-wace-technology-intern-london-summer-2026', 'Technology Intern - London - Summer 2026',
    "Marshall Wace is one of Europe's leading hedge funds, managing over $60 billion in assets and combining systematic and discretionary investment strategies powered by proprietary technology.\n\nThe Technology Intern - London - Summer 2026 is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/mwinternshipprogram/jobs/7998360002', C.MarshallWace, 13),

  opp('point72-2026-summer-internship-data-engineer-long-short-equi', '2026 Summer Internship - Data Engineer, Long/Short Equities',
    "Point72 is a global asset management firm managing $30+ billion, blending fundamental research with quantitative and macro strategies across equities, fixed income, and macro.\n\nThe 2026 Summer Internship - Data Engineer, Long/Short Equities is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/point72/jobs/8183047002?gh_jid=8183047002', C.Point72, 14),

  opp('intropic-quantrepreneur-research-analyst', 'Quantrepreneur - Research Analyst',
    "Intropic is a proprietary trading and technology firm building cutting-edge quantitative models and high-performance systems that operate across global financial markets.\n\nThe Quantrepreneur - Research Analyst is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://jobs.lever.co/intropic/a4a5fb03-4a97-4f18-a680-7dd5663955a2', C.Intropic, 15),

  opp('intropic-quantrepreneur-quantitative-developer', 'Quantrepreneur - Quantitative Developer',
    "Intropic is a proprietary trading and technology firm building cutting-edge quantitative models and high-performance systems that operate across global financial markets.\n\nThe Quantrepreneur - Quantitative Developer is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://jobs.lever.co/intropic/1427876a-fb80-4ee1-96da-79cac32a7803', C.Intropic, 16),

  opp('intropic-quantitative-developer', 'Quantitative Developer',
    "Intropic is a proprietary trading and technology firm building cutting-edge quantitative models and high-performance systems that operate across global financial markets.\n\nThe Quantitative Developer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in London.",
    'GRADUATE', 'London', 'HYBRID', false, false,
    'https://jobs.lever.co/intropic/e7f90e06-05e2-40d8-b9f5-df4c96792dd2', C.Intropic, 17),

  opp('qube-research-technologies-2026-internship-data-engineering', '2026 - Internship, Data Engineering',
    "Qube Research & Technologies (QRT) is a quantitative and systematic investment manager operating at the intersection of data science, advanced technology, and global finance.\n\nThe 2026 - Internship, Data Engineering is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Paris; London.",
    'INTERNSHIP', 'Paris; London', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8078338002', C.Qube, 18),

  opp('qube-research-technologies-2026-internship-quantitative-deve', '2026 - Internship, Quantitative Developer',
    "Qube Research & Technologies (QRT) is a quantitative and systematic investment manager operating at the intersection of data science, advanced technology, and global finance.\n\nThe 2026 - Internship, Quantitative Developer is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8068131002', C.Qube, 19),

  opp('qube-research-technologies-2026-internship-quantitative-rese', '2026 - Internship, Quantitative Research/Trading',
    "Qube Research & Technologies (QRT) is a quantitative and systematic investment manager operating at the intersection of data science, advanced technology, and global finance.\n\nThe 2026 - Internship, Quantitative Research/Trading is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London; Paris; Geneva; Zurich.",
    'INTERNSHIP', 'London; Paris; Geneva; Zurich', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8052341002', C.Qube, 20),

  opp('qube-research-technologies-2026-internship-machine-learning-', '2026 - Internship, Machine Learning Engineer',
    "Qube Research & Technologies (QRT) is a quantitative and systematic investment manager operating at the intersection of data science, advanced technology, and global finance.\n\nThe 2026 - Internship, Machine Learning Engineer is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/quberesearchandtechnologies/jobs/8511818002', C.Qube, 21),

  opp('g-research-natural-language-processing-internship', 'Natural Language Processing Internship',
    "G-Research is a leading quantitative research and technology firm, using advanced data analysis and machine learning to generate and capture alpha in financial markets.\n\nThe Natural Language Processing Internship is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://gresearch.wd103.myworkdayjobs.com/en-US/G-Research/job/Natural-Language-Processing-Internship_R3269', C.GResearch, 22),

  opp('guggenheim-securities-2026-investment-banking-intern-technol', '2026 Investment Banking Intern - Technology & Services',
    "Guggenheim Securities is a global investment bank providing advisory, financing, sales, trading, and research services to corporations, governments, and institutional investors.\n\nThe 2026 Investment Banking Intern - Technology & Services is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://guggenheim.wd1.myworkdayjobs.com/en-US/Guggenheim_Careers_Campus/job/XMLNAME-2026-Investment-Banking-Intern---Technology---Services--London-_14631', C.Guggenheim, 23),

  opp('cloudflare-security-engineer-intern-summer-2026', 'Security Engineer Intern (Summer 2026)',
    "Cloudflare is a global cloud services provider making the internet faster, more secure, and more reliable — protecting millions of websites and applications worldwide.\n\nThe Security Engineer Intern (Summer 2026) is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/cloudflare/jobs/7582169', C.Cloudflare, 24),

  opp('cloudflare-grc-team-intern-summer-2026', 'GRC Team Intern (Summer 2026)',
    "Cloudflare is a global cloud services provider making the internet faster, more secure, and more reliable — protecting millions of websites and applications worldwide.\n\nThe GRC Team Intern (Summer 2026) is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/cloudflare/jobs/7577564', C.Cloudflare, 25),

  opp('axon-2026-uk-software-engineering-internship', '2026 UK Software Engineering Internship',
    "Axon is a public safety technology company building connected devices and cloud software — including body cameras, TASER, and AI-powered evidence management platforms.\n\nThe 2026 UK Software Engineering Internship is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/axontalentcommunity/jobs/7122432003', C.Axon, 26),

  opp('deliveroo-software-engineer-intern', 'Software Engineer Intern',
    "Deliveroo is a leading food delivery platform operating across the UK and Europe, building logistics, marketplace, and payments technology at rapid scale.\n\nThe Software Engineer Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://jobs.ashbyhq.com/deliveroo/3e0440a9-7abc-45b0-8520-d3e13083d0f3', C.Deliveroo, 27),

  opp('quantinuum-internship-opportunities-with-quantinuum-2026-uk-', 'Internship Opportunities with Quantinuum 2026 - UK/Germany',
    "Quantinuum is the world's largest integrated quantum computing company, formed from the combination of Honeywell Quantum Solutions and Cambridge Quantum Computing.\n\nThe Internship Opportunities with Quantinuum 2026 - UK/Germany is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London; Cambridge.",
    'INTERNSHIP', 'London; Cambridge', 'HYBRID', true, false,
    'https://jobs.eu.lever.co/quantinuum/dc2f6f9e-b409-4640-807d-0339a12dc3cd', C.Quantinuum, 28),

  opp('pear-vc-software-engineering-intern', 'Software Engineering Intern',
    "Pear VC is an early-stage venture capital firm investing in and partnering with ambitious founders building transformative technology companies from day one.\n\nThe Software Engineering Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://jobs.ashbyhq.com/Pear-VC/781a43c0-a13a-4e27-95a8-0dde6279d33f', C.PearVC, 29),

  opp('lhv-bank-uk-it-infrastructure-platform-services-intern', 'IT Infrastructure / Platform Services Intern',
    "LHV Bank UK is a growing commercial bank and fintech infrastructure provider specialising in banking-as-a-service for financial technology companies across Europe.\n\nThe IT Infrastructure / Platform Services Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://boards.greenhouse.io/lhvuk/jobs/4846825101', C.LHV, 30),

  opp('mastercard-technology-risk-analyst-launch-graduate-program-2', 'Technology Risk Analyst, Launch Graduate Program 2026',
    "Mastercard is a global technology company in the payments industry, enabling secure and seamless digital transactions for billions of people and businesses worldwide.\n\nThe Technology Risk Analyst, Launch Graduate Program 2026 is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in London.",
    'GRADUATE', 'London', 'HYBRID', true, false,
    'https://mastercard.wd1.myworkdayjobs.com/Campus/job/Technology-Risk-Analyst--Launch-Graduate-Program-2026---London--UK_R-256701/apply', C.Mastercard, 31),

  opp('visa-data-engineering-graduate', 'Data Engineering Graduate',
    "Visa is the world's largest payment network, facilitating over 200 billion transactions annually and connecting consumers, businesses, banks, and governments globally.\n\nThe Data Engineering Graduate is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', true, false,
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Data-Engineering-Graduate_REF97107Z-1', C.Visa, 32),

  opp('visa-data-science-graduate', 'Data Science Graduate',
    "Visa is the world's largest payment network, facilitating over 200 billion transactions annually and connecting consumers, businesses, banks, and governments globally.\n\nThe Data Science Graduate is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', true, false,
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Data-Science-Graduate_REF93870J', C.Visa, 33),

  opp('visa-software-engineering-higher-level-4-apprenticeship', 'Software Engineering Higher (Level 4) Apprenticeship',
    "Visa is the world's largest payment network, facilitating over 200 billion transactions annually and connecting consumers, businesses, banks, and governments globally.\n\nThe Software Engineering Higher (Level 4) Apprenticeship is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Reading.",
    'GRADUATE', 'Reading', 'HYBRID', true, false,
    'https://visa.wd5.myworkdayjobs.com/en-US/Visa_Early_Careers/job/Software-Engineering-Higher--Level-4--Apprenticeship_REF97167S', C.Visa, 34),

  opp('mufg-2026-mufg-uk-summer-internship-technology-innovation-ma', '2026 MUFG UK Summer Internship - Technology Innovation Management',
    "MUFG (Mitsubishi UFJ Financial Group) is one of the world's largest financial institutions, with a strong technology innovation practice across banking, securities, and asset management.\n\nThe 2026 MUFG UK Summer Internship - Technology Innovation Management is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://mufgub.wd3.myworkdayjobs.com/en-US/MUFG-Careers/job/London/XMLNAME-2026-MUFG-UK-Summer-Internship-Programme--Technology-Innovation-Management_10072523-WD-1/apply/useMyLastApplication?source=BuiltInNationwide', C.MUFG, 35),

  opp('accenture-accenture-internship-opportunities-june-july-augus', 'Accenture Internship Opportunities (June / July / August 2026 Intake)',
    "Accenture is a global professional services company specialising in digital, cloud, and security solutions, helping clients across every major industry and geography.\n\nThe Accenture Internship Opportunities (June / July / August 2026 Intake) is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://www.accenture.com/gb-en/careers/jobdetails?id=R00276795_en', C.Accenture, 36),

  opp('accenture-infrastructure-capital-projects-graduate-developme', 'Infrastructure & Capital Projects - Graduate Development Program - Data Center Cost Management',
    "Accenture is a global professional services company specialising in digital, cloud, and security solutions, helping clients across every major industry and geography.\n\nThe Infrastructure & Capital Projects - Graduate Development Program - Data Center Cost Management is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Multiple UK Locations.",
    'GRADUATE', 'Multiple UK Locations', 'HYBRID', true, false,
    'https://www.accenture.com/gb-en/careers/jobdetails?id=695a805e-ff4a-437b-bd01-1b9a524bd4c3_en', C.Accenture, 37),

  opp('unisys-projects-technical-support-intern-placement-year-2026', 'Projects Technical Support Intern (Placement Year, 2026 - 2027)',
    "Unisys is a global IT company delivering enterprise technology solutions, digital workplace services, cloud, and infrastructure to public sector and private organisations worldwide.\n\nThe Projects Technical Support Intern (Placement Year, 2026 - 2027) is a year-long industrial placement where you will contribute to real engineering projects alongside experienced professionals, building skills that set you apart when you graduate.\n\nBased in Manchester.",
    'PLACEMENT', 'Manchester', 'HYBRID', false, false,
    'https://unisys.wd5.myworkdayjobs.com/en-US/External/job/Manchester-United-Kingdom/Projects-Technical-Support-Intern--Placement-Year--2026---2027-_REQ571527/apply/autofillWithResume?q=science', C.Unisys, 38),

  opp('pfizer-ai-application-developer-undergraduate', 'AI Application Developer Undergraduate',
    "Pfizer is one of the world's largest pharmaceutical companies, with a growing digital and AI division transforming drug discovery, clinical trials, and healthcare delivery.\n\nThe AI Application Developer Undergraduate is an industrial placement giving you extended hands-on experience in a live technology environment, working on real challenges that matter to the business.\n\nBased in Walton Oaks.",
    'PLACEMENT', 'Walton Oaks', 'HYBRID', true, false,
    'https://pfizer.wd1.myworkdayjobs.com/en-US/pfizercareers/job/United-Kingdom---Walton-Oaks/AI-Application-Developer-Undergraduate_4956412', C.Pfizer, 39),

  opp('aveva-cloud-operations-infrastructure-graduate', 'Cloud Operations & Infrastructure Graduate',
    "AVEVA is a global leader in industrial software, providing engineering and operational technology solutions to help industries achieve operational efficiency and sustainability.\n\nThe Cloud Operations & Infrastructure Graduate is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Cambridge.",
    'GRADUATE', 'Cambridge', 'HYBRID', false, false,
    'https://aveva.wd3.myworkdayjobs.com/en-US/AVEVA_careers/job/Cloud-Developer-Graduate_R011704', C.AVEVA, 40),

  opp('hp-graduate-software-developer-c-2-year-placement', 'Graduate Software Developer (C#) - 2-year Placement',
    "HP Inc. is a global technology company delivering innovations in personal computing, printing, and 3D printing to individuals and enterprises worldwide.\n\nThe Graduate Software Developer (C#) - 2-year Placement is an industrial placement giving you extended hands-on experience in a live technology environment, working on real challenges that matter to the business.\n\nBased in Cambridge.",
    'PLACEMENT', 'Cambridge', 'HYBRID', false, false,
    'https://hp.wd5.myworkdayjobs.com/en-US/ExternalCareerSite/job/Cambridge-Cambridgeshire-United-Kingdom/Graduate-Software-Developer--C----2-year-Placement_3156191-1/apply/autofillWithResume?source=MyGWorks', C.HP, 41),

  opp('graphcore-intern-research', 'Intern - Research',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe Intern - Research is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Bristol; Cambridge; London.",
    'INTERNSHIP', 'Bristol; Cambridge; London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8287389002', C.Graphcore, 42),

  opp('graphcore-2026-graduate-machine-learning-engineer-applied-ai', '2026 Graduate Machine Learning Engineer - Applied AI',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Machine Learning Engineer - Applied AI is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8234675002', C.Graphcore, 43),

  opp('graphcore-2026-graduate-it-infrastructure-engineer', '2026 Graduate IT Infrastructure Engineer',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate IT Infrastructure Engineer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8425273002', C.Graphcore, 44),

  opp('graphcore-2026-graduate-firmware-engineer', '2026 Graduate Firmware Engineer',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Firmware Engineer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8238597002', C.Graphcore, 45),

  opp('graphcore-2026-graduate-software-engineer-drivers', '2026 Graduate Software Engineer - Drivers',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - Drivers is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8238605002', C.Graphcore, 46),

  opp('graphcore-2026-graduate-software-engineer-analysis-tools', '2026 Graduate Software Engineer - Analysis Tools',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - Analysis Tools is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8420657002', C.Graphcore, 47),

  opp('graphcore-2026-graduate-software-engineer-ml-kernels-runtime', '2026 Graduate Software Engineer - ML Kernels & Runtime Team',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - ML Kernels & Runtime Team is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8230202002', C.Graphcore, 48),

  opp('graphcore-2026-graduate-software-engineer-triton', '2026 Graduate Software Engineer - Triton',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - Triton is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8238577002', C.Graphcore, 49),

  opp('graphcore-2026-graduate-software-engineer-ai-ml-test-systems', '2026 Graduate Software Engineer - AI/ML Test Systems',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - AI/ML Test Systems is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8245655002', C.Graphcore, 50),

  opp('graphcore-2026-graduate-software-engineer-devops', '2026 Graduate Software Engineer - DevOps',
    "Graphcore is a Bristol-based AI chip company building Intelligence Processing Units (IPUs) — processors designed from the ground up for machine intelligence workloads.\n\nThe 2026 Graduate Software Engineer - DevOps is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Bristol.",
    'GRADUATE', 'Bristol', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/graphcore/jobs/8282735002', C.Graphcore, 51),

  opp('tpp-graduate-software-developer', 'Graduate Software Developer',
    "TPP (The Phoenix Partnership) is a UK health IT company that builds clinical software used across primary care, pharmacy, social care, and community healthcare settings.\n\nThe Graduate Software Developer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Leeds.",
    'GRADUATE', 'Leeds', 'HYBRID', false, false,
    'https://tpp-careers.com/roles/graduate-software-developer/', C.TPP, 57),

  opp('tpp-graduate-technical-engineer', 'Graduate Technical Engineer',
    "TPP (The Phoenix Partnership) is a UK health IT company that builds clinical software used across primary care, pharmacy, social care, and community healthcare settings.\n\nThe Graduate Technical Engineer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in Leeds.",
    'GRADUATE', 'Leeds', 'HYBRID', false, false,
    'https://tpp-careers.com/roles/graduatetechnicalengineer/', C.TPP, 58),

  opp('tpp-summer-internship-software-developer', 'Summer Internship - Software Developer',
    "TPP (The Phoenix Partnership) is a UK health IT company that builds clinical software used across primary care, pharmacy, social care, and community healthcare settings.\n\nThe Summer Internship - Software Developer is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Leeds.",
    'INTERNSHIP', 'Leeds', 'HYBRID', false, false,
    'https://tpp-careers.com/roles/summer-internship-software-developer/', C.TPP, 59),

  opp('amazon-2026-data-engineering-internship-uk', '2026 Data Engineering Internship - UK',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe 2026 Data Engineering Internship - UK is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3183839/data-engineer-internship-uk-amazon-university-talent-acquisition-auta', C.Amazon, 60),

  opp('amazon-2026-applied-scientist-intern', '2026 Applied Scientist Intern',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe 2026 Applied Scientist Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3182383/2026-applied-scientist-intern-amazon-university-talent-acquisition', C.Amazon, 61),

  opp('amazon-2026-data-scientist-internship', '2026 Data Scientist Internship',
    "Amazon is one of the world's most valuable technology companies, with divisions spanning e-commerce, cloud computing (AWS), AI, and logistics operating at massive scale.\n\nThe 2026 Data Scientist Internship is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://www.amazon.jobs/en-gb/jobs/3125279/2026-data-scientist-internship-amazon-university-talent-acquisition', C.Amazon, 62),

  opp('aws-2026-data-center-technician-intern', '2026 Data Center Technician Intern',
    "Amazon Web Services (AWS) is the world's leading cloud computing platform, offering over 200 fully featured services from data centres globally to millions of customers.\n\nThe 2026 Data Center Technician Intern is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in Greater London (Slough); Hemel Hempstead.",
    'INTERNSHIP', 'Greater London; Hemel Hempstead', 'HYBRID', false, false,
    'https://amazon.jobs/en/jobs/3110268/2026-data-center-technician-intern', C.AWS, 63),

  opp('apple-software-engineering-masters-internships', 'Software Engineering Masters Internships',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Software Engineering Masters Internships is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', false, false,
    'https://jobs.apple.com/en-gb/details/200664320/software-engineering-masters-internships', C.Apple, 64),

  opp('apple-hardware-undergrad-engineering-internships', 'Hardware Undergrad Engineering Internships',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Hardware Undergrad Engineering Internships is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', false, false,
    'https://jobs.apple.com/en-gb/details/200663981-3810/hardware-undergrad-engineering-internships?team=STDNT', C.Apple, 65),

  opp('apple-machine-learning-ai-undergrad-internships', 'Machine Learning and Artificial Intelligence Undergrad Internships',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Machine Learning and Artificial Intelligence Undergrad Internships is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', true, false,
    'https://jobs.apple.com/en-gb/details/200664780-3810/machine-learning-and-artificial-intelligence-undergrad-internships?team=STDNT', C.Apple, 66),

  opp('apple-engineering-program-management-undergrad-internships', 'Engineering Program Management Undergrad Internships',
    "Apple is one of the world's most innovative technology companies, designing hardware, software, and services that define consumer technology — from iPhone to Mac to Apple Silicon.\n\nThe Engineering Program Management Undergrad Internships is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in United Kingdom.",
    'INTERNSHIP', 'United Kingdom', 'HYBRID', false, false,
    'https://jobs.apple.com/en-gb/details/200664330-3810/engineering-program-management-undergrad-internships', C.Apple, 67),

  opp('cloudflare-technical-support-engineer-intern-summer-2026', 'Technical Support Engineer Intern (Summer 2026)',
    "Cloudflare is a global cloud services provider making the internet faster, more secure, and more reliable — protecting millions of websites and applications worldwide.\n\nThe Technical Support Engineer Intern (Summer 2026) is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://job-boards.greenhouse.io/cloudflare/jobs/7726879', C.Cloudflare, 68),

  opp('intropic-quantrepreneur-engineering', 'Quantrepreneur - Engineering',
    "Intropic is a proprietary trading and technology firm building cutting-edge quantitative models and high-performance systems that operate across global financial markets.\n\nThe Quantrepreneur - Engineering is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', false, false,
    'https://jobs.lever.co/intropic/c31c65cc-178d-4a50-bc6a-4f4b057f4381', C.Intropic, 69),

  opp('drw-software-developer-intern-industrial-placement', 'Software Developer Intern - Industrial Placement',
    "DRW is a diversified principal trading firm specialising in electronic market-making and proprietary trading across fixed income, equities, cryptocurrencies, and energy markets.\n\nThe Software Developer Intern - Industrial Placement is a year-long industrial placement where you will contribute to real engineering projects alongside experienced professionals, building skills that set you apart when you graduate.\n\nBased in London.",
    'PLACEMENT', 'London', 'HYBRID', true, false,
    'https://job-boards.greenhouse.io/drwuniversityjobs/jobs/7364884', C.DRW, 70),

  opp('mastercard-software-engineer-intern-summer-2026', 'Software Engineer Intern, Summer 2026',
    "Mastercard is a global technology company in the payments industry, enabling secure and seamless digital transactions for billions of people and businesses worldwide.\n\nThe Software Engineer Intern, Summer 2026 is a paid internship where you will embed in a working team, tackle real technical challenges, and build the practical skills and network that top employers look for.\n\nBased in London.",
    'INTERNSHIP', 'London', 'HYBRID', true, false,
    'https://mastercard.wd1.myworkdayjobs.com/en-US/CorporateCareers/job/Software-Engineer-Intern--Summer-2026---London--UK_R-257373-2/apply/autofillWithResume', C.Mastercard, 71),

  opp('procter-gamble-software-development-industrial-placement-2026', 'Software Development Industrial Placement 2026',
    "Procter & Gamble is one of the world's largest consumer goods companies, with brands like Gillette, Pampers, and Head & Shoulders, and a growing investment in digital technology and AI.\n\nThe Software Development Industrial Placement 2026 is a year-long industrial placement where you will contribute to real engineering projects alongside experienced professionals, building skills that set you apart when you graduate.\n\nBased in United Kingdom.",
    'PLACEMENT', 'United Kingdom', 'HYBRID', false, false,
    'https://pg.wd5.myworkdayjobs.com/en-GB/1000/job/Software-Development-Industrial-Placement-2026_R000147514/apply', C.PG, 72),

  opp('mg-software-engineering-graduate', 'Software Engineering Graduate',
    "M&G is a global savings and investment company with over £340 billion in assets under management, serving customers through insurance, wealth management, and investment products.\n\nThe Software Engineering Graduate is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', false, false,
    'https://mgpru.wd3.myworkdayjobs.com/en-US/mandgprudential/job/Software-Engineering-Graduate_R18162', C.MandG, 73),

  opp('ultra-graduate-software-engineer', 'Graduate Software Engineer',
    "Ultra is a global defence, security, and critical detection technology company delivering specialist capabilities to NATO, Five Eyes, and allied governments worldwide.\n\nThe Graduate Software Engineer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', false, false,
    'https://ultra.wd3.myworkdayjobs.com/en-US/ultra-careers/job/Graduate-Software-Engineer_REQ-11210-2', C.Ultra, 74),

  opp('dxc-graduate-programme-2026', 'DXC Graduate Programme 2026',
    "DXC Technology is a global IT services and consulting company helping clients modernise their technology infrastructure and drive digital transformation at enterprise scale.\n\nThe DXC Graduate Programme 2026 is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in London.",
    'GRADUATE', 'London', 'HYBRID', false, false,
    'https://dxctechnology.wd1.myworkdayjobs.com/en-US/DXCJobs/job/GBR---ENG---LONDON/DXC-Graduate-Programme-2026_51567282', C.DXC, 75),

  opp('motorola-solutions-graduate-software-engineer', 'Graduate Software Engineer',
    "Motorola Solutions is a global leader in mission-critical communications technology — building radios, body cameras, software, and AI-powered video security for public safety organisations.\n\nThe Graduate Software Engineer is a structured early-career programme designed to accelerate your professional development through real responsibility, dedicated mentorship, and exposure to cutting-edge work.\n\nBased in United Kingdom.",
    'GRADUATE', 'United Kingdom', 'HYBRID', false, false,
    'https://motorolasolutions.wd5.myworkdayjobs.com/en-US/Careers/job/Graduate-Software-Engineer_R62287', C.Motorola, 76),

  opp('natwest-tech-insight-experience-women-engineering', 'Tech Insight Experience for Women - Engineering',
    "NatWest Group is one of the UK's largest retail and commercial banks, serving over 19 million customers and investing heavily in technology, digital banking, and engineering talent.\n\nThe Tech Insight Experience for Women - Engineering is a short insight programme giving you direct exposure to the business, industry professionals, and the skills needed to succeed in technology.\n\nBased in London; Edinburgh.",
    'INSIGHT', 'London; Edinburgh', 'HYBRID', true, false,
    'https://jobs.natwestgroup.com/jobs/17568644-tech-insight-experience-for-women-engineering', C.NatWest, 77),

]
