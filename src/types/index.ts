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
  id?: number | string;
  district?: number | string;
  district_slug?: string;
  slug?: string;
  title: BilingualText;
  description: BilingualText;
  category: 'nature' | 'heritage' | 'spiritual' | 'culture';
  image?: string;
  highlight?: BilingualText;
  overview?: BilingualText;
  history?: BilingualText;
  location?: BilingualText;
  elevation?: BilingualText;
  area_or_size?: BilingualText;
  best_time_to_visit?: BilingualText;
  opening_hours?: BilingualText;
  entry_fee?: BilingualText;
  weather_summary?: BilingualText;
  how_to_reach?: BilingualText;
  latitude?: number | null;
  longitude?: number | null;
  festivals?: BilingualText;
  local_cuisine?: BilingualText;
  traditions?: BilingualText;
  languages?: BilingualText;
  travel_advisory?: BilingualText;
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
  parent_id?: number | null;
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
  createdAt?: string;
  created_at?: string;
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
  id: string | number;
  title: BilingualText;
  thumbnail: string;
  duration: string;
  views: number;
  likes?: number;
  has_liked?: boolean;
  publishedAt: string;
  district?: string | District;
  isShort: boolean;
  youtube_id?: string;
  video_url?: string;
}

// -------------------------------------------------------
// Photo Story
// -------------------------------------------------------
export interface PhotoStory {
  id: string | number;
  title: BilingualText;
  description: BilingualText;
  coverImage: string;
  imageCount: number;
  photographer: string;
  publishedAt: string;
  district?: string | District;
  images?: Array<{ id: number; image: string; caption?: string; order?: number }>;
}

// -------------------------------------------------------
// Breaking News
// -------------------------------------------------------
export interface BreakingNews {
  id: string | number;
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

// -------------------------------------------------------
// Partner
// -------------------------------------------------------
export interface Partner {
  id: number | string;
  name: BilingualText;
  role?: BilingualText;
  image?: string | null;
  url?: string | null;
  district?: number | string | District | null;
  district_slug?: string | null;
  district_name?: string | null;
}

// -------------------------------------------------------
// Popup Ad
// -------------------------------------------------------
export interface PopupAd {
  id: number | string;
  title: BilingualText;
  image: string;
  target_url: string;
  advertiser?: string;
  duration_seconds: number;
  is_active: boolean;
}

// -------------------------------------------------------
// User Account
// -------------------------------------------------------
export interface User {
  id: number | string;
  email: string;
  username: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
}

// -------------------------------------------------------
// Homepage Placements
// -------------------------------------------------------
export interface HomePagePlacement {
  id: number | string;
  section_name: string;
  articles: Article[];
}

// -------------------------------------------------------
// Sitemap Item
// -------------------------------------------------------
export interface SitemapItem {
  type: 'article' | 'district' | 'category' | string;
  slug: string;
  updated_at: string;
  has_ne: boolean;
}

// -------------------------------------------------------
// Hero Slide
// -------------------------------------------------------
export interface HeroSlide {
  id: number | string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  image?: string | null;
  image_url?: string | null;
  article?: number | null;
  article_slug?: string | null;
  article_title?: string | null;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
