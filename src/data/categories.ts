import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'c1', slug: 'politics',   name: { ne: 'राजनीति',   en: 'Politics'   }, icon: '🏛️', image: null },
  { id: 'c2', slug: 'society',    name: { ne: 'समाज',      en: 'Society'    }, icon: '👥', image: null },
  { id: 'c3', slug: 'economy',    name: { ne: 'अर्थतन्त्र', en: 'Economy'    }, icon: '📈', image: null },
  { id: 'c4', slug: 'education',  name: { ne: 'शिक्षा',    en: 'Education'  }, icon: '📚', image: null },
  { id: 'c5', slug: 'health',     name: { ne: 'स्वास्थ्य', en: 'Health'     }, icon: '🏥', image: null },
  { id: 'c6', slug: 'sports',     name: { ne: 'खेलकुद',   en: 'Sports'     }, icon: '⚽', image: null },
  { id: 'c7', slug: 'culture',    name: { ne: 'संस्कृति',  en: 'Culture'    }, icon: '🎭', image: null },
  { id: 'c8', slug: 'tourism',    name: { ne: 'पर्यटन',    en: 'Tourism'    }, icon: '🏔️', image: null },
  { id: 'c9', slug: 'opinion',    name: { ne: 'विचार',     en: 'Opinion'    }, icon: '✍️', image: null },
  { id: 'c10', slug: 'agriculture', name: { ne: 'कृषि',    en: 'Agriculture'}, icon: '🌾', image: null },
  { id: 'c11', slug: 'technology', name: { ne: 'प्रविधि',  en: 'Technology' }, icon: '💻', image: null },
  { id: 'c12', slug: 'national',  name: { ne: 'राष्ट्रिय', en: 'National'   }, icon: '🇳🇵', image: null },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
export { CATEGORY_DESCRIPTIONS } from "./category_descriptions";
