// ============================================================
// SUDURPASHCHIM DIGITAL — Type Definitions
// ============================================================

export type Locale = 'ne' | 'en';

export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export type BilingualText = string | {
  ne?: string;
  en?: string;
};

// -------------------------------------------------------
// District
// -------------------------------------------------------
export interface DistrictTheme {
  primary: string;
  dark: string;
  light: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

export interface DistrictPlace {
  title: BilingualText;
  description: BilingualText;
  category: 'nature' | 'heritage' | 'spiritual' | 'culture';
  image?: string;
  highlight?: string;
}

export interface DistrictCulture {
  folkDance: BilingualText;
  festivals: BilingualText;
  cuisine: BilingualText;
  dialects: BilingualText;
}

export interface DistrictStats {
  area: string;
  population: string;
  headquarters: BilingualText;
  elevation: string;
  palikas: {
    total: number;
    municipalities: number;
    ruralMunicipalities: number;
  };
  majorRivers: BilingualText;
  literacy: string;
}

export interface District {
  id: string;
  slug: string;
  name: BilingualText;
  description: BilingualText;
  history?: BilingualText;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  lang?: 'en' | 'ne';
  translation_missing?: boolean;
  accentColor: string;
  theme?: DistrictTheme;
  stats?: DistrictStats;
  culture?: DistrictCulture;
  places?: DistrictPlace[];
  heroImage: string;
  latitude?: number | null;
  longitude?: number | null;
  storyCount?: number;
  slider_images?: DistrictSliderImage[];
}

export interface DistrictSliderImage {
  id?: number | string;
  image: string;
  caption?: string | BilingualText;
  order?: number;
}

// -------------------------------------------------------
// Category
// -------------------------------------------------------
export interface Category {
  id: string | number;
  slug: string;
  name: BilingualText;
  image?: string | null;
  layout_type?: 'base' | 'news' | 'sports' | 'stay' | 'tourism' | 'politics' | string;
  icon?: string;
  order?: number;
  parent_slug?: string | null;
  /** Present on menu / detail responses */
  parent?: Pick<Category, "id" | "slug" | "name" | "image" | "layout_type"> | null;
  /** Visible sub-categories (menu / detail responses only) */
  children?: Category[];
}

// -------------------------------------------------------
// Author
// -------------------------------------------------------
export interface Author {
  id: string;
  slug: string;
  name: BilingualText;
  bio: BilingualText;
  avatar: string;
  role: string;
  district?: string;
  articleCount?: number;
}

// -------------------------------------------------------
// Article
// -------------------------------------------------------
export interface Article {
  id: string;
  title: BilingualText;
  slug: string | { ne?: string; en?: string };
  excerpt: BilingualText;
  content: BilingualText;
  featuredImage: string;
  imageCaption?: BilingualText;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  lang?: 'en' | 'ne';
  translation_missing?: boolean;
  author: Author;
  category: Category;
  district?: District;
  tags: string[];
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  breaking: boolean;
  popular: boolean;
  readTime?: number;
  views?: number;
  likes?: number;
  commentsCount?: number;
}

// -------------------------------------------------------
// Article Comment
// -------------------------------------------------------
export interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorLocation?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string | null;
  replies?: ArticleComment[];
}

// -------------------------------------------------------
// Video / Shorts
// -------------------------------------------------------
export interface VideoItem {
  id: string;
  title: BilingualText;
  thumbnail: string;
  duration: string;
  views: number;
  publishedAt: string;
  district?: string;
  isShort: boolean;
}

// -------------------------------------------------------
// Photo Story
// -------------------------------------------------------
export interface PhotoStory {
  id: string;
  title: BilingualText;
  description: BilingualText;
  coverImage: string;
  imageCount: number;
  photographer: string;
  publishedAt: string;
  district?: string;
}

// -------------------------------------------------------
// Breaking News
// -------------------------------------------------------
export interface BreakingNews {
  id: string;
  text: BilingualText;
  href: string;
  publishedAt: string;
}

// -------------------------------------------------------
// Hotel & Stay
// -------------------------------------------------------
export interface Amenity {
  id: number;
  name: BilingualText;
  icon?: string;
}

export interface HotelRoom {
  id: number;
  name: BilingualText;
  guests: number;
  bed_type: BilingualText;
  image?: string;
  price?: string | number;
}

export interface HotelGallery {
  id: number;
  image: string;
  caption: BilingualText;
}

export interface HotelNearbyPlace {
  id: number;
  name: BilingualText;
  distance: BilingualText;
}

export interface Hotel {
  id: string | number;
  slug: string;
  name: BilingualText;
  hotel_type: BilingualText;
  category: Category;
  district?: District;
  
  address: BilingualText;
  municipality: BilingualText;
  latitude: string;
  longitude: string;
  
  rating: number;
  reviews_count: number;
  
  hero_image: string;
  
  short_description?: BilingualText;
  about: BilingualText;
  story: BilingualText;
  quote_text?: BilingualText;
  quote_author?: string;
  
  phone1: string;
  phone2?: string;
  email?: string;
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  
  amenities: Amenity[];
  highlights: BilingualText[];
  
  map_url?: string;
  reach_bus: BilingualText;
  reach_airport: BilingualText;
  reach_highway: BilingualText;
  
  rooms: HotelRoom[];
  gallery: HotelGallery[];
  nearby_places: HotelNearbyPlace[];
}
