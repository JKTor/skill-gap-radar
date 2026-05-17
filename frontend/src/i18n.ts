export type Lang = 'th' | 'en'

export const t = {
  th: {
    // Nav
    navGuide: 'วิธีใช้',
    navRadar: 'วิเคราะห์ทักษะ',

    // HowToUse — hero
    heroTitle: 'Skill-Gap Radar',
    heroSubtitle: 'เครื่องมือวิเคราะห์ช่องว่างทักษะของคุณ\nเทียบกับตลาดงานจริงในประเทศไทย',
    heroBtn: 'เริ่มใช้งานเลย →',

    // HowToUse — sections
    whatTitle: 'เว็บนี้คืออะไร?',
    whatBody: 'Skill-Gap Radar ช่วยให้คุณรู้ว่า ทักษะที่มีอยู่ตอนนี้ห่างจากตำแหน่งงานที่อยากได้แค่ไหน โดยเปรียบเทียบกับข้อมูลงานจริงจากบริษัทชั้นนำในไทย เช่น KBank, Agoda, Bitkub, AIS และแนะนำ course ที่ช่วยปิด gap ได้เร็วที่สุด',

    howTitle: 'วิธีใช้งาน',
    step1Title: 'เลือก Target Role',
    step1Body: 'พิมพ์หรือเลือกตำแหน่งงานที่อยากได้ใน dropdown ด้านซ้าย เช่น "Data Scientist", "Blockchain Developer"',
    step2Title: 'ติ๊กทักษะที่มีอยู่แล้ว',
    step2Body: 'เลือกทักษะที่คุณมีในส่วน "Your skills" ด้านซ้าย ระบบจะคำนวณ gap ให้อัตโนมัติทันที',
    step3Title: 'ดูผลวิเคราะห์',
    step3Body: 'Skill radar — แสดงระดับทักษะของคุณเทียบกับที่ตลาดต้องการ\nSkill gaps — รายการทักษะที่ขาด เรียงจากสำคัญมากสุด\nReadiness % — คะแนนความพร้อมโดยรวม',
    step4Title: 'เรียน course ที่แนะนำ',
    step4Body: 'ระบบเลือก course ที่ปิด gap ได้มากที่สุดก่อน พร้อม rating, ราคา และลิงก์ไปยัง platform จริง',

    metricsTitle: 'ตัวเลขหมายความว่าอะไร?',
    metric1Title: 'Gap Score',
    metric1Body: '0% = ทักษะครบ ไม่มี gap\n100% = ทักษะขาดทั้งหมด\nยิ่งน้อยยิ่งดี',
    metric2Title: 'Readiness %',
    metric2Body: '75%+ = พร้อม apply ได้เลย\nต่ำกว่า 75% = ควรฝึกเพิ่มก่อน',
    metric3Title: 'Gap Bar',
    metric3Body: 'แถบสีเข้ม = ระดับที่ตลาดต้องการ\nแถบสีอ่อน = ระดับที่คุณมี\nระยะห่าง = gap ที่ต้องปิด',

    dataTitle: 'ข้อมูลมาจากไหน?',
    dataBody: 'ข้อมูลงานและ course รวบรวมจากตลาดงานไทยและ platform เรียนออนไลน์ชั้นนำ ครอบคลุมสาย FinTech, Cloud, Cybersecurity, AI/ML และ Frontend Development',
    ctaBottom: 'เริ่มวิเคราะห์ทักษะของคุณ →',

    // Radar page — sidebar
    targetRole: 'Target role',
    allIndustries: 'ทั้งหมด',
    searchPlaceholder: 'ค้นหาตำแหน่งงาน…',
    loadingRoles: 'กำลังโหลด…',
    yourSkills: 'Your skills',
    selectedCount: (n: number) => `เลือกแล้ว ${n} ทักษะ`,
    filterSkills: 'กรองทักษะ...',
    noSkillsFound: 'ไม่พบทักษะ',

    // Radar page — header
    targetScan: 'Target scan',
    matchingJobs: (n: number) => `${n} ตำแหน่งงานที่ตรงกันในตลาด`,
    backendOffline: 'Backend ออฟไลน์ — Mock mode',
    selectRole: 'เลือกตำแหน่งงานเพื่อวิเคราะห์',
    backendLabel: 'Backend',
    checking: 'กำลังตรวจสอบ…',
    mockMode: 'Mock mode',
    readinessLabel: 'Readiness',
    gapScoreLabel: 'Gap score',

    // Radar page — panels
    demandVsProfile: 'Demand vs profile',
    skillRadar: 'Skill radar',
    largestGap: 'ทักษะที่ขาดมากสุด',
    marketFit: 'ความพร้อมตลาด',
    readyToApply: 'พร้อม apply ได้เลย',
    needsPrep: 'ควรฝึกเพิ่มก่อน',
    suggestedSprint: 'Sprint ที่แนะนำ',
    weeks: '4 สัปดาห์',
    focusSkills: (n: number) => `${n} ทักษะหลัก`,
    priorityList: 'Priority list',
    skillGaps: 'Skill gaps',
    nextActions: 'Next actions',
    recommendedCourses: 'Course แนะนำ',
    free: 'ฟรี',
    covers: 'ครอบคลุม:',
    emptyGap: (role: string) => `ไม่พบ skill gap สำหรับ "${role}" ด้วยทักษะที่เลือกไว้`,

    // Stats page
    navStats: 'ผู้เข้าชม',
    statsTitle: 'สถิติผู้เข้าชม',
    statsSubtitle: 'จำนวนคนที่เข้ามาใช้ Skill-Gap Radar',
    statTotal: 'ผู้เข้าชมทั้งหมด',
    statToday: 'วันนี้',
    statWeek: '7 วันที่ผ่านมา',
    statChart: '7 วันย้อนหลัง',
    statsLoading: 'กำลังโหลดสถิติ…',
    statsError: 'ไม่สามารถโหลดสถิติได้',
  },

  en: {
    // Nav
    navGuide: 'How to Use',
    navRadar: 'Analyse Skills',

    // HowToUse — hero
    heroTitle: 'Skill-Gap Radar',
    heroSubtitle: 'Analyse the gap between your current skills\nand real job market demand in Thailand',
    heroBtn: 'Get Started →',

    // HowToUse — sections
    whatTitle: 'What is this?',
    whatBody: 'Skill-Gap Radar tells you exactly how far your current skills are from the role you want, benchmarked against real job listings from top Thai companies like KBank, Agoda, Bitkub, and AIS — then recommends the fastest courses to close those gaps.',

    howTitle: 'How to Use',
    step1Title: 'Pick a Target Role',
    step1Body: 'Type or select the job title you\'re aiming for in the dropdown on the left — e.g. "Data Scientist", "Blockchain Developer".',
    step2Title: 'Tick Your Current Skills',
    step2Body: 'Select the skills you already have. The system recalculates your gap instantly on every change.',
    step3Title: 'Read Your Analysis',
    step3Body: 'Skill radar — your skill levels vs. what the market requires.\nSkill gaps — missing skills ranked by priority.\nReadiness % — your overall readiness score.',
    step4Title: 'Follow Course Recommendations',
    step4Body: 'The system surfaces courses that close the most gaps first, complete with ratings, price, and direct links to the platform.',

    metricsTitle: 'What do the numbers mean?',
    metric1Title: 'Gap Score',
    metric1Body: '0% = no gaps at all\n100% = all skills missing\nLower is better',
    metric2Title: 'Readiness %',
    metric2Body: '75%+ = ready to apply now\nBelow 75% = needs more prep',
    metric3Title: 'Gap Bar',
    metric3Body: 'Dark bar = market requirement\nLight bar = your current level\nDistance = gap to close',

    dataTitle: 'Where does the data come from?',
    dataBody: 'Job and course data is sourced from the Thai job market and leading online learning platforms, covering FinTech, Cloud, Cybersecurity, AI/ML, and Frontend Development.',
    ctaBottom: 'Analyse Your Skills →',

    // Radar page — sidebar
    targetRole: 'Target role',
    allIndustries: 'All',
    searchPlaceholder: 'Search role…',
    loadingRoles: 'Loading…',
    yourSkills: 'Your skills',
    selectedCount: (n: number) => `${n} selected`,
    filterSkills: 'Filter skills...',
    noSkillsFound: 'No skills found',

    // Radar page — header
    targetScan: 'Target scan',
    matchingJobs: (n: number) => `${n} matching job${n !== 1 ? 's' : ''} in market`,
    backendOffline: 'Backend offline — mock mode',
    selectRole: 'Select a role to analyse',
    backendLabel: 'Backend',
    checking: 'Checking…',
    mockMode: 'Mock mode',
    readinessLabel: 'Readiness',
    gapScoreLabel: 'Gap score',

    // Radar page — panels
    demandVsProfile: 'Demand vs profile',
    skillRadar: 'Skill radar',
    largestGap: 'Largest gap',
    marketFit: 'Market fit',
    readyToApply: 'Ready to apply',
    needsPrep: 'Needs focused prep',
    suggestedSprint: 'Suggested sprint',
    weeks: '4 weeks',
    focusSkills: (n: number) => `${n} focus skill${n !== 1 ? 's' : ''}`,
    priorityList: 'Priority list',
    skillGaps: 'Skill gaps',
    nextActions: 'Next actions',
    recommendedCourses: 'Recommended courses',
    free: 'Free',
    covers: 'Covers:',
    emptyGap: (role: string) => `No skill gaps found for "${role}" with your current selection`,

    // Stats page
    navStats: 'Visitors',
    statsTitle: 'Visitor Stats',
    statsSubtitle: 'People who have used Skill-Gap Radar',
    statTotal: 'Total visitors',
    statToday: 'Today',
    statWeek: 'Last 7 days',
    statChart: 'Last 7 days',
    statsLoading: 'Loading stats…',
    statsError: 'Could not load stats',
  },
} as const
