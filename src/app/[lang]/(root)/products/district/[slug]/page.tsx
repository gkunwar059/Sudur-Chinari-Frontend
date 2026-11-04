import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/i18n/LocalizedLink";
import {
  ArrowRight,
  Layers,
  Leaf,
  MapPin,
  Search,
  SearchX,
  Sprout,
  X,
} from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import type { BilingualText } from "@/types";
import { getDistrictsCached } from "@/lib/cached-data";
import { localizedPath } from "@/lib/i18n/paths";
import { t } from "@/lib/utils";
import { DISTRICTS as FALLBACK_DISTRICTS } from "@/data/districts";
import { getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { buildMetadata } from "@/lib/seo";
import ProductContributionModal from "@/components/products/ProductContributionModal";
import ProductImage from "@/components/products/ProductImage";
import PageSkeleton from "@/components/common/PageSkeleton";
import { newsApi } from "@/lib/api";

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
    image: "",
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
    image: "",
  },
  {
    slug: "paneer",
    name: { ne: "पनिर", en: "Paneer" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 18,
    desc: { ne: "ताजा पनिर", en: "Fresh cottage cheese" },
    image: "",
  },
  {
    slug: "mohi",
    name: { ne: "मोही", en: "Buttermilk" },
    category: { ne: "दुग्धजन्य", en: "Dairy" },
    categoryId: "dairy",
    farmerCount: 28,
    desc: { ne: "परम्परागत मोही", en: "Traditional buttermilk" },
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
  },
  {
    slug: "barley",
    name: { ne: "जौ", en: "Barley" },
    category: { ne: "अन्न/धान्य", en: "Grains" },
    categoryId: "grains",
    farmerCount: 25,
    desc: { ne: "हिमाली जौ", en: "Mountain grown barley" },
    image: "",
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
    image: "",
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
    image: "",
  },
  {
    slug: "pear",
    name: { ne: "नासपाती", en: "Pear" },
    category: { ne: "फलफूल", en: "Fruits" },
    categoryId: "fruits",
    farmerCount: 37,
    desc: { ne: "रसिलो स्थानीय नासपाती", en: "Juicy local pears" },
    image: "",
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
    image: "",
  },

  // Spices
  {
    slug: "honey",
    name: { ne: "मह", en: "Honey" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 8,
    desc: { ne: "प्राकृतिक र शुद्ध भिर मह", en: "Natural cliff honey" },
    image: "",
  },
  {
    slug: "ginger",
    name: { ne: "अदुवा", en: "Ginger" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 67,
    desc: { ne: "अग्र्यानिक ताजा अदुवा", en: "Organic fresh ginger" },
    image: "",
  },
  {
    slug: "turmeric",
    name: { ne: "बेसार", en: "Turmeric" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 82,
    desc: { ne: "शुद्ध स्थानीय बेसार", en: "Pure local turmeric" },
    image: "",
  },
  {
    slug: "garlic",
    name: { ne: "लसुन", en: "Garlic" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 59,
    desc: { ne: "स्थानीय लसुन", en: "Strong local garlic" },
    image: "",
  },
  {
    slug: "chili",
    name: { ne: "सुकेको खुर्सानी", en: "Dry Chili" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 43,
    desc: { ne: "पिरो हिमाली खुर्सानी", en: "Spicy mountain chili" },
    image: "",
  },
  {
    slug: "cardamom",
    name: { ne: "अलैंची", en: "Cardamom" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 26,
    desc: { ne: "उच्च स्तरको अलैंची", en: "Premium black cardamom" },
    image: "",
  },
  {
    slug: "timur",
    name: { ne: "टिमुर", en: "Sichuan Pepper" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 14,
    desc: { ne: "बास्नादार हिमाली टिमुर", en: "Aromatic mountain pepper" },
    image: "",
  },
  {
    slug: "mustard",
    name: { ne: "तोरी", en: "Mustard Seeds" },
    category: { ne: "मसला/जडीबुटी", en: "Spices" },
    categoryId: "spices",
    farmerCount: 31,
    desc: { ne: "स्थानीय तोरी", en: "Local mustard seeds" },
    image: "",
  },
];

export default function DistrictProductsPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <DistrictProductsPageContent
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}

async function DistrictProductsPageContent({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const requestedCategory =
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : "all";
  const currentCategory = CATEGORIES.some(
    (category) => category.id === requestedCategory,
  )
    ? requestedCategory
    : "all";

  const rawSearchQuery =
    typeof resolvedSearchParams?.q === "string"
      ? resolvedSearchParams.q.trim()
      : "";
  const searchQuery = rawSearchQuery.toLowerCase();
  // Fetch live products from backend for this district
  let allProducts: any[] = [];
  try {
    const apiProductsResponse = await newsApi
      .getProductsServer({ district__slug: slug }, locale)
      .catch(() => null);
    if (apiProductsResponse?.results && apiProductsResponse.results.length > 0) {
      allProducts = apiProductsResponse.results.map((item: any) => ({
        slug: item.slug,
        name:
          typeof item.name === "object"
            ? item.name
            : { ne: item.name, en: item.name_en || item.name },
        category:
          typeof item.category_name === "object"
            ? item.category_name
            : {
                ne: item.category_name || "अन्य",
                en: item.category_slug || "Other",
              },
        categoryId: item.category_slug || "dairy",
        farmerCount: item.producer_count ?? 1,
        desc:
          typeof item.description === "object"
            ? item.description
            : {
                ne: item.description || "",
                en: item.description_en || item.description || "",
              },
        image: item.image || "",
      }));
    }
  } catch (e) {
    allProducts = [];
  }

  const categoryCounts = allProducts.reduce<Record<string, number>>(
    (counts, product) => {
      counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  let filteredProducts =
    currentCategory === "all"
      ? allProducts
      : allProducts.filter((product) => product.categoryId === currentCategory);

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.en?.toLowerCase().includes(searchQuery) ||
        product.name.ne?.toLowerCase().includes(searchQuery) ||
        product.desc.en?.toLowerCase().includes(searchQuery) ||
        product.desc.ne?.toLowerCase().includes(searchQuery),
    );
  }

  let district: any = { name: { ne: "अछाम", en: "Achham" }, slug: slug };
  try {
    const apiDistricts = await getDistrictsCached(locale);
    const found = apiDistricts?.results?.find((item) => item.slug === slug);
    if (found) district = found;
  } catch (error) {}

  const districtName = t(district.name, locale);
  const activeCategory =
    CATEGORIES.find((category) => category.id === currentCategory) ??
    CATEGORIES[0];
  const activeCategoryLabel = t(activeCategory.label, locale);
  const directoryPath = `/products/district/${slug}`;

  const buildHref = (categoryId: string) => {
    const params = new URLSearchParams();
    if (categoryId !== "all") params.set("category", categoryId);
    if (rawSearchQuery) params.set("q", rawSearchQuery);
    const query = params.toString();
    return query ? `${directoryPath}?${query}` : directoryPath;
  };

  const searchAction = `${localizedPath(locale, directoryPath)}${
    currentCategory !== "all" ? `?category=${currentCategory}` : ""
  }`;

  const resultsHeading = rawSearchQuery
    ? locale === "ne"
      ? `“${rawSearchQuery}” का नतिजा`
      : `Results for “${rawSearchQuery}”`
    : currentCategory === "all"
      ? locale === "ne"
        ? "सबै स्थानीय उत्पादनहरू"
        : "All local products"
      : activeCategoryLabel;

  const emptyStateHref = rawSearchQuery
    ? buildHref(currentCategory)
    : buildHref("all");

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
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

      <section className="relative overflow-hidden border-b border-border bg-surface/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-secondary/5 blur-3xl"
        />

        <div className="container-editorial relative py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-brand">
                <Leaf size={14} aria-hidden="true" />
                <span>
                  {locale === "ne"
                    ? "कृषि तथा स्थानीय उत्पादन"
                    : "Agriculture & Local Products"}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
                {locale === "ne" ? `${districtName}का ` : `${districtName} `}
                <span className="text-brand">
                  {locale === "ne" ? "उत्पादनहरू" : "Products"}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-sans leading-relaxed text-muted-foreground sm:text-base">
                {locale === "ne"
                  ? `${districtName} जिल्लाका किसान र उत्पादकहरूद्वारा उत्पादित अर्गानिक तथा स्थानीय उत्पादनहरूको डिजिटल सूची।`
                  : `A digital directory of organic and local products cultivated by farmers and producers in ${districtName} district.`}
              </p>

              <form
                method="GET"
                action={searchAction}
                className="mt-7 max-w-xl"
              >
                {currentCategory !== "all" && (
                  <input
                    type="hidden"
                    name="category"
                    value={currentCategory}
                  />
                )}
                <div className="flex h-12 overflow-hidden border border-border bg-background shadow-sm transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                  <Search
                    size={18}
                    aria-hidden="true"
                    className="ml-4 shrink-0 self-center text-muted-foreground"
                  />
                  <input
                    type="text"
                    name="q"
                    defaultValue={rawSearchQuery}
                    placeholder={
                      locale === "ne"
                        ? "उत्पादन खोज्नुहोस्..."
                        : "Search products..."
                    }
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
                  />
                  {rawSearchQuery && (
                    <Link
                      href={buildHref(currentCategory)}
                      aria-label={
                        locale === "ne" ? "खोजी हटाउनुहोस्" : "Clear search"
                      }
                      className="flex shrink-0 items-center px-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X size={16} />
                    </Link>
                  )}
                  <button
                    type="submit"
                    className="m-1 inline-flex shrink-0 items-center justify-center gap-2 bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
                  >
                    <Search
                      size={14}
                      className="sm:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">
                      {locale === "ne" ? "खोज्नुहोस्" : "Search"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="flex flex-1 flex-col border border-border border-t-4 border-t-brand bg-background p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {locale === "ne" ? "जिल्ला प्रोफाइल" : "District snapshot"}
                  </span>
                  <MapPin size={16} className="text-brand" aria-hidden="true" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-3xl font-black leading-none text-foreground">
                      {PRODUCTS.length}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {locale === "ne" ? "स्थानीय उत्पादन" : "Local products"}
                    </span>
                  </div>
                  <div className="border-l border-border pl-4">
                    <span className="block text-3xl font-black leading-none text-foreground">
                      {CATEGORIES.length - 1}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {locale === "ne" ? "विधाहरू" : "Categories"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <ProductContributionModal
                    defaultDistrict={district.slug}
                    buttonClassName="flex w-full items-center justify-center gap-2 border border-brand bg-transparent px-4 py-2.5 text-sm font-bold text-brand transition-all hover:bg-brand hover:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex min-h-[88px] items-center justify-center border border-dashed border-border bg-background/70 px-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-muted-foreground">
                  {locale === "ne" ? "विज्ञापन" : "Advertisement"}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="container-editorial py-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5">
              {CATEGORIES.map((category) => {
                const isActive = currentCategory === category.id;
                const count =
                  category.id === "all"
                    ? allProducts.length
                    : (categoryCounts[category.id] ?? 0);

                return (
                  <Link
                    key={category.id}
                    href={buildHref(category.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 border px-3.5 py-2 text-sm font-bold transition-colors ${
                      isActive
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <span aria-hidden="true" className="text-base">
                      {category.icon}
                    </span>
                    <span>{t(category.label, locale)}</span>
                    <span
                      className={`min-w-5 px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="shrink-0 text-xs text-muted-foreground font-sans sm:text-right">
              <span className="font-mono font-bold text-foreground">
                {filteredProducts.length}
              </span>{" "}
              {locale === "ne"
                ? "उत्पादन भेटियो"
                : filteredProducts.length === 1
                  ? "product found"
                  : "products found"}
            </p>
          </div>
        </div>
      </section>

      <section className="container-editorial py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Directory
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">
              {resultsHeading}
            </h2>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
            <Layers size={13} aria-hidden="true" />
            {locale === "ne"
              ? "कृषि तथा स्थानीय उत्पादन सूची"
              : "Agriculture & local produce directory"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/60 px-6 py-20 text-center">
            <SearchX
              size={32}
              className="mx-auto mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-base text-muted-foreground font-sans">
              {rawSearchQuery
                ? locale === "ne"
                  ? `“${rawSearchQuery}” सँग मिल्ने उत्पादन भेटिएन।`
                  : `No products match “${rawSearchQuery}”.`
                : locale === "ne"
                  ? "यो विधामा उत्पादन भेटिएन।"
                  : "No products found in this category."}
            </p>
            <Link
              href={emptyStateHref}
              className="mt-5 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-brand/40 hover:bg-surface hover:text-brand"
            >
              {rawSearchQuery
                ? locale === "ne"
                  ? "खोजी हटाउनुहोस्"
                  : "Clear search"
                : locale === "ne"
                  ? "सबै उत्पादन हेर्नुहोस्"
                  : "View all products"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const productName = t(product.name, locale);
              const categoryLabel = t(product.category, locale);

              return (
                <Link
                  key={product.slug}
                  href={`/products/district/${slug}/${product.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:border-brand/40 hover:shadow-[0_14px_34px_rgba(5,150,91,0.10)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface">
                    <ProductImage
                      src={product.image}
                      alt={productName}
                      categoryId={product.categoryId}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <span className="absolute left-3 top-3 border border-border bg-background/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand backdrop-blur-sm">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-headline text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                        {productName}
                      </h3>
                      <span className="inline-flex shrink-0 items-center gap-1 border border-border bg-surface px-2 py-1 text-[10px] font-bold text-muted-foreground">
                        <Sprout
                          size={11}
                          className="text-brand"
                          aria-hidden="true"
                        />
                        {product.farmerCount}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {t(product.desc, locale)}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-dotted border-border pt-3 text-xs font-bold text-brand">
                      <span>
                        {locale === "ne" ? "विवरण हेर्नुहोस्" : "View details"}
                      </span>
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface/70">
        <div className="container-editorial py-9 sm:py-11">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                {locale === "ne" ? "प्रदेशभर" : "Across the province"}
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">
                {locale === "ne"
                  ? "थप स्थानीय उत्पादनहरू पत्ता लगाउनुहोस्"
                  : "Explore more local products"}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground font-sans">
                {locale === "ne"
                  ? "सुदूरपश्चिमका अन्य जिल्लाका किसान, उत्पादक र स्थानीय उत्पादनहरूको सूची हेर्नुहोस्।"
                  : "Browse the district directories to discover farmers, producers, and local products across Sudurpashchim."}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 border border-brand bg-transparent px-5 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <span>{locale === "ne" ? "सबै जिल्ला" : "All districts"}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
