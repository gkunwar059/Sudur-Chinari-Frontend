export interface YatayatService {
  id: string;
  type: 'bus' | 'hiace' | 'jeep';
  title: { ne: string; en: string };
  subTitle: { ne: string; en: string };
  badge: { ne: string; en: string; color: 'brand' | 'blue' | 'amber' | 'emerald' };
  verified: boolean;
  updatedAt: string;
  origin: { ne: string; en: string };
  destination: { ne: string; en: string };
  route: { ne: string[]; en: string[] };
  departureTime?: { ne: string; en: string };
  fare?: { ne: string; en: string };
  seats?: { ne: string; en: string };
  contacts: string[];
  image: string;
  notes?: { ne: string; en: string };
}

export const YATAYAT_SERVICES: YatayatService[] = [
  // ── BUS SERVICES ──
  {
    id: 'bus-achham',
    type: 'bus',
    title: { ne: 'अछाम यातायात प्रा.लि.', en: 'Achham Yatayat Pvt. Ltd.' },
    subTitle: { ne: 'सुपर्डीलक्स बस सेवा', en: 'Super Deluxe Bus Service' },
    badge: { ne: 'लोकप्रिय', en: 'Popular', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/२०',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'धनगढी', en: 'Dhangadhi' },
    route: {
      ne: ['साँफेबगर', 'बयलपाटा', 'दिपायल', 'अत्तरिया', 'धनगढी'],
      en: ['Sanfebagar', 'Bayalpata', 'Dipayal', 'Attariya', 'Dhangadhi'],
    },
    departureTime: { ne: 'बिहान ६:०० बजे', en: '6:00 AM' },
    fare: { ne: 'रु. १,२०० (अनुमानित)', en: 'Rs. 1,200 (Estimated)' },
    seats: { ne: '३६', en: '36' },
    contacts: ['98580-xxxxx', '98487-xxxxx'],
    image: '/images/yatayat/bus_achham.jpg',
    notes: {
      ne: 'वातानुकूलित (AC), आरामदायी सिट, निःशुल्क वाइफाइ तथा पानीको सुविधा उपलब्ध।',
      en: 'Air-conditioned (AC), comfortable pushback seats, free Wi-Fi and water bottles.',
    },
  },
  {
    id: 'bus-dolphin',
    type: 'bus',
    title: { ne: 'डल्फिन यातायात सेवा', en: 'Dolphin Yatayat Service' },
    subTitle: { ne: 'एसी स्लीपर/सुपर्डीलक्स', en: 'AC Sleeper / Super Deluxe' },
    badge: { ne: 'नियमित सेवा', en: 'Daily Service', color: 'blue' },
    verified: true,
    updatedAt: '२०८३/०६/१६',
    origin: { ne: 'धनगढी', en: 'Dhangadhi' },
    destination: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    route: {
      ne: ['धनगढी', 'अत्तरिया', 'दिपायल', 'बयलपाटा', 'साँफेबगर'],
      en: ['Dhangadhi', 'Attariya', 'Dipayal', 'Bayalpata', 'Sanfebagar'],
    },
    departureTime: { ne: 'बिहान ७:०० बजे', en: '7:00 AM' },
    fare: { ne: 'रु. १,००० (अनुमानित)', en: 'Rs. 1,000 (Estimated)' },
    seats: { ne: '४०', en: '40' },
    contacts: ['98574-xxxxx', '97483-xxxxx'],
    image: '/images/yatayat/bus_dolphin.jpg',
    notes: {
      ne: 'आधुनिक स्लीपर कोच, मोबाइल चार्जिङ पोर्ट, अनुभवी चालक तथा सुरक्षित यात्रा।',
      en: 'Modern sleeper coach, mobile USB charging ports, veteran mountain drivers.',
    },
  },
  {
    id: 'bus-safal',
    type: 'bus',
    title: { ne: 'सफल यातायात', en: 'Safal Yatayat' },
    subTitle: { ne: 'सुपर डिलक्स बस सेवा', en: 'Super Deluxe Bus Service' },
    badge: { ne: 'सुपर डिलक्स', en: 'Super Deluxe', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/१५',
    origin: { ne: 'महेन्द्रनगर', en: 'Mahendranagar' },
    destination: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    route: {
      ne: ['महेन्द्रनगर', 'अत्तरिया', 'दिपायल', 'बयलपाटा', 'साँफेबगर'],
      en: ['Mahendranagar', 'Attariya', 'Dipayal', 'Bayalpata', 'Sanfebagar'],
    },
    departureTime: { ne: 'बिहान ६:३० बजे', en: '6:30 AM' },
    fare: { ne: 'रु. १,५०० (अनुमानित)', en: 'Rs. 1,500 (Estimated)' },
    seats: { ne: '३२', en: '32' },
    contacts: ['98042-xxxxx', '98452-xxxxx'],
    image: '/images/yatayat/bus_safal.jpg',
    notes: {
      ne: 'सुदूरपश्चिमका मुख्य राजमार्गहरूमा दैनिक समयनिष्ठ एक्सप्रेस सेवा।',
      en: 'Punctual daily express service connecting Kanchanpur with central hill districts.',
    },
  },

  // ── HIACE SERVICES ──
  {
    id: 'hiace-mahendranagar',
    type: 'hiace',
    title: { ne: 'महेन्द्रनगर हाइस सेवा', en: 'Mahendranagar Hiace Service' },
    subTitle: { ne: 'छिटो र सुरक्षित यात्रा', en: 'Fast & Secure Commute' },
    badge: { ne: 'रिजर्भ सेवा', en: 'Reserve Service', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/२०',
    origin: { ne: 'महेन्द्रनगर', en: 'Mahendranagar' },
    destination: { ne: 'धनगढी', en: 'Dhangadhi' },
    route: {
      ne: ['महेन्द्रनगर', 'अत्तरिया', 'धनगढी'],
      en: ['Mahendranagar', 'Attariya', 'Dhangadhi'],
    },
    contacts: ['98480-xxxxx', '98544-xxxxx'],
    image: '/images/yatayat/hiace_van.jpg',
    seats: { ne: '१४', en: '14' },
    fare: { ne: 'रु. २५०', en: 'Rs. 250' },
    departureTime: { ne: 'हरेक ३० मिनेटमा', en: 'Every 30 Mins' },
    notes: {
      ne: 'तराईका मुख्य शहरहरू जोड्ने एक्सप्रेस डिलक्स हाइस सेवा।',
      en: 'Frequent express commuter shuttles between Mahendranagar and Dhangadhi.',
    },
  },
  {
    id: 'hiace-sudurpashchim',
    type: 'hiace',
    title: { ne: 'सुदूरपश्चिम हाइस सेवा', en: 'Sudurpashchim Hiace Service' },
    subTitle: { ne: 'पहाडी द्रुत मार्ग', en: 'Hilly Express Route' },
    badge: { ne: 'नियमित सेवा', en: 'Daily Service', color: 'blue' },
    verified: true,
    updatedAt: '२०८३/०६/१८',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'दिपायल', en: 'Dipayal' },
    route: {
      ne: ['साँफेबगर', 'बयलपाटा', 'दिपायल'],
      en: ['Sanfebagar', 'Bayalpata', 'Dipayal'],
    },
    contacts: ['98123-xxxxx', '98671-xxxx'],
    image: '/images/yatayat/hiace_van.jpg',
    seats: { ne: '१४', en: '14' },
    fare: { ne: 'रु. ४००', en: 'Rs. 400' },
    departureTime: { ne: 'बिहान ८:०० र दिउँसो १:०० बजे', en: '8:00 AM & 1:00 PM' },
    notes: {
      ne: 'मध्य पहाडी जिल्लाहरूमा छिटो र आरामदायी यातायात सुविधा।',
      en: 'Fast and comfortable transport across mid-hill district centers.',
    },
  },
  {
    id: 'hiace-achham',
    type: 'hiace',
    title: { ne: 'अछाम हाइस / सेयर', en: 'Achham Hiace / Shared' },
    subTitle: { ne: 'दैनिक सेयरिङ सेवा', en: 'Daily Shared Commute' },
    badge: { ne: 'सेयर सेवा', en: 'Shared Service', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/१७',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'अत्तरिया', en: 'Attariya' },
    route: {
      ne: ['साँफेबगर', 'बयलपाटा', 'अत्तरिया'],
      en: ['Sanfebagar', 'Bayalpata', 'Attariya'],
    },
    contacts: ['98234-xxxxx', '98012-xxxx'],
    image: '/images/yatayat/hiace_van.jpg',
    seats: { ne: '१४', en: '14' },
    fare: { ne: 'रु. ८००', en: 'Rs. 800' },
    departureTime: { ne: 'बिहान ७:३० बजे', en: '7:30 AM' },
    notes: {
      ne: 'सिट रिजर्भ तथा प्याकेज बुकिङ सुविधा उपलब्ध।',
      en: 'Seat reservation and parcel delivery support available.',
    },
  },

  // ── JEEP SERVICES ──
  {
    id: 'jeep-kale',
    type: 'jeep',
    title: { ne: 'काले जीप सेवा', en: 'Kale Jeep Service' },
    subTitle: { ne: '४x४ फोर ह्वील ड्राइभ', en: '4x4 Four Wheel Drive' },
    badge: { ne: 'नियमित सेवा', en: 'Daily Service', color: 'blue' },
    verified: true,
    updatedAt: '२०८३/०६/१९',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'बयलपाटा', en: 'Bayalpata' },
    route: {
      ne: ['साँफेबगर', 'चौपाटी', 'बयलपाटा'],
      en: ['Sanfebagar', 'Chaupati', 'Bayalpata'],
    },
    contacts: ['98510-xxxxx'],
    image: '/images/yatayat/jeep_bolero.jpg',
    seats: { ne: '७', en: '7' },
    fare: { ne: 'रु. १५०', en: 'Rs. 150' },
    departureTime: { ne: 'प्रत्येक घण्टामा', en: 'Hourly departures' },
    notes: {
      ne: 'स्थानीय बजार तथा अस्पताल आवतजावतका लागि भरपर्दो फोर ह्वील जीप सेवा।',
      en: 'Reliable 4x4 Bolero jeep connecting local trading hubs and hospitals.',
    },
  },
  {
    id: 'jeep-bajura',
    type: 'jeep',
    title: { ne: 'बाजुरा जीप सेवा', en: 'Bajura Jeep Service' },
    subTitle: { ne: 'दुर्गम हिमाली रुट', en: 'Mountain Terrain Route' },
    badge: { ne: 'सेयर सेवा', en: 'Shared Service', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/१८',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'बाजुरा', en: 'Bajura' },
    route: {
      ne: ['साँफेबगर', 'कमलबजार', 'बाजुरा'],
      en: ['Sanfebagar', 'Kamalbazar', 'Bajura'],
    },
    contacts: ['98421-xxxxx'],
    image: '/images/yatayat/jeep_bolero.jpg',
    seats: { ne: '७', en: '7' },
    fare: { ne: 'रु. ६००', en: 'Rs. 600' },
    departureTime: { ne: 'बिहान ८:०० र दिउँसो २:००', en: '8:00 AM & 2:00 PM' },
    notes: {
      ne: 'कच्ची तथा अप्ठ्यारा पहाडी सडकमा सुरक्षित यात्रा।',
      en: 'Heavy duty 4x4 mountain vehicles built for rugged hill road conditions.',
    },
  },
  {
    id: 'jeep-kalikot',
    type: 'jeep',
    title: { ne: 'कालिकोट जीप सेवा', en: 'Kalikot Jeep Service' },
    subTitle: { ne: 'कर्णाली अन्तर-प्रदेश रुट', en: 'Inter-Provincial Route' },
    badge: { ne: 'रिजर्भ सेवा', en: 'Reserve Service', color: 'emerald' },
    verified: true,
    updatedAt: '२०८३/०६/१६',
    origin: { ne: 'साँफेबगर', en: 'Sanfebagar' },
    destination: { ne: 'कालिकोट', en: 'Kalikot' },
    route: {
      ne: ['साँफेबगर', 'कालिकोट'],
      en: ['Sanfebagar', 'Kalikot'],
    },
    contacts: ['98176-xxxxx'],
    image: '/images/yatayat/jeep_bolero.jpg',
    seats: { ne: '७', en: '7' },
    fare: { ne: 'रु. १,१००', en: 'Rs. 1,100' },
    departureTime: { ne: 'बिहान ७:०० बजे', en: '7:00 AM' },
    notes: {
      ne: 'सुदूरपश्चिमबाट कर्णाली प्रदेश जोड्ने विशेष जीप सेवा।',
      en: 'Specialized crossover transport connecting Sudurpashchim to Karnali province.',
    },
  },
];

export const SUDURPASHCHIM_DISTRICTS_LIST = [
  { slug: 'dadeldhura', name: 'डडेलधुरा', en: 'Dadeldhura', color: '#F87171' },
  { slug: 'kanchanpur', name: 'कञ्चनपुर', en: 'Kanchanpur', color: '#60A5FA' },
  { slug: 'doti', name: 'डोटी', en: 'Doti', color: '#FBBF24' },
  { slug: 'bajhang', name: 'बझाङ', en: 'Bajhang', color: '#34D399' },
  { slug: 'bajura', name: 'बाजुरा', en: 'Bajura', color: '#A78BFA' },
  { slug: 'achham', name: 'अछाम', en: 'अछाम', color: '#F472B6' },
  { slug: 'kailali', name: 'कैलाली', en: 'Kailali', color: '#4ADE80' },
  { slug: 'baitadi', name: 'बैतडी', en: 'Baitadi', color: '#38BDF8' },
  { slug: 'darchula', name: 'दार्चुला', en: 'Darchula', color: '#FB923C' },
];

export interface YatayatLocation {
  slug: string;
  ne: string;
  en: string;
}

export const POPULAR_LOCATIONS: YatayatLocation[] = [
  { slug: 'dhangadhi', ne: 'धनगढी', en: 'Dhangadhi' },
  { slug: 'mahendranagar', ne: 'महेन्द्रनगर', en: 'Mahendranagar' },
  { slug: 'sanfebagar', ne: 'साँफेबगर', en: 'Sanfebagar' },
  { slug: 'dipayal', ne: 'दिपायल', en: 'Dipayal' },
  { slug: 'attariya', ne: 'अत्तरिया', en: 'Attariya' },
  { slug: 'bayalpata', ne: 'बयलपाटा', en: 'Bayalpata' },
  { slug: 'kamalbazar', ne: 'कमलबजार', en: 'Kamalbazar' },
  { slug: 'bajura', ne: 'बाजुरा', en: 'Bajura' },
  { slug: 'kalikot', ne: 'कालिकोट', en: 'Kalikot' },
  { slug: 'chaupati', ne: 'चौपाटी', en: 'Chaupati' },
  { slug: 'amargadhi', ne: 'अमरगढी', en: 'Amargadhi' },
  { slug: 'patan', ne: 'पाटन', en: 'Patan' },
  { slug: 'khalanga', ne: 'खलङ्गा', en: 'Khalanga' },
  { slug: 'chainpur', ne: 'चैनपुर', en: 'Chainpur' },
];
