export type Review = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
};

export type TutorCourse = {
  code: string;
  name: string;
  ratePerHour: number;
  grade?: string;
};

export type Tutor = {
  id: string;
  name: string;
  program: string;
  year: string;
  bio: string;
  photoUrl: string;
  courses: TutorCourse[];
  reviews: Review[];
  status: "approved" | "pending";
  // Optional fields — populated from Supabase; undefined for static demo tutors
  sessionFormat?: "online" | "in_person" | "both";
  availabilityText?: string;
  teachingStyle?: string;
  calendlyUrl?: string;
  campusLocationPreference?: string;
  onlineMeetingPreference?: string;
};

export const tutors: Tutor[] = [
  {
    id: "1",
    name: "Alex Chen",
    program: "Computer Science",
    year: "4th Year",
    bio: "I've been tutoring CS courses for two years. I focus on building understanding through worked examples and practice problems. I'm familiar with how these courses are structured and what students typically find difficult.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "approved",
    courses: [
      { code: "CS 1026", name: "Foundations of Computer Science I", ratePerHour: 30, grade: "A+" },
      { code: "CS 1027", name: "Foundations of Computer Science II", ratePerHour: 30, grade: "A+" },
      { code: "CS 2210", name: "Data Structures and Analysis", ratePerHour: 35, grade: "A" },
    ],
    reviews: [
      { id: "r1", reviewerName: "Jamie L.", rating: 5, comment: "Clear explanations and useful practice questions. Helped me understand recursion properly.", date: "2025-03-10" },
      { id: "r2", reviewerName: "Priya M.", rating: 5, comment: "Patient and thorough. Good at walking through problems step by step.", date: "2025-02-22" },
      { id: "r3", reviewerName: "Tom W.", rating: 4, comment: "Helpful for CS 1027. Made linked lists much clearer before the final.", date: "2025-01-15" },
    ],
  },
  {
    id: "2",
    name: "Sarah Okafor",
    program: "Mathematics",
    year: "3rd Year",
    bio: "I focus on helping students work through problems methodically rather than memorising steps. I take time to identify where the confusion is before jumping to solutions.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "approved",
    courses: [
      { code: "Calc 1000", name: "Calculus I", ratePerHour: 28, grade: "A+" },
      { code: "Calc 1301", name: "Calculus II", ratePerHour: 28, grade: "A" },
      { code: "Math 1600", name: "Linear Algebra I", ratePerHour: 25, grade: "A" },
    ],
    reviews: [
      { id: "r4", reviewerName: "Daniel R.", rating: 5, comment: "Helpful for reviewing problem-solving steps before the midterm. Explained the material clearly.", date: "2025-04-02" },
      { id: "r5", reviewerName: "Mia K.", rating: 5, comment: "Good at breaking down difficult concepts. Sessions were focused and efficient.", date: "2025-03-18" },
    ],
  },
  {
    id: "3",
    name: "Marcus Dubois",
    program: "Biology",
    year: "2nd Year",
    bio: "Recently completed first-year Biology and Chemistry. I'm familiar with the structure of these courses and can help with concepts, lab prep, and working through practice material.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    status: "approved",
    courses: [
      { code: "Bio 1001", name: "Biology for Science I", ratePerHour: 22, grade: "A" },
      { code: "Bio 1002", name: "Biology for Science II", ratePerHour: 22, grade: "A-" },
      { code: "Chem 1301", name: "Introductory Chemistry I", ratePerHour: 24, grade: "A-" },
    ],
    reviews: [
      { id: "r6", reviewerName: "Aisha T.", rating: 4, comment: "Helped me understand the ecology unit more clearly. Good at explaining the weekly material.", date: "2025-02-28" },
      { id: "r7", reviewerName: "Luke P.", rating: 5, comment: "Explained the lab report format well. Made the course feel more manageable.", date: "2025-01-30" },
    ],
  },
  {
    id: "4",
    name: "Nadia Petrov",
    program: "Economics",
    year: "3rd Year",
    bio: "I tutor Econ and introductory Business courses. I focus on exam prep, concept clarity, and working through practice problems. I've completed all the first and second-year Econ courses.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia",
    status: "approved",
    courses: [
      { code: "Econ 1021", name: "Principles of Microeconomics", ratePerHour: 25, grade: "A+" },
      { code: "Econ 1022", name: "Principles of Macroeconomics", ratePerHour: 25, grade: "A" },
      { code: "Bus 1220", name: "Introduction to Business", ratePerHour: 22, grade: "A" },
    ],
    reviews: [
      { id: "r8", reviewerName: "Chloe B.", rating: 5, comment: "Explained supply and demand clearly. Helped me work through the problem sets before the midterm.", date: "2025-03-25" },
      { id: "r9", reviewerName: "Ryan S.", rating: 5, comment: "Good tutor for Econ 1021. Structured sessions well and was easy to follow.", date: "2025-02-10" },
      { id: "r10", reviewerName: "Fatima H.", rating: 4, comment: "Helpful for Econ 1022, particularly the macro models. Would book again.", date: "2025-01-20" },
    ],
  },
  {
    id: "5",
    name: "James Nguyen",
    program: "Engineering",
    year: "3rd Year",
    bio: "I tutor Engineering and Physics courses. I find worked examples the most effective way to build understanding, and I focus on making sure the fundamentals are clear before moving to harder problems.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    status: "approved",
    courses: [
      { code: "Physics 1028", name: "Physics for the Biological Sciences I", ratePerHour: 30, grade: "A+" },
      { code: "Physics 1029", name: "Physics for the Biological Sciences II", ratePerHour: 30, grade: "A" },
      { code: "Eng 1022", name: "Engineering Statics", ratePerHour: 32, grade: "A+" },
      { code: "Calc 1000", name: "Calculus I", ratePerHour: 28, grade: "A" },
    ],
    reviews: [
      { id: "r11", reviewerName: "Sophie W.", rating: 5, comment: "Explained the structure of Physics 1028 clearly and provided useful practice problems.", date: "2025-04-01" },
      { id: "r12", reviewerName: "Omar A.", rating: 4, comment: "Helpful for Eng 1022. Good diagrams and clear explanations of moment and torque.", date: "2025-03-05" },
    ],
  },
  {
    id: "6",
    name: "Emma Larson",
    program: "Psychology",
    year: "4th Year",
    bio: "I've completed most of the Psychology course sequence and tutor both introductory and upper-year courses. I help students work through lecture material, structure essays, and prepare for assessments.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "approved",
    courses: [
      { code: "Psych 1000", name: "Introduction to Psychology", ratePerHour: 20, grade: "A+" },
      { code: "Psych 2042", name: "Abnormal Psychology", ratePerHour: 22, grade: "A" },
      { code: "Psych 2800", name: "Research Methods in Psychology", ratePerHour: 25, grade: "A" },
    ],
    reviews: [
      { id: "r13", reviewerName: "Lily C.", rating: 5, comment: "Helped me structure my essays more clearly. Useful feedback and practical advice.", date: "2025-03-20" },
      { id: "r14", reviewerName: "Noah J.", rating: 5, comment: "Good at breaking down the Psych 1000 content. Made the course feel more manageable.", date: "2025-02-14" },
      { id: "r15", reviewerName: "Grace T.", rating: 5, comment: "Well-organised sessions and explained concepts clearly. Easy to follow.", date: "2025-01-08" },
    ],
  },
];

// ─── Search helpers ──────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchesCourseQuery(query: string, code: string, name: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  const qNoSpace = q.replace(/\s/g, "");
  const codeNorm = normalize(code);
  const codeNoSpace = codeNorm.replace(/\s/g, "");
  const nameNorm = normalize(name);

  // Match code with or without space: "CS1026" matches "CS 1026"
  if (codeNoSpace.includes(qNoSpace) || qNoSpace.includes(codeNoSpace)) return true;
  // Partial code with spaces: "calc 1" matches "Calc 1000"
  if (codeNorm.includes(q)) return true;
  // Course name: "micro" matches "Principles of Microeconomics"
  if (nameNorm.includes(q)) return true;

  return false;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

export function getAllCourses(): string[] {
  const codes = new Set<string>();
  tutors.forEach((t) => t.courses.forEach((c) => codes.add(c.code)));
  return Array.from(codes).sort();
}

export function getTutorsByCourseCode(query: string): Tutor[] {
  return tutors.filter(
    (t) =>
      t.status === "approved" &&
      t.courses.some((c) => matchesCourseQuery(query, c.code, c.name))
  );
}

export function getTutorById(id: string): Tutor | undefined {
  return tutors.find((t) => t.id === id);
}

export function getAverageRating(tutor: Tutor): number {
  if (tutor.reviews.length === 0) return 0;
  const sum = tutor.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / tutor.reviews.length) * 10) / 10;
}

export function getLowestRate(tutor: Tutor): number {
  return Math.min(...tutor.courses.map((c) => c.ratePerHour));
}
