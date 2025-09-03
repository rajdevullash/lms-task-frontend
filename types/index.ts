export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  thumbnail: Array<{
    public_id: string;
    secure_url: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  slug: string;
  moduleNumber: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  _id: string;
  title: string;
  slug: string;
  videoUrl: string;
  pdfNotes: Array<{
    public_id: string;
    secure_url: string;
  }>;
  moduleId: string;
  courseId: string;
  order: number;
  createdAt: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  lockReason?: string;
}

export interface Progress {
  _id: string;
  userId: string;
  courseId: string;
  completedLectures: string[];
  currentLecture: string;
  progressPercentage: number;
  lastAccessed: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

export interface CourseWithProgress extends Course {
  modules: Module[];
  lectures: Lecture[];
  progress: {
    totalLectures: number;
    completedLectures: number;
    progressPercentage: number;
    currentLecture: string;
    lastAccessed: string;
  } | null;
}
