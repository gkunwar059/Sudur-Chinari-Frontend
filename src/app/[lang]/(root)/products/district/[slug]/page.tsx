import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight, Search } from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { newsApi } from "@/lib/api";
import { t } from "@/lib/utils";
import { DISTRICTS as FALLBACK_DISTRICTS } from "@/data/districts";
import { getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { buildMetadata } from "@/lib/seo";
import ProductContributionModal from "@/components/products/ProductContributionModal";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return FALLBACK_DISTRICTS.flatMap((d) => [
    { lang: "en", slug: d.slug },
    { lang: "ne", slug: d.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const apiDistrict =
    (await newsApi
      .getDistrictsServer(locale)
      .then((res) => res?.results?.find((d: any) => d.slug === slug))
      .catch(() => null)) ?? null;
  const district = mergeDistrict(apiDistrict, getDistrictBySlug(slug));

  if (!district) return {};

  const districtName = t(district.name, locale);
  const title =
    locale === "ne"
      ? `${districtName}का स्थानीय उत्पादनहरू`
      : `Local Products of ${districtName}`;
  const description =
    locale === "ne"
      ? `${districtName} जिल्लाका मौलिक कृषि तथा स्थानीय उत्पादनहरू र किसानहरूको जानकारी।`
      : `Discover authentic local produce and agriculture from ${districtName} district.`;

  return buildMetadata({
    locale,
    path: `/products/district/${slug}`,
    title,
    description,
    image: district.heroImage,
  });
}

const CATEGORIES = [
  { id: "all", label: { ne: "सबै", en: "All" }, icon: "🛒" },
  { id: "dairy", label: { ne: "दुग्धजन्य", en: "Dairy" }, icon: "🥛" },
  { id: "grains", label: { ne: "अन्न/धान्य", en: "Grains" }, icon: "🌾" },
  { id: "fruits", label: { ne: "फलफूल", en: "Fruits" }, icon: "🍎" },
  { id: "spices", label: { ne: "मसला/जडीबुटी", en: "Spices" }, icon: "🌿" },
];

const PRODUCTS = [
  // Dairy
  {
    slug: "ghee",
    name: { ne: "घ्यू", en: "Ghee" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 12,
    desc: {
      ne: "स्थानीय गाई/भैंसीको शुद्ध घ्यू",
      en: "Pure local cow/buffalo ghee",
    },
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "milk",
    name: { ne: "दुध", en: "Milk" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 45,
    desc: {
      ne: "ताजा र पौष्टिक गाईको दुध",
      en: "Fresh and nutritious cow milk",
    },
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "chhurpi",
    name: { ne: "छुर्पी", en: "Chhurpi" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 15,
    desc: {
      ne: "परम्परागत तरिकाले बनाएको छुर्पी",
      en: "Traditionally made hard cheese",
    },
    image:
      "https://images.unsplash.com/photo-1620603706059-4d6a63200dc8?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "butter",
    name: { ne: "मक्खन", en: "Butter" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 22,
    desc: { ne: "ताजा घरको मक्खन", en: "Fresh homemade butter" },
    image:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "yogurt",
    name: { ne: "दही", en: "Yogurt" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 34,
    desc: { ne: "बाक्लो परम्परागत दही", en: "Thick traditional yogurt" },
    image:
      "https://images.unsplash.com/photo-1571212515416-fec0eb9941a3?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "paneer",
    name: { ne: "पनिर", en: "Paneer" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 18,
    desc: { ne: "ताजा पनिर", en: "Fresh cottage cheese" },
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "mohi",
    name: { ne: "मोही", en: "Buttermilk" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 28,
    desc: { ne: "परम्परागत मोही", en: "Traditional buttermilk" },
    image:
      "https://images.unsplash.com/photo-1625937712144-ec859eb56811?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "cheese",
    name: { ne: "याक चिज", en: "Yak Cheese" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 9,
    desc: { ne: "हिमाली याकको चिज", en: "Himalayan yak cheese" },
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=600&auto=format&fit=crop",
  },

  // Grains
  {
    slug: "millet",
    name: { ne: "कोदो", en: "Millet" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 32,
    desc: {
      ne: "उच्च पहाडी भेगमा फलेको कोदो",
      en: "High altitude grown millet",
    },
    image:
      "https://images.unsplash.com/photo-1582845876007-88544a49ed5d?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "corn",
    name: { ne: "मकै", en: "Corn" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 56,
    desc: {
      ne: "स्थानीय जातको अग्र्यानिक मकै",
      en: "Local variety organic corn",
    },
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "rice",
    name: { ne: "स्थानीय चामल", en: "Local Rice" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 89,
    desc: { ne: "बास्नादार स्थानीय चामल", en: "Aromatic local rice" },
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "wheat",
    name: { ne: "गहुँ", en: "Wheat" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 74,
    desc: { ne: "अग्र्यानिक गहुँ", en: "Organic wheat grains" },
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "buckwheat",
    name: { ne: "फापर", en: "Buckwheat" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 41,
    desc: { ne: "पौष्टिक फापर", en: "Nutritious buckwheat" },
    image:
      "https://images.unsplash.com/photo-1621245892523-a5c7beff77b4?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "barley",
    name: { ne: "जौ", en: "Barley" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 25,
    desc: { ne: "हिमाली जौ", en: "Mountain grown barley" },
    image:
      "https://images.unsplash.com/photo-1542010589005-d1eabd394997?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "beans",
    name: { ne: "सिमी", en: "Local Beans" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 63,
    desc: { ne: "पौष्टिक स्थानीय सिमी", en: "Nutritious local beans" },
    image:
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "soybean",
    name: { ne: "भटमास", en: "Soybean" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 48,
    desc: { ne: "अग्र्यानिक भटमास", en: "Organic soybean" },
    image:
      "https://images.unsplash.com/photo-1599818819266-03704efc73df?q=80&w=600&auto=format&fit=crop",
  },

  // Fruits
  {
    slug: "apple",
    name: { ne: "स्याउ", en: "Apple" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 112,
    desc: { ne: "हिमाली स्याउ", en: "Himalayan crisp apples" },
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "orange",
    name: { ne: "सुन्तला", en: "Orange" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 86,
    desc: { ne: "गुलियो स्थानीय सुन्तला", en: "Sweet local oranges" },
    image:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "lemon",
    name: { ne: "कागती", en: "Lemon" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 54,
    desc: { ne: "ताजा स्थानीय कागती", en: "Fresh local lemons" },
    image:
      "https://images.unsplash.com/photo-1590502593747-422e17eb79f4?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "pear",
    name: { ne: "नासपाती", en: "Pear" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 37,
    desc: { ne: "रसिलो स्थानीय नासपाती", en: "Juicy local pears" },
    image:
      "https://images.unsplash.com/photo-1614707663200-a2468307dbab?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "peach",
    name: { ne: "आरु", en: "Peach" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 29,
    desc: { ne: "गुलियो अग्र्यानिक आरु", en: "Sweet organic peaches" },
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "plum",
    name: { ne: "आलुबखडा", en: "Plum" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 21,
    desc: { ne: "ताजा आलुबखडा", en: "Fresh plums" },
    image:
      "https://images.unsplash.com/photo-1602498456745-e9503b30470b?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "walnut",
    name: { ne: "ओखर", en: "Walnut" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 15,
    desc: { ne: "पहाडी ओखर", en: "Mountain walnuts" },
    image:
      "https://images.unsplash.com/photo-1597463098670-658b5e6792dc?q=80&w=600&auto=format&fit=crop",
  },

  // Spices
  {
    slug: "honey",
    name: { ne: "मह", en: "Honey" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 8,
    desc: { ne: "प्राकृतिक र शुद्ध भिर मह", en: "Natural cliff honey" },
    image:
      "https://images.unsplash.com/photo-1587049352847-4d4b12736173?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "ginger",
    name: { ne: "अदुवा", en: "Ginger" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 67,
    desc: { ne: "अग्र्यानिक ताजा अदुवा", en: "Organic fresh ginger" },
    image:
      "https://images.unsplash.com/photo-1596472714264-577bf6957723?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "turmeric",
    name: { ne: "बेसार", en: "Turmeric" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 82,
    desc: { ne: "शुद्ध स्थानीय बेसार", en: "Pure local turmeric" },
    image:
      "https://images.unsplash.com/photo-1615486171448-4fb62c668ba0?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "garlic",
    name: { ne: "लसुन", en: "Garlic" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 59,
    desc: { ne: "स्थानीय लसुन", en: "Strong local garlic" },
    image:
      "https://images.unsplash.com/photo-1588696680456-11f8e1378f8d?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "chili",
    name: { ne: "सुकेको खुर्सानी", en: "Dry Chili" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 43,
    desc: { ne: "पिरो हिमाली खुर्सानी", en: "Spicy mountain chili" },
    image:
      "https://images.unsplash.com/photo-1574345431698-f2b1d6837eb5?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "cardamom",
    name: { ne: "अलैंची", en: "Cardamom" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 26,
    desc: { ne: "उच्च स्तरको अलैंची", en: "Premium black cardamom" },
    image:
      "https://images.unsplash.com/photo-1604085444697-7e9b04877dc1?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "timur",
    name: { ne: "टिमुर", en: "Sichuan Pepper" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 14,
    desc: { ne: "बास्नादार हिमाली टिमुर", en: "Aromatic mountain pepper" },
    image:
      "https://images.unsplash.com/photo-1596706439247-5a18a66fbc4b?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "mustard",
    name: { ne: "तोरी", en: "Mustard Seeds" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 31,
    desc: { ne: "स्थानीय तोरी", en: "Local mustard seeds" },
    image:
      "https://images.unsplash.com/photo-1581076939768-4a7b539c941e?q=80&w=600&auto=format&fit=crop",
  },
];

export default async function DistrictProductsPage({
  params,
  searchParams,
}: Props) {
  const { lang, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;
  const currentCategory =
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : "all";

  const searchQuery =
    typeof resolvedSearchParams?.q === "string"
      ? resolvedSearchParams.q.toLowerCase()
      : "";

  let filteredProducts =
    currentCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.categoryId === currentCategory);

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.en.toLowerCase().includes(searchQuery) ||
        p.name.ne.toLowerCase().includes(searchQuery) ||
        p.desc.en.toLowerCase().includes(searchQuery) ||
        p.desc.ne.toLowerCase().includes(searchQuery),
    );
  }

  let district: any = { name: { ne: "अछाम", en: "Achham" }, slug: slug };
  try {
    const apiDistricts = await newsApi.getDistrictsServer(locale);
    const found = apiDistricts?.results?.find((d: any) => d.slug === slug);
    if (found) district = found;
  } catch (error) {}

  const districtName = t(district.name, locale);

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      {/* Breadcrumb */}
      <FTBreadcrumb
        locale={locale}
        items={[
          {
            name: locale === "ne" ? "सुदूर उत्पादन" : "Local Products",
            href: "/products",
          },
          { name: districtName },
        ]}
      />

      {/* Editorial Header & Categories */}
      <div className="border-b border-border relative overflow-hidden">
        <div className="container-editorial pt-4 pb-6 sm:pt-6 sm:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary mb-2 uppercase tracking-wider">
                {locale === "ne"
                  ? "कृषि तथा स्थानीय उत्पादन"
                  : "Agriculture & Local Products"}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                {districtName} {locale === "ne" ? "उत्पादनहरू" : "Products"}
              </h1>
              <p className="text-base text-muted-foreground font-sans mt-2 leading-relaxed">
                {locale === "ne"
                  ? `${districtName} जिल्लाका किसान र उत्पादकहरूद्वारा उत्पादित अर्गानिक तथा स्थानीय उत्पादनहरूको डिजिटल सूची।`
                  : `A digital directory of organic and local products cultivated by farmers and producers in ${districtName} district.`}
              </p>

              {/* Search Field */}
              <div className="mt-8">
                <form
                  method="GET"
                  action={`/products/district/${slug}`}
                  className="relative w-full max-w-md"
                >
                  {currentCategory !== "all" && (
                    <input
                      type="hidden"
                      name="category"
                      value={currentCategory}
                    />
                  )}
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    name="q"
                    defaultValue={
                      typeof resolvedSearchParams?.q === "string"
                        ? resolvedSearchParams.q
                        : ""
                    }
                    placeholder={
                      locale === "ne"
                        ? "उत्पादन खोज्नुहोस्..."
                        : "Search products..."
                    }
                    className="w-full bg-surface border border-border pl-11 pr-4 py-3 text-base font-sans focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand rounded-none shadow-sm text-foreground placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface hover:bg-surface-hover text-foreground px-3 py-1.5 text-xs font-bold border border-border transition-colors"
                  >
                    {locale === "ne" ? "खोज्नुहोस्" : "Search"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side: Stats & Ad */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 shrink-0 w-full lg:w-auto lg:self-end">
              {/* Advertisement Placeholder */}
              <div className="flex items-center justify-center w-full sm:w-1/2 lg:w-[320px] min-h-[100px] bg-surface border border-dashed border-border select-none">
                <span className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase font-bold">
                  {locale === "ne" ? "विज्ञापन" : "Advertisement"}
                </span>
              </div>

              {/* Stats Box */}
              <div className="flex flex-col w-full sm:w-1/2 lg:w-auto bg-surface border border-border border-t-4 border-t-brand shadow-sm shrink-0">
                <div className="flex items-center gap-5 p-4 sm:px-6 sm:py-5 justify-center w-full">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-foreground leading-snug">
                      {slug.length * 15 + 120}+
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                      {locale === "ne" ? "स्थानीय किसान" : "Local Farmers"}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-border"></div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-foreground leading-snug">
                      {slug.length * 3 + 15}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                      {locale === "ne" ? "मुख्य उत्पादन" : "Core Products"}
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                  <ProductContributionModal buttonClassName="w-full bg-transparent border border-brand text-brand font-bold py-2.5 px-4 text-sm hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Categories & Search */}
      <div className="bg-surface border-b border-border py-2 sm:py-3">
        <div className="container-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="overflow-x-auto no-scrollbar flex-1">
            <div className="flex gap-4">
              {CATEGORIES.map((cat, i) => {
                const isActive = currentCategory === cat.id;
                return (
                  <Link
                    key={cat.id}
                    href={`/products/district/${slug}?category=${cat.id}`}
                    className={`flex flex-col items-center min-w-[80px] p-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-brand/10 text-brand font-bold"
                        : "text-muted-foreground hover:bg-surface hover:text-brand"
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-xs">{t(cat.label, locale)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-editorial py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/district/${slug}/${product.slug}`}
              className="editorial-card-bordered rounded-none overflow-hidden group flex flex-col h-full border border-border border-t-4 border-t-brand bg-card"
            >
              <div className="relative h-48 overflow-hidden bg-surface border-b border-border">
                <Image
                  src={product.image}
                  alt={t(product.name, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-brand uppercase tracking-wider border border-border">
                  {t(product.category, locale)}
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold font-headline text-xl text-foreground group-hover:text-brand transition-colors">
                    {t(product.name, locale)}
                  </h3>
                  <div className="flex items-center gap-1.5 bg-surface px-2 py-1 border border-border">
                    <span className="text-xs font-bold text-brand-secondary">
                      {product.farmerCount}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">
                      {locale === "ne" ? "किसानहरू" : "Farmers"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {t(product.desc, locale)}
                </p>
                <div className="mt-4 pt-3 border-t border-dotted border-border text-xs font-bold text-brand flex items-center justify-between">
                  <span>
                    {locale === "ne" ? "विवरण हेर्नुहोस्" : "View Details"}
                  </span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
