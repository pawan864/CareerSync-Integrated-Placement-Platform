/**
 * CareerSync Stakeholder Workflows Data
 * Detailed end-to-end workflows for Students, Faculty, TPO, and Recruiter
 */

export const roleWorkflows = {
  student: {
    id: "student",
    title: "Student Journey",
    roleName: "Students",
    subtitle: "From Profile Building & AI Skill Scoring to Receiving Dream Corporate Offers",
    badge: "Candidate Lifecycle",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    gradient: "from-blue-600 to-indigo-700",
    highlightColor: "text-blue-600",
    stepBorder: "border-blue-500",
    summary: "CareerSync provides students with AI-powered resume enhancement, automated skill matching, 1-click applications, and direct interview notifications from top verified hiring partners.",
    steps: [
      {
        step: 1,
        title: "Profile Creation & AI Resume Parsing",
        description: "Sign up and upload your existing resume. Our AI automatically extracts your core skills, academic coursework, GitHub repositories, and certifications into a standardized corporate-ready profile.",
        highlight: "AI Resume Parsing & Auto-Fill"
      },
      {
        step: 2,
        title: "Skill Gap Analysis & Readiness Index",
        description: "Benchmark your technical stack against real-time industry job descriptions. Receive an instant readiness score along with targeted skill recommendations and suggested projects to close gaps.",
        highlight: "Automated Skill Match Score"
      },
      {
        step: 3,
        title: "Smart Recommendations & 1-Click Apply",
        description: "Browse verified campus drives and curated external openings matched to your eligibility. Apply with a single click without manually filling repetitive application forms.",
        highlight: "Zero-Redundancy 1-Click Applications"
      },
      {
        step: 4,
        title: "Interview Scheduling & Live Tracking",
        description: "Receive instant notifications for online assessments and video interview slots directly on your dashboard. Monitor round-by-round progress with real-time feedback.",
        highlight: "Real-Time Interview Tracker"
      },
      {
        step: 5,
        title: "Offer Acceptance & Alumni Network",
        description: "Accept verified offer letters digitally, notify your campus TPO automatically, and gain lifetime access to the CareerSync alumni mentorship network.",
        highlight: "Digital Offer Rollout & Mentorship"
      }
    ]
  },

  faculty: {
    id: "faculty",
    title: "Faculty Mentorship Workflow",
    roleName: "Faculty",
    subtitle: "Student Mentorship, Academic Verification & Departmental Placement Analytics",
    badge: "Mentorship & Verification",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    gradient: "from-purple-600 to-indigo-700",
    highlightColor: "text-purple-600",
    stepBorder: "border-purple-500",
    summary: "Faculty mentors can track student technical progress, endorse academic projects, verify eligibility criteria, and collaborate with the TPO to boost departmental placement records.",
    steps: [
      {
        step: 1,
        title: "Batch & Departmental Roster Access",
        description: "Log into the faculty portal with verified institutional credentials to access enrolled student cohorts, academic CGPAs, attendance metrics, and domain specializations.",
        highlight: "Synced Institutional Roster"
      },
      {
        step: 2,
        title: "Project Endorsements & Skill Validation",
        description: "Review students' capstone projects, lab coursework, and research papers. Provide official verified endorsements that boost student profile credibility on corporate dashboards.",
        highlight: "Official Faculty Endorsements"
      },
      {
        step: 3,
        title: "Eligibility & Backlog Verification",
        description: "Confirm and sign off on academic eligibility, cleared backlogs, and minimum attendance thresholds required for institutional placement participation.",
        highlight: "Automated Academic Sign-off"
      },
      {
        step: 4,
        title: "At-Risk Student Identification",
        description: "Utilize AI placement analytics to pinpoint students lagging in readiness scores or drive shortlists. Initiate targeted counseling sessions and remedial workshops.",
        highlight: "Early Intervention Analytics"
      },
      {
        step: 5,
        title: "Accreditation & Curriculum Insights",
        description: "Access annual placement outcome reports and industry skill demand trends to update academic curriculum for NBA, NAAC, and NIRF institutional accreditations.",
        highlight: "NIRF & NAAC Audit Exports"
      }
    ]
  },

  tpo: {
    id: "tpo",
    title: "TPO Placement Office Workflow",
    roleName: "TPO",
    subtitle: "Complete Drive Automation, Corporate Coordination & Institutional Placement Operations",
    badge: "Placement Operations",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-600 to-teal-700",
    highlightColor: "text-emerald-600",
    stepBorder: "border-emerald-500",
    summary: "Training & Placement Officers eliminate spreadsheets by automating recruiter invitations, eligibility shortlisting, drive slotting, and official NIRF placement audits in one hub.",
    steps: [
      {
        step: 1,
        title: "Recruiter Onboarding & Drive Setup",
        description: "Invite verified corporate hiring partners, review JD requirements, CTC slabs, and establish physical or virtual campus placement schedules seamlessly.",
        highlight: "Centralized Corporate Onboarding"
      },
      {
        step: 2,
        title: "Automated Criteria-Based Shortlisting",
        description: "Apply strict institutional criteria (CGPA cutoffs, zero active backlogs, passing years, branch filters) to instantly generate verified candidate pools in seconds.",
        highlight: "100% Error-Free Instant Shortlists"
      },
      {
        step: 3,
        title: "Drive Coordination & Slot Allocation",
        description: "Schedule online aptitude tests, technical rounds, and interview rooms. Send automated SMS and email reminders to eligible students with test links and schedules.",
        highlight: "Automated Student Broadcasts"
      },
      {
        step: 4,
        title: "Multi-Offer Policy & Offer Letter Audit",
        description: "Enforce institutional placement policies (e.g., dream offer tiering, single-offer cap) and audit official offer letters to ensure fair placement distribution across batches.",
        highlight: "Fair-Policy Offer Enforcement"
      },
      {
        step: 5,
        title: "Institutional Placement Reports & NIRF Data",
        description: "Generate one-click comprehensive placement statistics, average CTC graphs, branch-wise placement percentages, and accreditation-ready NIRF/NAAC documentation.",
        highlight: "1-Click Accreditation Exports"
      }
    ]
  },

  recruiter: {
    id: "recruiter",
    title: "Corporate Recruiter Workflow",
    roleName: "Recruiter",
    subtitle: "Direct Campus Access, AI Candidate Matching & High-Velocity Technical Hiring",
    badge: "Talent Acquisition",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    gradient: "from-amber-600 to-orange-700",
    highlightColor: "text-amber-600",
    stepBorder: "border-amber-500",
    summary: "Recruiters bypass recruitment agency fees and unverified resumes by directly accessing top verified campus talent with skill match scoring and automated interview scheduling.",
    steps: [
      {
        step: 1,
        title: "Registration & University Drive Linking",
        description: "Register corporate credentials, verify company domain, and connect directly with partner universities and autonomous institutions across India.",
        highlight: "Verified Corporate Account"
      },
      {
        step: 2,
        title: "Job Requisition & Skill Matrix Definition",
        description: "Publish vacancies with detailed technical requirements, coding stack prerequisites, compensation details, and preferred engineering specializations.",
        highlight: "Role & Skill Specification"
      },
      {
        step: 3,
        title: "AI Candidate Vetting & Pool Discovery",
        description: "Filter through verified student profiles scored by CareerSync's AI matching engine. Review verified GitHub repos, project demos, and faculty endorsements directly.",
        highlight: "Pre-Vetted AI Ranked Candidates"
      },
      {
        step: 4,
        title: "Assessment & Interview Coordination",
        description: "Dispatch online coding challenges and conduct 1-on-1 virtual video interviews directly within the CareerSync platform. Collaborate on shared evaluation rubrics.",
        highlight: "Integrated Assessment Suite"
      },
      {
        step: 5,
        title: "Digital Offer Rollout & Joining Management",
        description: "Issue digital offer letters directly to selected candidates, track real-time student acceptance statuses, and coordinate pre-joining formalities with the campus TPO.",
        highlight: "Instant Digital Offer Issuance"
      }
    ]
  }
};
