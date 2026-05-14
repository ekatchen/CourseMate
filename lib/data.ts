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
};

export const tutors: Tutor[] = [
  {
    id: "1",
    name: "Alex Chen",
    program: "Computer Science",
    year: "4th Year",
    bio: "I've been tutoring CS courses for two years. I focus on making concepts click through real examples, not just theory. I know exactly what Western's CS profs test on.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "approved",
    courses: [
      { code: "CS 1026", name: "Foundations of Computer Science I", ratePerHour: 30, grade: "A+" },
      { code: "CS 1027", name: "Foundations of Computer Science II", ratePerHour: 30, grade: "A+" },
      { code: "CS 2210", name: "Data Structures and Analysis", ratePerHour: 35, grade: "A" },
    ],
    reviews: [
      { id: "r1", reviewerName: "Jamie L.", rating: 5, comment: "Alex explained recursion in a way that finally made sense. Went from failing to passing my midterm.", date: "2025-03-10" },
      { id: "r2", reviewerName: "Priya M.", rating: 5, comment: "Super patient and knows the material cold. Would 100% recommend.", date: "2025-02-22" },
      { id: "r3", reviewerName: "Tom W.", rating: 4, comment: "Really helpful for CS 1027. Helped me understand linked lists before the final.", date: "2025-01-15" },
    ],
  },
  {
    id: "2",
    name: "Sarah Okafor",
    program: "Mathematics",
    year: "3rd Year",
    bio: "Math has always come naturally to me and I love helping others see the patterns. I take time to understand where you're stuck before jumping to solutions.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "approved",
    courses: [
      { code: "Calc 1000", name: "Calculus I", ratePerHour: 28, grade: "A+" },
      { code: "Calc 1301", name: "Calculus II", ratePerHour: 28, grade: "A" },
      { code: "Math 1600", name: "Linear Algebra I", ratePerHour: 25, grade: "A" },
    ],
    reviews: [
      { id: "r4", reviewerName: "Daniel R.", rating: 5, comment: "Sarah saved my Calc 1000 mark. She knew exactly which types of problems show up on the Western final.", date: "2025-04-02" },
      { id: "r5", reviewerName: "Mia K.", rating: 5, comment: "Best tutor I've ever had. Clear, fast, and affordable.", date: "2025-03-18" },
    ],
  },
  {
    id: "3",
    name: "Marcus Dubois",
    program: "Biology",
    year: "2nd Year",
    bio: "Just finished first year Bio with a 90+ average. I know the exact diagrams, lab reports, and exam questions Western uses. Happy to help you avoid the mistakes I made.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    status: "approved",
    courses: [
      { code: "Bio 1001", name: "Biology for Science I", ratePerHour: 22, grade: "A" },
      { code: "Bio 1002", name: "Biology for Science II", ratePerHour: 22, grade: "A-" },
      { code: "Chem 1301", name: "Introductory Chemistry I", ratePerHour: 24, grade: "A-" },
    ],
    reviews: [
      { id: "r6", reviewerName: "Aisha T.", rating: 4, comment: "Really knows Bio 1001 inside out. Helped me with the ecology unit which was giving me a lot of trouble.", date: "2025-02-28" },
      { id: "r7", reviewerName: "Luke P.", rating: 5, comment: "Marcus explained the Chem 1301 lab reports perfectly. My grade went up a full letter.", date: "2025-01-30" },
    ],
  },
  {
    id: "4",
    name: "Nadia Petrov",
    program: "Economics",
    year: "3rd Year",
    bio: "I tutor Econ and Business courses with a focus on exam prep. I've taken every first and second year Econ course at Western and know what the professors actually test on.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia",
    status: "approved",
    courses: [
      { code: "Econ 1021", name: "Principles of Microeconomics", ratePerHour: 25, grade: "A+" },
      { code: "Econ 1022", name: "Principles of Macroeconomics", ratePerHour: 25, grade: "A" },
      { code: "Bus 1220", name: "Introduction to Business", ratePerHour: 22, grade: "A" },
    ],
    reviews: [
      { id: "r8", reviewerName: "Chloe B.", rating: 5, comment: "Nadia made supply and demand graphs finally click. Got an 88 on my midterm after one session.", date: "2025-03-25" },
      { id: "r9", reviewerName: "Ryan S.", rating: 5, comment: "Great tutor for Econ 1021. She knows exactly what Tombe tests on.", date: "2025-02-10" },
      { id: "r10", reviewerName: "Fatima H.", rating: 4, comment: "Helpful for Econ 1022, especially the macro models. Would book again.", date: "2025-01-20" },
    ],
  },
  {
    id: "5",
    name: "James Nguyen",
    program: "Engineering",
    year: "3rd Year",
    bio: "Eng Sci and Physics tutor. I scored in the top 5% of my first year cohort and now help other eng students get through the hardest first-year courses.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    status: "approved",
    courses: [
      { code: "Physics 1028", name: "Physics for the Biological Sciences I", ratePerHour: 30, grade: "A+" },
      { code: "Physics 1029", name: "Physics for the Biological Sciences II", ratePerHour: 30, grade: "A" },
      { code: "Eng 1022", name: "Engineering Statics", ratePerHour: 32, grade: "A+" },
      { code: "Calc 1000", name: "Calculus I", ratePerHour: 28, grade: "A" },
    ],
    reviews: [
      { id: "r11", reviewerName: "Sophie W.", rating: 5, comment: "James got me through Physics 1028. His practice problems were harder than the actual exam, which was the point.", date: "2025-04-01" },
      { id: "r12", reviewerName: "Omar A.", rating: 4, comment: "Solid tutor for Eng 1022. Made the moment/torque concepts clear with good diagrams.", date: "2025-03-05" },
    ],
  },
  {
    id: "6",
    name: "Emma Larson",
    program: "Psychology",
    year: "4th Year",
    bio: "Psychology tutor with 3 years of experience helping students navigate Western's Psych department. I know all the key theories, researchers, and the exact essay formats profs expect.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "approved",
    courses: [
      { code: "Psych 1000", name: "Introduction to Psychology", ratePerHour: 20, grade: "A+" },
      { code: "Psych 2042", name: "Abnormal Psychology", ratePerHour: 22, grade: "A" },
      { code: "Psych 2800", name: "Research Methods in Psychology", ratePerHour: 25, grade: "A" },
    ],
    reviews: [
      { id: "r13", reviewerName: "Lily C.", rating: 5, comment: "Emma helped me structure my Psych essays properly. My grades improved immediately.", date: "2025-03-20" },
      { id: "r14", reviewerName: "Noah J.", rating: 5, comment: "Psych 1000 was overwhelming until I found Emma. She breaks the massive content down really well.", date: "2025-02-14" },
      { id: "r15", reviewerName: "Grace T.", rating: 5, comment: "Best psych tutor at Western. Has notes from every year going back to 2022.", date: "2025-01-08" },
    ],
  },
];

export function getAllCourses(): string[] {
  const codes = new Set<string>();
  tutors.forEach((t) => t.courses.forEach((c) => codes.add(c.code)));
  return Array.from(codes).sort();
}

export function getTutorsByCoursCode(code: string): Tutor[] {
  return tutors.filter(
    (t) =>
      t.status === "approved" &&
      t.courses.some((c) => c.code.toLowerCase() === code.toLowerCase())
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
