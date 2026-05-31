export interface Service {
  id: number;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  forWho: string;
  includes: IncludeItem[];
  steps: StepItem[];
  tiers: Tier[];
  priceNote?: string;
  sortOrder: number;
  published: boolean;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  ogImage?: string;
  focusKey?: string;
  canonical?: string;
  noindex: boolean;
  updatedAt: string;
}

export interface IncludeItem { title: string; desc: string; }
export interface StepItem { n: string; title: string; desc: string; }
export interface Tier {
  name: string;
  priceLabel: string;
  desc: string;
  features: string[];
  isPopular: boolean;
  cta: string;
}

export interface Case {
  id: number;
  slug: string;
  title: string;
  h1: string;
  sub: string;
  tags: string[];
  year: number;
  term?: string;
  client?: string;
  direction: string;
  isFeatured: boolean;
  cover?: string;
  gallery?: GalleryItem[];
  stack: string[];
  taskText: string;
  solutionItems: string[];
  resultMetrics: Metric[];
  closingText?: string;
  sortOrder: number;
  status: string;
  seoTitle?: string;
  seoDesc?: string;
  ogImage?: string;
  focusKey?: string;
  canonical?: string;
  noindex: boolean;
  updatedAt: string;
}

export interface GalleryItem { mediaId: string; caption?: string; }
export interface Metric { mv: string; mk: string; }

export interface FaqCategory {
  id: number;
  title: string;
  icon?: string;
  sortOrder: number;
  items: FaqItem[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  categoryId: number;
  sortOrder: number;
  published: boolean;
}

export interface Testimonial {
  id: number;
  type: 'scan' | 'text' | 'video' | 'photo';
  image?: string;
  company?: string;
  year?: number;
  quote?: string;
  authorName?: string;
  authorRole?: string;
  avatar?: string;
  rating?: number;
  poster?: string;
  videoUrl?: string;
  gridSize?: string;
  sortOrder: number;
  published: boolean;
}

export interface Lead {
  id: number;
  name: string;
  contact: string;
  service?: string;
  message?: string;
  sourcePage?: string;
  utm?: Record<string, string>;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  thumbUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType: string;
  createdAt: string;
}

export interface Settings {
  id: string;
  value: string;
}

export interface Redirect {
  id: number;
  from: string;
  to: string;
  code: number;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
