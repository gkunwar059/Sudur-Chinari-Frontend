import districtMapsData from './districtMapsData.json';

export interface DistrictGeoInfo {
  headquarters: { ne: string; en: string };
  landmark: { ne: string; en: string };
  terrain: { ne: string; en: string };
  pin: [number, number]; // [x, y] in province SVG coordinates (600x620)
}

export const DISTRICT_REAL_INDIVIDUAL_PATHS: Record<string, string> = districtMapsData.individualPaths;
export const DISTRICT_PROVINCE_PATHS: Record<string, string> = districtMapsData.provincePaths;
export const DISTRICT_CENTROIDS: Record<string, [number, number]> = districtMapsData.centroids as unknown as Record<string, [number, number]>;

export const DISTRICT_GEO_DETAILS: Record<string, DistrictGeoInfo> = {
  darchula: {
    headquarters: { ne: "खलङ्गा", en: "Khalanga" },
    landmark: { ne: "अपि हिमाल (७,१३२ मिटर)", en: "Api Himal (7,132m)" },
    terrain: { ne: "उच्च हिमाली तथा त्रिदेशीय सीमा", en: "High Himalayan & Tri-border" },
    pin: [240, 140],
  },
  bajhang: {
    headquarters: { ne: "चैनपुर", en: "Chainpur" },
    landmark: { ne: "साइपाल हिमाल (७,०३१ मिटर)", en: "Saipal Himal (7,031m)" },
    terrain: { ne: "हिमाली तथा सेती उपत्यका", en: "Himalayan & Seti Valley" },
    pin: [375, 185],
  },
  bajura: {
    headquarters: { ne: "मार्तडी", en: "Martadi" },
    landmark: { ne: "बडीमालिका देवी र बुढीनन्दा", en: "Badimalika & Budhinanda" },
    terrain: { ne: "उच्च हिमाली तथा दुर्गम भेग", en: "High Mountain & Karnali Ridge" },
    pin: [490, 225],
  },
  baitadi: {
    headquarters: { ne: "दशरथचन्द (पाटन)", en: "Dasharathchand (Patan)" },
    landmark: { ne: "त्रिपुरा सुन्दरी भगवती मन्दिर", en: "Tripurasundari Temple" },
    terrain: { ne: "मध्य पहाडी तथा महाकाली किनार", en: "Mid-hills & Mahakali Basin" },
    pin: [180, 255],
  },
  doti: {
    headquarters: { ne: "सिलगढी (दिपायल)", en: "Silgadhi (Dipayal)" },
    landmark: { ne: "शैलेश्वरी मन्दिर र ऐतिहासिक दरबार", en: "Shaileshwari Temple & Palace" },
    terrain: { ne: "ऐतिहासिक मध्य पहाडी केन्द्र", en: "Historic Central Hill Basin" },
    pin: [282, 360],
  },
  dadeldhura: {
    headquarters: { ne: "अमरगढी", en: "Amargadhi" },
    landmark: { ne: "ऐतिहासिक अमरगढी किल्ला र उग्रतारा", en: "Amargadhi Fort & Ugratara" },
    terrain: { ne: "पहाडी तथा सुदूरपश्चिमको प्रवेशद्वार", en: "Hills & Hill Gateway" },
    pin: [165, 340],
  },
  achham: {
    headquarters: { ne: "मंगलसेन", en: "Mangalsen" },
    landmark: { ne: "रामारोशन १२ बण्ड १८ खण्ड", en: "Ramaroshan 12 Lakes Complex" },
    terrain: { ne: "मध्य पहाडी तथा कैलास नदी", en: "Mid-hills & Kailas Basin" },
    pin: [425, 390],
  },
  kanchanpur: {
    headquarters: { ne: "भीमदत्त (महेन्द्रनगर)", en: "Bhimdatta (Mahendranagar)" },
    landmark: { ne: "शुक्लाफाँटा निकुञ्ज र दोधारा चाँदनी", en: "Shuklaphanta & Dodhara Chandani" },
    terrain: { ne: "तराई समथर मैदान र महाकाली तट", en: "Terai Plains & Mahakali Banks" },
    pin: [120, 470],
  },
  kailali: {
    headquarters: { ne: "धनगढी (प्रदेश राजधानी)", en: "Dhangadhi (Provincial Capital)" },
    landmark: { ne: "घोडाघोडी सिमसार र कर्णाली पुल", en: "Ghodaghodi Lake & Karnali Bridge" },
    terrain: { ne: "तराई समथर मैदान र कर्णाली तट", en: "Terai Plains & Karnali River" },
    pin: [280, 495],
  },
};
