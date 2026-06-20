import { NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

export const dynamic = 'force-dynamic'

export interface ResourceCategory {
  id: string
  label: string
  icon: string
  resources: Resource[]
}

export interface Resource {
  id: string
  title: string
  description: string
  fileUrl?: string
  pages?: string
}

const RESOURCES: ResourceCategory[] = [
  {
    id: 'cv',
    label: 'CV Templates',
    icon: '📄',
    resources: [
      {
        id: 'cv-1page',
        title: '1-Page CV Template',
        description: 'Clean, concise single-page CV - ideal for internships and graduate roles.',
        fileUrl: '/cv-1page.docx',
        pages: '1 page',
      },
      {
        id: 'cv-2page',
        title: '2-Page CV Template',
        description: 'Extended format for candidates with more experience or academic projects.',
        fileUrl: '/cv-2page.docx',
        pages: '2 pages',
      },
    ],
  },
  {
    id: 'cover-letter',
    label: 'Cover Letters',
    icon: '✉️',
    resources: [
      {
        id: 'cover-letter-template',
        title: 'Cover Letter Template',
        description: 'Professional cover letter structure with guidance on what to include for tech roles.',
        fileUrl: '/cover-letter.docx',
      },
    ],
  },
  {
    id: 'cheat-sheets',
    label: 'Cheat Sheets',
    icon: '⚡',
    resources: [
      {
        id: 'cpp-cheatsheet',
        title: 'C++ Cheat Sheet',
        description: 'Quick reference for C++ syntax, operators, pointers, and multithreading.',
        fileUrl: '/sca_cpp_cheatsheet.pdf',
      },
      {
        id: 'python-cheatsheet',
        title: 'Python Cheat Sheet',
        description: 'Essential Python concepts - variables, lists, functions, classes, and more.',
        fileUrl: '/sca_python_cheatsheet.pdf',
      },
      {
        id: 'git-cheatsheet',
        title: 'GitHub/Git Cheat Sheet',
        description: 'Git commands for version control, branches, merging, and collaboration.',
        fileUrl: '/sca_git_cheatsheet.pdf',
      },
      {
        id: 'js-cheatsheet',
        title: 'JavaScript Cheat Sheet',
        description: 'Core JS features - variables, loops, conditionals, strings, and arrays.',
        fileUrl: '/sca_js_cheatsheet.pdf',
      },
      {
        id: 'html-cheatsheet',
        title: 'HTML Cheat Sheet',
        description: 'Complete HTML reference with tags, forms, tables, layouts, and more.',
        fileUrl: '/sca_html_cheatsheet.pdf',
      },
      {
        id: 'linux-cheatsheet',
        title: 'Linux Cheat Sheet',
        description: 'Essential Linux commands for file operations, processes, and system info.',
        fileUrl: '/sca_linux_cheatsheet.pdf',
      },
      {
        id: 'npm-cheatsheet',
        title: 'npm Cheat Sheet',
        description: 'Node Package Manager reference for package management and scripts.',
        fileUrl: '/sca_npm_cheatsheet.pdf',
      },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    icon: '📚',
    resources: [
      {
        id: 'coming-soon',
        title: 'More guides coming soon',
        description: 'Interview prep, LinkedIn tips, application strategies and more.',
      },
    ],
  },
]

export async function GET() {
  return NextResponse.json(RESOURCES, { headers: CORS })
}
