import type { Locale } from "@/lib/i18n/config";

export interface BilingualText {
  en: string;
  ne: string;
}

export interface TermsSection {
  id: string;
  number: string;
  title: BilingualText;
  paragraphs?: BilingualText[];
  bullets?: BilingualText[];
  paragraphsAfter?: BilingualText[];
  bulletsAfter?: BilingualText[];
  closingParagraphs?: BilingualText[];
}

export const TERMS_META: Record<
  Locale,
  { title: string; description: string }
> = {
  en: {
    title: "Terms & Conditions",
    description:
      "Terms governing access to and use of the official Sudur Chinari website and digital platform.",
  },
  ne: {
    title: "प्रयोगका सर्तहरू",
    description:
      "सुदूर चिनारीको आधिकारिक वेबसाइट तथा डिजिटल प्लेटफर्मको पहुँच र प्रयोगलाई नियमन गर्ने सर्तहरू।",
  },
};

export const TERMS_CONTACT = {
  company: {
    en: "Sudur Chinari Pvt. Ltd.",
    ne: "सुदूर चिनारी प्रा. लि.",
  },
  website: "sudurchinari.com",
  websiteUrl: "https://sudurchinari.com",
  email: "chinarisudur@gmail.com",
  phone: "9865768537",
};

export const TERMS_COPYRIGHT: BilingualText = {
  en: "© 2026 Sudur Chinari Pvt. Ltd. All Rights Reserved.",
  ne: "© २०२६ सुदूर चिनारी प्रा. लि. सर्वाधिकार सुरक्षित।",
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "introduction",
    number: "1",
    title: {
      en: "Introduction and Acceptance of Terms",
      ne: "परिचय तथा सर्तहरूको स्वीकृति",
    },
    paragraphs: [
      {
        en: "Welcome to Sudur Chinari.",
        ne: "सुदूर चिनारीमा स्वागत छ।",
      },
      {
        en: 'These Terms and Conditions ("Terms") govern access to and use of the official website of Sudur Chinari Pvt. Ltd. ("Sudur Chinari", "Company", "we", "our", or "us").',
        ne: "यी प्रयोगका सर्तहरू (\"सर्तहरू\") सुदूर चिनारी प्रा. लि. (\"सुदूर चिनारी\", \"कम्पनी\", \"हामी\", \"हाम्रो\" वा \"हामीलाई\") को आधिकारिक वेबसाइटमा पहुँच तथा प्रयोगलाई नियमन गर्दछन्।",
      },
      {
        en: "Sudur Chinari is a digital information and documentation platform dedicated to promoting, preserving, and presenting the cultural, historical, geographical, social, and tourism identity of Sudurpashchim Province and Nepal.",
        ne: "सुदूर चिनारी सुदूरपश्चिम प्रदेश र नेपालको सांस्कृतिक, ऐतिहासिक, भौगोलिक, सामाजिक तथा पर्यटन पहिचानको प्रवर्द्धन, संरक्षण तथा प्रस्तुतीकरणमा समर्पित एक डिजिटल सूचना तथा अभिलेखीकरण प्लेटफर्म हो।",
      },
      {
        en: "By accessing, browsing, registering, or using our website, you agree to comply with these Terms and Conditions and our Privacy Policy.",
        ne: "हाम्रो वेबसाइटमा पहुँच गरेर, भ्रमण गरेर, दर्ता गरेर वा प्रयोग गरेर तपाईं यी प्रयोगका सर्तहरू तथा हाम्रो गोपनीयता नीतिको पालना गर्न सहमत हुनुहुन्छ।",
      },
      {
        en: "If you do not agree with these Terms, please discontinue using the website.",
        ne: "यदि तपाईं यी सर्तहरूसँग सहमत हुनुहुन्न भने कृपया वेबसाइटको प्रयोग बन्द गर्नुहोस्।",
      },
    ],
  },
  {
    id: "about-platform",
    number: "2",
    title: { en: "About Our Platform", ne: "हाम्रो प्लेटफर्मबारे" },
    paragraphs: [
      {
        en: "Sudur Chinari provides digital information and resources relating to Sudurpashchim Province and Nepal.",
        ne: "सुदूर चिनारीले सुदूरपश्चिम प्रदेश र नेपालसँग सम्बन्धित डिजिटल जानकारी तथा स्रोतहरू उपलब्ध गराउँछ।",
      },
      {
        en: "Our platform may feature:",
        ne: "हाम्रो प्लेटफर्ममा निम्न कुराहरू समावेश हुन सक्छन्:",
      },
    ],
    bullets: [
      {
        en: "Information about all nine districts of Sudurpashchim Province.",
        ne: "सुदूरपश्चिम प्रदेशका नौवटै जिल्लासम्बन्धी जानकारी।",
      },
      {
        en: "Cultural traditions, languages, customs, and heritage.",
        ne: "सांस्कृतिक परम्परा, भाषा, चलन तथा सम्पदा।",
      },
      {
        en: "Historical places and religious sites.",
        ne: "ऐतिहासिक स्थल तथा धार्मिक स्थानहरू।",
      },
      {
        en: "Tourism destinations and attractions.",
        ne: "पर्यटकीय गन्तव्य तथा आकर्षणहरू।",
      },
      {
        en: "Hotels, restaurants, accommodation, and local businesses.",
        ne: "होटल, रेस्टुरेन्ट, आवास तथा स्थानीय व्यवसायहरू।",
      },
      {
        en: "News, articles, interviews, and community stories.",
        ne: "समाचार, लेख, अन्तर्वार्ता तथा सामुदायिक कथाहरू।",
      },
      {
        en: "Agriculture, local products, and economic activities.",
        ne: "कृषि, स्थानीय उत्पादन तथा आर्थिक गतिविधिहरू।",
      },
      {
        en: "Photographs, videos, and digital documentation.",
        ne: "तस्बिर, भिडियो तथा डिजिटल अभिलेखहरू।",
      },
      {
        en: "Research, educational, and informational materials.",
        ne: "अनुसन्धान, शैक्षिक तथा सूचनामूलक सामग्रीहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Our objective is to make regional information accessible, promote local identity, and support cultural preservation and tourism development through digital technology.",
        ne: "हाम्रो उद्देश्य प्रादेशिक जानकारीलाई सुलभ बनाउनु, स्थानीय पहिचानको प्रवर्द्धन गर्नु तथा डिजिटल प्रविधिमार्फत सांस्कृतिक संरक्षण र पर्यटन विकासलाई सहयोग गर्नु हो।",
      },
    ],
  },
  {
    id: "eligibility",
    number: "3",
    title: {
      en: "Eligibility and Website Access",
      ne: "योग्यता तथा वेबसाइट पहुँच",
    },
    paragraphs: [
      {
        en: "Users may access publicly available website content for lawful personal, educational, informational, and other permitted purposes.",
        ne: "प्रयोगकर्ताहरूले सार्वजनिक रूपमा उपलब्ध वेबसाइट सामग्री कानुनी व्यक्तिगत, शैक्षिक, सूचनामूलक तथा अन्य अनुमत प्रयोजनका लागि पहुँच गर्न सक्छन्।",
      },
      {
        en: "Certain website functionalities require user registration and login.",
        ne: "वेबसाइटका केही सुविधाहरूका लागि प्रयोगकर्ता दर्ता तथा लगइन आवश्यक हुन्छ।",
      },
      {
        en: "By using the website, you confirm that:",
        ne: "वेबसाइट प्रयोग गरेर तपाईं निम्न कुरा पुष्टि गर्नुहुन्छ:",
      },
    ],
    bullets: [
      {
        en: "You have the legal capacity to agree to these Terms.",
        ne: "तपाईं यी सर्तहरूमा सहमत हुन कानुनी रूपमा सक्षम हुनुहुन्छ।",
      },
      {
        en: "Information provided during registration is accurate.",
        ne: "दर्ताका क्रममा उपलब्ध गराइएको जानकारी सही छ।",
      },
      {
        en: "You will use the website in accordance with applicable laws.",
        ne: "तपाईंले वेबसाइट लागू कानुनबमोजिम प्रयोग गर्नुहुनेछ।",
      },
      {
        en: "You will not use the platform for unauthorized or unlawful activities.",
        ne: "तपाईंले प्लेटफर्मलाई अनधिकृत वा गैरकानुनी गतिविधिका लागि प्रयोग गर्नुहुने छैन।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Where a user is a minor, appropriate parental or legal guardian guidance and consent must be obtained where required by applicable law.",
        ne: "प्रयोगकर्ता नाबालक भएमा लागू कानुनले आवश्यक तोकेको अवस्थामा अभिभावक वा कानुनी संरक्षकको उचित मार्गदर्शन तथा सहमति प्राप्त गर्नुपर्नेछ।",
      },
    ],
  },
  {
    id: "registration",
    number: "4",
    title: {
      en: "User Registration and Accounts",
      ne: "प्रयोगकर्ता दर्ता तथा खाताहरू",
    },
    paragraphs: [
      {
        en: "Sudur Chinari provides user registration and login functionality.",
        ne: "सुदूर चिनारीले प्रयोगकर्ता दर्ता तथा लगइन सुविधा उपलब्ध गराउँछ।",
      },
      {
        en: "Users creating accounts must provide accurate and relevant information.",
        ne: "खाता सिर्जना गर्ने प्रयोगकर्ताहरूले सही तथा प्रासंगिक जानकारी उपलब्ध गराउनुपर्छ।",
      },
      {
        en: "Users are responsible for:",
        ne: "प्रयोगकर्ताहरू निम्न कुराका लागि जिम्मेवार छन्:",
      },
    ],
    bullets: [
      {
        en: "Maintaining accurate account information.",
        ne: "सही खाता जानकारी कायम राख्न।",
      },
      {
        en: "Keeping login credentials confidential.",
        ne: "लगइन प्रमाणहरू गोप्य राख्न।",
      },
      {
        en: "Not sharing account passwords with unauthorized individuals.",
        ne: "अनधिकृत व्यक्तिहरूसँग खाताको पासवर्ड साझा नगर्न।",
      },
      {
        en: "Taking reasonable precautions to protect their accounts.",
        ne: "आफ्ना खाताहरूको सुरक्षाका लागि उचित सावधानी अपनाउन।",
      },
      {
        en: "Informing us if they become aware of unauthorized account access.",
        ne: "अनधिकृत खाता पहुँचको जानकारी पाएमा हामीलाई जानकारी दिन।",
      },
      {
        en: "Using their accounts responsibly and lawfully.",
        ne: "आफ्ना खाताहरू जिम्मेवारीपूर्वक तथा कानुनबमोजिम प्रयोग गर्न।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Users must not:",
        ne: "प्रयोगकर्ताहरूले निम्न कार्य गर्नुहुँदैन:",
      },
    ],
    bulletsAfter: [
      {
        en: "Create accounts using another person's identity without authorization.",
        ne: "अनधिकृत रूपमा अर्को व्यक्तिको पहिचान प्रयोग गरी खाता सिर्जना गर्न।",
      },
      {
        en: "Provide false or misleading registration information.",
        ne: "झुटो वा भ्रामक दर्ता जानकारी उपलब्ध गराउन।",
      },
      {
        en: "Attempt to access another user's account.",
        ne: "अर्को प्रयोगकर्ताको खातामा पहुँच गर्ने प्रयास गर्न।",
      },
      {
        en: "Use accounts for fraudulent, abusive, or unauthorized purposes.",
        ne: "खाताहरू ठगी, दुर्व्यवहार वा अनधिकृत प्रयोजनका लागि प्रयोग गर्न।",
      },
      {
        en: "Attempt to bypass website security or authentication systems.",
        ne: "वेबसाइट सुरक्षा वा प्रमाणीकरण प्रणालीलाई बाइपास गर्ने प्रयास गर्न।",
      },
    ],
  },
  {
    id: "forms",
    number: "5",
    title: {
      en: "Website Forms and Communication",
      ne: "वेबसाइट फारम तथा सञ्चार",
    },
    paragraphs: [
      {
        en: "Our website provides multiple forms for communication, inquiries, registration, and other website-related purposes.",
        ne: "हाम्रो वेबसाइटले सञ्चार, जिज्ञासा, दर्ता तथा अन्य वेबसाइटसम्बन्धी प्रयोजनका लागि विभिन्न फारमहरू उपलब्ध गराउँछ।",
      },
      {
        en: "Users agree to provide accurate and appropriate information when submitting details through these forms.",
        ne: "यी फारमहरूमार्फत विवरण पेश गर्दा सही तथा उपयुक्त जानकारी उपलब्ध गराउन प्रयोगकर्ताहरू सहमत हुन्छन्।",
      },
      {
        en: "Users must not submit:",
        ne: "प्रयोगकर्ताहरूले निम्न कुरा पेश गर्नुहुँदैन:",
      },
    ],
    bullets: [
      {
        en: "False or misleading information.",
        ne: "झुटो वा भ्रामक जानकारी।",
      },
      {
        en: "Abusive, threatening, or discriminatory messages.",
        ne: "दुर्व्यवहारपूर्ण, धम्कीपूर्ण वा भेदभावपूर्ण सन्देशहरू।",
      },
      {
        en: "Unlawful or defamatory material.",
        ne: "गैरकानुनी वा मानहानिकारक सामग्री।",
      },
      {
        en: "Spam or unsolicited promotional messages.",
        ne: "स्पाम वा अनुरोध नगरिएका प्रचारात्मक सन्देशहरू।",
      },
      {
        en: "Malicious files or harmful content.",
        ne: "दुर्भावनापूर्ण फाइलहरू वा हानिकारक सामग्री।",
      },
      {
        en: "Personal information belonging to others without appropriate authorization.",
        ne: "उपयुक्त अनुमतिबिना अन्य व्यक्तिको व्यक्तिगत जानकारी।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Information submitted through website forms may be used to respond to inquiries, process requests, maintain communication, and provide relevant services.",
        ne: "वेबसाइट फारममार्फत पेश गरिएको जानकारी जिज्ञासाको जवाफ दिन, अनुरोध प्रशोधन गर्न, सञ्चार कायम राख्न तथा सम्बन्धित सेवाहरू उपलब्ध गराउन प्रयोग गर्न सकिन्छ।",
      },
      {
        en: "Further details about personal information handling are explained in our Privacy Policy.",
        ne: "व्यक्तिगत जानकारीको व्यवस्थापनसम्बन्धी थप विवरण हाम्रो गोपनीयता नीतिमा व्याख्या गरिएको छ।",
      },
    ],
  },
  {
    id: "content",
    number: "6",
    title: {
      en: "Website Content and Administration",
      ne: "वेबसाइट सामग्री तथा प्रशासन",
    },
    paragraphs: [
      {
        en: "Website content is managed and published by authorized administrators of Sudur Chinari Pvt. Ltd.",
        ne: "वेबसाइटको सामग्री सुदूर चिनारी प्रा. लि. का अधिकृत प्रशासकहरूद्वारा व्यवस्थापन तथा प्रकाशन गरिन्छ।",
      },
      {
        en: "Content may include:",
        ne: "सामग्रीमा निम्न समावेश हुन सक्छन्:",
      },
    ],
    bullets: [
      { en: "News and articles.", ne: "समाचार तथा लेखहरू।" },
      {
        en: "Tourism information.",
        ne: "पर्यटनसम्बन्धी जानकारी।",
      },
      {
        en: "Hotel and business listings.",
        ne: "होटल तथा व्यवसायिक सूचीहरू।",
      },
      {
        en: "Cultural and historical documentation.",
        ne: "सांस्कृतिक तथा ऐतिहासिक अभिलेखहरू।",
      },
      { en: "Photographs and videos.", ne: "तस्बिर तथा भिडियोहरू।" },
      {
        en: "Research and educational materials.",
        ne: "अनुसन्धान तथा शैक्षिक सामग्रीहरू।",
      },
      {
        en: "Community-related information.",
        ne: "समुदायसम्बन्धी जानकारी।",
      },
    ],
    paragraphsAfter: [
      {
        en: "General website visitors do not have direct publishing privileges.",
        ne: "सामान्य वेबसाइट आगन्तुकहरूलाई सिधै प्रकाशन गर्ने अधिकार हुँदैन।",
      },
      {
        en: "The Company reserves the right to:",
        ne: "कम्पनीले निम्न अधिकार सुरक्षित राख्छ:",
      },
    ],
    bulletsAfter: [
      {
        en: "Review and verify information before publication.",
        ne: "प्रकाशनअघि जानकारी समीक्षा तथा प्रमाणीकरण गर्न।",
      },
      {
        en: "Edit or format content.",
        ne: "सामग्री सम्पादन वा ढाँचा मिलाउन।",
      },
      {
        en: "Correct inaccurate or outdated information.",
        ne: "गलत वा पुरानो जानकारी सुधार गर्न।",
      },
      {
        en: "Reject unsuitable or unauthorized materials.",
        ne: "अनुपयुक्त वा अनधिकृत सामग्री अस्वीकार गर्न।",
      },
      {
        en: "Remove content that violates applicable laws or website policies.",
        ne: "लागू कानुन वा वेबसाइट नीतिहरूको उल्लङ्घन गर्ने सामग्री हटाउन।",
      },
      {
        en: "Update existing content when necessary.",
        ne: "आवश्यक परेमा विद्यमान सामग्री अद्यावधिक गर्न।",
      },
    ],
    closingParagraphs: [
      {
        en: "Publication of information does not automatically imply that the Company endorses every opinion or statement contained in that material.",
        ne: "जानकारी प्रकाशन गर्दा त्यसमा समावेश प्रत्येक विचार वा भनाइलाई कम्पनीले स्वतः समर्थन गर्छ भन्ने अर्थ लाग्दैन।",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "7",
    title: {
      en: "Intellectual Property and Copyright",
      ne: "बौद्धिक सम्पत्ति तथा प्रतिलिपि अधिकार",
    },
    paragraphs: [
      {
        en: "Unless otherwise stated, original website materials are owned by or lawfully licensed to Sudur Chinari Pvt. Ltd.",
        ne: "अन्यथा उल्लेख नगरिएसम्म, वेबसाइटका मौलिक सामग्रीहरू सुदूर चिनारी प्रा. लि. को स्वामित्वमा छन् वा कानुनतः इजाजतपत्र प्राप्त छन्।",
      },
      {
        en: "Protected materials may include:",
        ne: "संरक्षित सामग्रीहरूमा निम्न समावेश हुन सक्छन्:",
      },
    ],
    bullets: [
      {
        en: "Website design and layout.",
        ne: "वेबसाइट डिजाइन तथा लेआउट।",
      },
      {
        en: "Company name, branding, and logos.",
        ne: "कम्पनीको नाम, ब्रान्डिङ तथा लोगोहरू।",
      },
      {
        en: "Original articles and written content.",
        ne: "मौलिक लेख तथा लिखित सामग्रीहरू।",
      },
      {
        en: "Graphics and illustrations.",
        ne: "ग्राफिक्स तथा चित्रणहरू।",
      },
      {
        en: "Original photographs and videos.",
        ne: "मौलिक तस्बिर तथा भिडियोहरू।",
      },
      {
        en: "Digital databases and compilations.",
        ne: "डिजिटल डाटाबेस तथा सङ्कलनहरू।",
      },
      {
        en: "Other original creative and digital materials.",
        ne: "अन्य मौलिक सिर्जनात्मक तथा डिजिटल सामग्रीहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Users may access and share publicly available website content for permitted personal, educational, and informational purposes, provided appropriate attribution is maintained.",
        ne: "उचित स्रोत उल्लेख कायम राख्दै प्रयोगकर्ताहरूले सार्वजनिक रूपमा उपलब्ध वेबसाइट सामग्री अनुमत व्यक्तिगत, शैक्षिक तथा सूचनामूलक प्रयोजनका लागि पहुँच तथा साझा गर्न सक्छन्।",
      },
      {
        en: "Without prior written permission, users must not:",
        ne: "पूर्व लिखित अनुमतिबिना प्रयोगकर्ताहरूले निम्न कार्य गर्नुहुँदैन:",
      },
    ],
    bulletsAfter: [
      {
        en: "Reproduce or republish substantial original content for commercial purposes.",
        ne: "व्यावसायिक प्रयोजनका लागि ठूलो मात्रामा मौलिक सामग्री पुनरुत्पादन वा पुनःप्रकाशन गर्न।",
      },
      {
        en: "Copy and redistribute protected photographs or videos without authorization.",
        ne: "अनधिकृत रूपमा संरक्षित तस्बिर वा भिडियो प्रतिलिपि गरी पुनर्वितरण गर्न।",
      },
      {
        en: "Modify or remove copyright notices.",
        ne: "प्रतिलिपि अधिकार सूचनाहरू परिवर्तन वा हटाउन।",
      },
      {
        en: "Use company branding in a misleading manner.",
        ne: "कम्पनीको ब्रान्डिङ भ्रामक तरिकाले प्रयोग गर्न।",
      },
      {
        en: "Sell or commercially exploit protected website materials without permission.",
        ne: "अनुमतिबिना संरक्षित वेबसाइट सामग्री बिक्री वा व्यावसायिक दोहन गर्न।",
      },
      {
        en: "Systematically copy or extract website databases or content.",
        ne: "वेबसाइटका डाटाबेस वा सामग्री व्यवस्थित रूपमा प्रतिलिपि वा निकासी गर्न।",
      },
    ],
    closingParagraphs: [
      {
        en: "Third-party materials remain the property of their respective owners and are subject to their applicable intellectual property rights.",
        ne: "तेस्रो पक्षका सामग्रीहरू सम्बन्धित स्वामीहरूको सम्पत्ति रहन्छन् र तिनीहरूका लागू बौद्धिक सम्पत्ति अधिकारहरूको अधीनमा रहन्छन्।",
      },
    ],
  },
  {
    id: "copyright-complaints",
    number: "8",
    title: {
      en: "Copyright Complaints and Content Removal",
      ne: "प्रतिलिपि अधिकार उजुरी तथा सामग्री हटाउने",
    },
    paragraphs: [
      {
        en: "Sudur Chinari respects the intellectual property rights of individuals, organizations, and other content owners.",
        ne: "सुदूर चिनारी व्यक्ति, संस्था तथा अन्य सामग्री स्वामीहरूको बौद्धिक सम्पत्ति अधिकारको सम्मान गर्दछ।",
      },
      {
        en: "If you believe that any material published on our website infringes your copyright or other legal rights, you may contact us with:",
        ne: "यदि हाम्रो वेबसाइटमा प्रकाशित कुनै सामग्रीले तपाईंको प्रतिलिपि अधिकार वा अन्य कानुनी अधिकारको उल्लङ्घन गरेको विश्वास छ भने तपाईं निम्न विवरणसहित हामीलाई सम्पर्क गर्न सक्नुहुन्छ:",
      },
    ],
    bullets: [
      {
        en: "Your full name and contact information.",
        ne: "तपाईंको पूरा नाम तथा सम्पर्क जानकारी।",
      },
      {
        en: "Identification of the copyrighted material.",
        ne: "प्रतिलिपि अधिकार भएको सामग्रीको पहिचान।",
      },
      {
        en: "The URL or location of the disputed content.",
        ne: "विवादित सामग्रीको URL वा स्थान।",
      },
      {
        en: "Evidence of ownership or authorization.",
        ne: "स्वामित्व वा अनुमतिको प्रमाण।",
      },
      {
        en: "A description of the alleged infringement.",
        ne: "भएको दाबी गरिएको उल्लङ्घनको विवरण।",
      },
      {
        en: "Any additional relevant information.",
        ne: "अन्य सम्बन्धित जानकारी।",
      },
    ],
    paragraphsAfter: [
      {
        en: "We will review legitimate complaints and take appropriate action in accordance with applicable laws.",
        ne: "हामी वैध उजुरीहरूको समीक्षा गरी लागू कानुनबमोजिम उचित कारबाही गर्नेछौं।",
      },
      {
        en: "Contact: chinarisudur@gmail.com",
        ne: "सम्पर्क: chinarisudur@gmail.com",
      },
    ],
  },
  {
    id: "listings",
    number: "9",
    title: {
      en: "Tourism, Hotels and Business Listings",
      ne: "पर्यटन, होटल तथा व्यवसायिक सूचीहरू",
    },
    paragraphs: [
      {
        en: "Sudur Chinari may publish information about tourism destinations, hotels, restaurants, travel-related services, local businesses, and other establishments.",
        ne: "सुदूर चिनारीले पर्यटकीय गन्तव्य, होटल, रेस्टुरेन्ट, यात्रासम्बन्धी सेवा, स्थानीय व्यवसाय तथा अन्य प्रतिष्ठानहरूसम्बन्धी जानकारी प्रकाशित गर्न सक्छ।",
      },
      {
        en: "Such information is generally provided for informational and promotional purposes.",
        ne: "यस्तो जानकारी सामान्यतया सूचनामूलक तथा प्रचारात्मक प्रयोजनका लागि उपलब्ध गराइन्छ।",
      },
      {
        en: "Users should understand that:",
        ne: "प्रयोगकर्ताहरूले निम्न कुरा बुझ्नुपर्छ:",
      },
    ],
    bullets: [
      {
        en: "Listed businesses may be independently owned and operated.",
        ne: "सूचीबद्ध व्यवसायहरू स्वतन्त्र स्वामित्व तथा सञ्चालनमा हुन सक्छन्।",
      },
      {
        en: "Publication of a listing does not automatically constitute endorsement by Sudur Chinari.",
        ne: "सूची प्रकाशन गर्दा सुदूर चिनारीले स्वतः समर्थन गरेको मानिँदैन।",
      },
      {
        en: "Business information may be obtained from publicly available sources or authorized representatives.",
        ne: "व्यवसायसम्बन्धी जानकारी सार्वजनिक स्रोत वा अधिकृत प्रतिनिधिबाट प्राप्त गरिएको हुन सक्छ।",
      },
      {
        en: "Prices, facilities, services, contact details, and availability may change.",
        ne: "मूल्य, सुविधा, सेवा, सम्पर्क विवरण तथा उपलब्धता परिवर्तन हुन सक्छन्।",
      },
      {
        en: "Users should independently verify relevant details before making decisions or transactions.",
        ne: "निर्णय वा कारोबार गर्नुअघि प्रयोगकर्ताहरूले सम्बन्धित विवरण स्वतन्त्र रूपमा प्रमाणित गर्नुपर्छ।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Unless a separate agreement expressly states otherwise, Sudur Chinari does not act as an agent or representative of listed businesses.",
        ne: "छुट्टै सम्झौताले स्पष्ट रूपमा अन्यथा उल्लेख नगरेसम्म, सुदूर चिनारी सूचीबद्ध व्यवसायहरूको एजेन्ट वा प्रतिनिधिको रूपमा कार्य गर्दैन।",
      },
      {
        en: "Any direct transaction or service arrangement between users and third-party businesses is generally the responsibility of those parties.",
        ne: "प्रयोगकर्ता र तेस्रो पक्षका व्यवसायहरूबीचको प्रत्यक्ष कारोबार वा सेवा व्यवस्थापन सामान्यतया सम्बन्धित पक्षहरूको जिम्मेवारी हुन्छ।",
      },
    ],
  },
  {
    id: "news-content",
    number: "10",
    title: {
      en: "News, Articles and Informational Content",
      ne: "समाचार, लेख तथा सूचनामूलक सामग्री",
    },
    paragraphs: [
      {
        en: "Sudur Chinari may publish news, articles, interviews, research materials, historical information, and community stories.",
        ne: "सुदूर चिनारीले समाचार, लेख, अन्तर्वार्ता, अनुसन्धान सामग्री, ऐतिहासिक जानकारी तथा सामुदायिक कथाहरू प्रकाशित गर्न सक्छ।",
      },
      {
        en: "We make reasonable efforts to maintain accuracy and relevance.",
        ne: "शुद्धता तथा प्रासंगिकता कायम राख्न हामी उचित प्रयास गर्छौं।",
      },
      {
        en: "However:",
        ne: "तथापि:",
      },
    ],
    bullets: [
      {
        en: "Some content may reflect the opinions of individual authors or contributors.",
        ne: "केही सामग्रीले व्यक्तिगत लेखक वा योगदानकर्ताका विचार प्रतिबिम्बित गर्न सक्छन्।",
      },
      {
        en: "Historical and cultural information may be based on available sources and community knowledge.",
        ne: "ऐतिहासिक तथा सांस्कृतिक जानकारी उपलब्ध स्रोत तथा सामुदायिक ज्ञानमा आधारित हुन सक्छ।",
      },
      {
        en: "Information may become outdated over time.",
        ne: "समयसँगै जानकारी पुरानो हुन सक्छ।",
      },
      {
        en: "Published information should not automatically be treated as professional legal, medical, financial, or other specialized advice.",
        ne: "प्रकाशित जानकारी स्वतः व्यावसायिक कानुनी, चिकित्सकीय, आर्थिक वा अन्य विशेषीकृत सल्लाहको रूपमा लिनुहुँदैन।",
      },
    ],
    paragraphsAfter: [
      {
        en: "We reserve the right to correct, update, clarify, or remove published content when appropriate.",
        ne: "उपयुक्त हुँदा प्रकाशित सामग्री सुधार, अद्यावधिक, स्पष्ट वा हटाउने अधिकार हामी सुरक्षित राख्छौं।",
      },
      {
        en: "The opinions expressed by individual contributors do not necessarily represent the official views of Sudur Chinari Pvt. Ltd.",
        ne: "व्यक्तिगत योगदानकर्ताहरूले व्यक्त गरेका विचारहरूले सुदूर चिनारी प्रा. लि. का आधिकारिक धारणाहरू अनिवार्य रूपमा प्रतिनिधित्व गर्दैनन्।",
      },
    ],
  },
  {
    id: "user-conduct",
    number: "11",
    title: {
      en: "User Conduct and Prohibited Activities",
      ne: "प्रयोगकर्ता आचरण तथा निषेधित गतिविधिहरू",
    },
    paragraphs: [
      {
        en: "Users agree not to engage in activities that may harm the website, its users, or the Company.",
        ne: "वेबसाइट, यसका प्रयोगकर्ता वा कम्पनीलाई हानि पुर्याउन सक्ने गतिविधिहरूमा संलग्न नहुन प्रयोगकर्ताहरू सहमत हुन्छन्।",
      },
      {
        en: "Prohibited activities include:",
        ne: "निषेधित गतिविधिहरूमा निम्न समावेश छन्:",
      },
    ],
    bullets: [
      {
        en: "Unauthorized access to website systems or databases.",
        ne: "वेबसाइट प्रणाली वा डाटाबेसमा अनधिकृत पहुँच।",
      },
      {
        en: "Hacking, phishing, or other malicious activities.",
        ne: "ह्याकिङ, फिसिङ वा अन्य दुर्भावनापूर्ण गतिविधिहरू।",
      },
      {
        en: "Uploading or distributing malware.",
        ne: "मालवेयर अपलोड वा वितरण गर्नु।",
      },
      {
        en: "Attempting to disrupt website services.",
        ne: "वेबसाइट सेवाहरू अवरुद्ध गर्ने प्रयास गर्नु।",
      },
      {
        en: "Misusing registration or login functionality.",
        ne: "दर्ता वा लगइन सुविधाको दुरुपयोग गर्नु।",
      },
      {
        en: "Collecting other users' personal information without authorization.",
        ne: "अनधिकृत रूपमा अन्य प्रयोगकर्ताको व्यक्तिगत जानकारी सङ्कलन गर्नु।",
      },
      {
        en: "Copying protected content for unauthorized commercial purposes.",
        ne: "अनधिकृत व्यावसायिक प्रयोजनका लागि संरक्षित सामग्री प्रतिलिपि गर्नु।",
      },
      {
        en: "Using the website for fraud, harassment, or unlawful activities.",
        ne: "वेबसाइटलाई ठगी, उत्पीडन वा गैरकानुनी गतिविधिका लागि प्रयोग गर्नु।",
      },
      {
        en: "Impersonating individuals or organizations.",
        ne: "व्यक्ति वा संस्थाको रूप धारण गर्नु।",
      },
      {
        en: "Violating the rights of other users or third parties.",
        ne: "अन्य प्रयोगकर्ता वा तेस्रो पक्षको अधिकार उल्लङ्घन गर्नु।",
      },
    ],
    paragraphsAfter: [
      {
        en: "We reserve the right to take appropriate action against violations, subject to applicable law.",
        ne: "लागू कानुनको अधीनमा रही उल्लङ्घनविरुद्ध उचित कारबाही गर्ने अधिकार हामी सुरक्षित राख्छौं।",
      },
    ],
  },
  {
    id: "third-party",
    number: "12",
    title: {
      en: "Third-Party Websites and External Links",
      ne: "तेस्रो पक्षका वेबसाइट तथा बाह्य लिङ्कहरू",
    },
    paragraphs: [
      {
        en: "Our website may contain links to external websites, social media platforms, maps, videos, tourism services, and other third-party resources.",
        ne: "हाम्रो वेबसाइटमा बाह्य वेबसाइट, सामाजिक सञ्जाल प्लेटफर्म, नक्सा, भिडियो, पर्यटन सेवा तथा अन्य तेस्रो पक्षका स्रोतहरूका लिङ्कहरू हुन सक्छन्।",
      },
      {
        en: "These services are operated independently.",
        ne: "यी सेवाहरू स्वतन्त्र रूपमा सञ्चालित हुन्छन्।",
      },
      {
        en: "Sudur Chinari Pvt. Ltd. does not control or guarantee the accuracy, availability, security, or privacy practices of external websites.",
        ne: "सुदूर चिनारी प्रा. लि. ले बाह्य वेबसाइटहरूको शुद्धता, उपलब्धता, सुरक्षा वा गोपनीयता अभ्यासहरूको नियन्त्रण वा ग्यारेन्टी गर्दैन।",
      },
      {
        en: "Accessing third-party websites is at the user's discretion.",
        ne: "तेस्रो पक्षका वेबसाइटहरूमा पहुँच गर्ने कुरा प्रयोगकर्ताको विवेकमा निर्भर छ।",
      },
      {
        en: "Users should review the relevant terms and privacy policies of external platforms before using their services.",
        ne: "बाह्य प्लेटफर्महरूको सेवा प्रयोग गर्नुअघि प्रयोगकर्ताहरूले तिनका सम्बन्धित सर्त तथा गोपनीयता नीतिहरू अध्ययन गर्नुपर्छ।",
      },
    ],
  },
  {
    id: "availability",
    number: "13",
    title: {
      en: "Website Availability and Maintenance",
      ne: "वेबसाइट उपलब्धता तथा मर्मत",
    },
    paragraphs: [
      {
        en: "We make reasonable efforts to maintain website availability and functionality.",
        ne: "वेबसाइटको उपलब्धता तथा कार्यक्षमता कायम राख्न हामी उचित प्रयास गर्छौं।",
      },
      {
        en: "However, uninterrupted access cannot be guaranteed.",
        ne: "तथापि, निर्बाध पहुँचको ग्यारेन्टी गर्न सकिँदैन।",
      },
      {
        en: "Website services may be temporarily unavailable due to:",
        ne: "निम्न कारणले वेबसाइट सेवाहरू अस्थायी रूपमा अनुपलब्ध हुन सक्छन्:",
      },
    ],
    bullets: [
      { en: "Scheduled maintenance.", ne: "निर्धारित मर्मत।" },
      { en: "Technical problems.", ne: "प्राविधिक समस्याहरू।" },
      {
        en: "Hosting or server interruptions.",
        ne: "होस्टिङ वा सर्भर अवरोधहरू।",
      },
      { en: "Software updates.", ne: "सफ्टवेयर अद्यावधिकहरू।" },
      {
        en: "Security-related issues.",
        ne: "सुरक्षासम्बन्धी समस्याहरू।",
      },
      {
        en: "Circumstances beyond our reasonable control.",
        ne: "हाम्रो उचित नियन्त्रणभन्दा बाहिरका परिस्थितिहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "We reserve the right to modify, suspend, or discontinue website features or services when necessary.",
        ne: "आवश्यक परेमा वेबसाइटका सुविधा वा सेवाहरू परिवर्तन, निलम्बन वा बन्द गर्ने अधिकार हामी सुरक्षित राख्छौं।",
      },
    ],
  },
  {
    id: "warranties",
    number: "14",
    title: {
      en: "Disclaimer of Warranties",
      ne: "ग्यारेन्टी अस्वीकरण",
    },
    paragraphs: [
      {
        en: "The website and its content are provided on an informational and general-use basis.",
        ne: "वेबसाइट तथा यसको सामग्री सूचनामूलक तथा सामान्य प्रयोगको आधारमा उपलब्ध गराइन्छ।",
      },
      {
        en: "To the extent permitted by applicable law, Sudur Chinari Pvt. Ltd. does not guarantee that:",
        ne: "लागू कानुनले अनुमति दिएको हदसम्म सुदूर चिनारी प्रा. लि. ले निम्न कुराको ग्यारेन्टी गर्दैन:",
      },
    ],
    bullets: [
      {
        en: "All website information is completely accurate or current.",
        ne: "वेबसाइटको सम्पूर्ण जानकारी पूर्ण रूपमा सही वा अद्यावधिक छ।",
      },
      {
        en: "Website services will always be available without interruption.",
        ne: "वेबसाइट सेवाहरू सधैं निर्बाध रूपमा उपलब्ध हुनेछन्।",
      },
      {
        en: "The website will be free from all technical errors.",
        ne: "वेबसाइट सम्पूर्ण प्राविधिक त्रुटिबाट मुक्त हुनेछ।",
      },
      {
        en: "Third-party information or services will always be reliable.",
        ne: "तेस्रो पक्षको जानकारी वा सेवाहरू सधैं विश्वसनीय हुनेछन्।",
      },
      {
        en: "Website content will meet every individual user's specific requirement.",
        ne: "वेबसाइट सामग्रीले प्रत्येक प्रयोगकर्ताको विशिष्ट आवश्यकता पूरा गर्नेछ।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Users are responsible for independently verifying important information before relying on it.",
        ne: "महत्त्वपूर्ण जानकारीमा भर पर्नुअघि प्रयोगकर्ताहरू स्वतन्त्र रूपमा प्रमाणित गर्न जिम्मेवार छन्।",
      },
      {
        en: "Nothing in this section excludes any rights or protections that cannot legally be excluded.",
        ne: "यस खण्डमा रहेको कुनै पनि कुराले कानुनतः बाहिर राख्न नसकिने अधिकार वा संरक्षणहरूलाई बहिष्कृत गर्दैन।",
      },
    ],
  },
  {
    id: "liability",
    number: "15",
    title: {
      en: "Limitation of Liability",
      ne: "दायित्वको सीमा",
    },
    paragraphs: [
      {
        en: "To the extent permitted by applicable law, Sudur Chinari Pvt. Ltd. shall not be liable for losses arising from:",
        ne: "लागू कानुनले अनुमति दिएको हदसम्म सुदूर चिनारी प्रा. लि. निम्नबाट उत्पन्न हुने हानिका लागि उत्तरदायी हुनेछैन:",
      },
    ],
    bullets: [
      {
        en: "Reliance on inaccurate or outdated information.",
        ne: "गलत वा पुरानो जानकारीमा भर पर्नु।",
      },
      {
        en: "Temporary website interruptions or technical problems.",
        ne: "वेबसाइटको अस्थायी अवरोध वा प्राविधिक समस्या।",
      },
      {
        en: "Third-party websites or external services.",
        ne: "तेस्रो पक्षका वेबसाइट वा बाह्य सेवाहरू।",
      },
      {
        en: "Transactions between users and independent businesses.",
        ne: "प्रयोगकर्ता र स्वतन्त्र व्यवसायबीचको कारोबार।",
      },
      {
        en: "Unauthorized use of accounts resulting from the user's failure to protect login credentials.",
        ne: "प्रयोगकर्ताले लगइन प्रमाण सुरक्षित नगर्दा भएको खाताको अनधिकृत प्रयोग।",
      },
      {
        en: "Misuse of website content by third parties.",
        ne: "तेस्रो पक्षद्वारा वेबसाइट सामग्रीको दुरुपयोग।",
      },
      {
        en: "Other circumstances beyond the Company's reasonable control.",
        ne: "कम्पनीको उचित नियन्त्रणभन्दा बाहिरका अन्य परिस्थितिहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Nothing in these Terms limits liability where such limitation is prohibited by applicable law.",
        ne: "लागू कानुनले यस्तो सीमितता निषेध गरेको अवस्थामा यी सर्तहरूमा रहेको कुनै पनि कुराले दायित्व सीमित गर्दैन।",
      },
    ],
  },
  {
    id: "indemnification",
    number: "16",
    title: { en: "Indemnification", ne: "क्षतिपूर्ति" },
    paragraphs: [
      {
        en: "Users may be responsible for claims, damages, losses, or liabilities arising from their unlawful use of the website, violation of these Terms, or infringement of another person's rights.",
        ne: "वेबसाइटको गैरकानुनी प्रयोग, यी सर्तहरूको उल्लङ्घन वा अर्को व्यक्तिको अधिकारको उल्लङ्घनबाट उत्पन्न दाबी, क्षति, हानि वा दायित्वका लागि प्रयोगकर्ताहरू जिम्मेवार हुन सक्छन्।",
      },
      {
        en: "This provision applies only to the extent permitted by applicable law.",
        ne: "यो प्रावधान लागू कानुनले अनुमति दिएको हदसम्म मात्र लागू हुन्छ।",
      },
    ],
  },
  {
    id: "privacy",
    number: "17",
    title: {
      en: "Privacy and Personal Information",
      ne: "गोपनीयता तथा व्यक्तिगत जानकारी",
    },
    paragraphs: [
      {
        en: "Your use of this website is also governed by our Privacy Policy.",
        ne: "यस वेबसाइटको तपाईंको प्रयोग हाम्रो गोपनीयता नीतिद्वारा पनि नियमन गरिन्छ।",
      },
      {
        en: "Our Privacy Policy explains how we collect, use, process, store, and protect personal information.",
        ne: "हाम्रो गोपनीयता नीतिले हामी व्यक्तिगत जानकारी कसरी सङ्कलन, प्रयोग, प्रशोधन, भण्डारण तथा संरक्षण गर्छौं भन्ने व्याख्या गर्दछ।",
      },
      {
        en: "Users are encouraged to read the Privacy Policy before registering an account or submitting personal information through website forms.",
        ne: "खाता दर्ता गर्नुअघि वा वेबसाइट फारममार्फत व्यक्तिगत जानकारी पेश गर्नुअघि गोपनीयता नीति पढ्न प्रयोगकर्ताहरूलाई प्रोत्साहित गरिन्छ।",
      },
    ],
  },
  {
    id: "termination",
    number: "18",
    title: {
      en: "Suspension and Termination",
      ne: "निलम्बन तथा अन्त्य",
    },
    paragraphs: [
      {
        en: "Sudur Chinari Pvt. Ltd. reserves the right to suspend, restrict, or terminate website access or user accounts when reasonably necessary, including where:",
        ne: "उचित रूपमा आवश्यक भएमा सुदूर चिनारी प्रा. लि. ले वेबसाइट पहुँच वा प्रयोगकर्ता खाताहरू निलम्बन, प्रतिबन्ध वा बन्द गर्ने अधिकार सुरक्षित राख्छ, जसमा निम्न अवस्थाहरू समावेश छन्:",
      },
    ],
    bullets: [
      {
        en: "A user violates these Terms and Conditions.",
        ne: "प्रयोगकर्ताले यी प्रयोगका सर्तहरूको उल्लङ्घन गरेमा।",
      },
      {
        en: "An account is involved in unauthorized activities.",
        ne: "खाता अनधिकृत गतिविधिमा संलग्न भएमा।",
      },
      {
        en: "Website security or functionality is threatened.",
        ne: "वेबसाइट सुरक्षा वा कार्यक्षमतामा खतरा पुगेमा।",
      },
      {
        en: "False or unlawful information is submitted.",
        ne: "झुटो वा गैरकानुनी जानकारी पेश गरिएमा।",
      },
      {
        en: "Such action is required by applicable law or an authorized authority.",
        ne: "लागू कानुन वा अधिकृत निकायले यस्तो कारबाही आवश्यक तोकेमा।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Where appropriate, users may be notified of the action taken.",
        ne: "उपयुक्त हुँदा गरिएको कारबाहीबारे प्रयोगकर्तालाई जानकारी दिइन सक्छ।",
      },
      {
        en: "Users may contact the Company regarding account closure or termination requests.",
        ne: "खाता बन्द वा अन्त्यको अनुरोधसम्बन्धी कम्पनीलाई सम्पर्क गर्न सक्छन्।",
      },
    ],
  },
  {
    id: "changes",
    number: "19",
    title: {
      en: "Changes to These Terms and Conditions",
      ne: "यी प्रयोगका सर्तहरूमा परिवर्तन",
    },
    paragraphs: [
      {
        en: "Sudur Chinari Pvt. Ltd. reserves the right to revise or update these Terms and Conditions from time to time.",
        ne: "समय-समयमा यी प्रयोगका सर्तहरू संशोधन वा अद्यावधिक गर्ने अधिकार सुदूर चिनारी प्रा. लि. सुरक्षित राख्छ।",
      },
      {
        en: "Changes may be made to reflect:",
        ne: "परिवर्तनहरू निम्न कुरा प्रतिबिम्बित गर्न गरिन सक्छन्:",
      },
    ],
    bullets: [
      {
        en: "New website features.",
        ne: "वेबसाइटका नयाँ सुविधाहरू।",
      },
      {
        en: "Changes in company operations.",
        ne: "कम्पनीको सञ्चालनमा परिवर्तन।",
      },
      {
        en: "Changes in website functionality.",
        ne: "वेबसाइटको कार्यक्षमतामा परिवर्तन।",
      },
      {
        en: "Legal and regulatory requirements.",
        ne: "कानुनी तथा नियामक आवश्यकताहरू।",
      },
      {
        en: "Security and operational improvements.",
        ne: "सुरक्षा तथा सञ्चालन सुधारहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: 'Updated Terms will be published on this page with a revised "Last Updated" date.',
        ne: "अद्यावधिक सर्तहरू संशोधित \"अन्तिम अद्यावधिक मिति\" सहित यसै पृष्ठमा प्रकाशित गरिनेछ।",
      },
      {
        en: "Users are encouraged to review these Terms periodically.",
        ne: "प्रयोगकर्ताहरूलाई यी सर्तहरू समय-समयमा अध्ययन गर्न प्रोत्साहित गरिन्छ।",
      },
      {
        en: "Where legally required, we will obtain renewed consent or provide appropriate notice of material changes.",
        ne: "कानुनतः आवश्यक भएमा हामी नयाँ सहमति लिने वा महत्त्वपूर्ण परिवर्तनको उचित सूचना दिनेछौं।",
      },
    ],
  },
  {
    id: "governing-law",
    number: "20",
    title: {
      en: "Governing Law and Jurisdiction",
      ne: "शासकीय कानुन तथा अधिकारक्षेत्र",
    },
    paragraphs: [
      {
        en: "These Terms and Conditions shall be governed by and interpreted in accordance with the applicable laws of Nepal.",
        ne: "यी प्रयोगका सर्तहरू नेपालको लागू कानुनद्वारा नियमन तथा व्याख्या गरिनेछ।",
      },
      {
        en: "Any disputes arising from the use of this website shall be addressed through appropriate legal procedures and competent courts or authorities in Nepal, subject to applicable jurisdictional rules.",
        ne: "यस वेबसाइटको प्रयोगबाट उत्पन्न कुनै पनि विवाद लागू अधिकारक्षेत्रका नियमहरूको अधीनमा रही नेपालका उपयुक्त कानुनी प्रक्रिया तथा सक्षम अदालत वा निकायमार्फत सम्बोधन गरिनेछ।",
      },
    ],
  },
  {
    id: "contact",
    number: "21",
    title: { en: "Contact Information", ne: "सम्पर्क जानकारी" },
    paragraphs: [
      {
        en: "For questions, suggestions, complaints, copyright concerns, account-related matters, or other inquiries regarding these Terms and Conditions, please contact us:",
        ne: "यी प्रयोगका सर्तहरूसम्बन्धी प्रश्न, सुझाव, उजुरी, प्रतिलिपि अधिकारसम्बन्धी चिन्ता, खातासम्बन्धी विषय वा अन्य जिज्ञासाका लागि कृपया हामीलाई सम्पर्क गर्नुहोस्:",
      },
    ],
  },
];
