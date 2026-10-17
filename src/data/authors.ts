import type { Author } from '@/types';

export const AUTHORS: Author[] = [
  {
    id: 'a1',
    slug: 'ram-bahadur-thapa',
    name: { ne: 'राम बहादुर थापा', en: 'Ram Bahadur Thapa' },
    bio: {
      ne: 'राम बहादुर थापा वरिष्ठ पत्रकार हुन् जो गत १५ वर्षदेखि सुदूरपश्चिम प्रदेशको राजनीति र समाजमा रिपोर्टिङ गर्दै आएका छन्।',
      en: 'Ram Bahadur Thapa is a senior journalist who has been reporting on politics and society in Sudurpashchim Province for the past 15 years.',
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    role: 'वरिष्ठ सम्पादक',
    district: 'kailali',
    articleCount: 847,
  },
  {
    id: 'a2',
    slug: 'sita-devi-joshi',
    name: { ne: 'सीता देवी जोशी', en: 'Sita Devi Joshi' },
    bio: {
      ne: 'सीता देवी जोशी स्वास्थ्य र शिक्षा क्षेत्रमा विशेष गरी महिला र बालबालिकाका विषयमा रिपोर्टिङ गर्ने पत्रकार हुन्।',
      en: 'Sita Devi Joshi is a journalist who specializes in reporting on health and education, particularly on issues affecting women and children.',
    },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    role: 'स्वास्थ्य सम्वाददाता',
    district: 'kanchanpur',
    articleCount: 412,
  },
  {
    id: 'a3',
    slug: 'bishnu-prasad-bohara',
    name: { ne: 'विष्णु प्रसाद बोहरा', en: 'Bishnu Prasad Bohara' },
    bio: {
      ne: 'विष्णु प्रसाद बोहरा अर्थतन्त्र र पर्यटन क्षेत्रमा विज्ञ पत्रकार हुन्। उनले सुदूरपश्चिमको आर्थिक विकासमा विशेष योगदान पुर्‍याएका छन्।',
      en: 'Bishnu Prasad Bohara is an expert journalist in economics and tourism. He has made significant contributions to reporting on economic development in Sudurpashchim.',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    role: 'अर्थ सम्वाददाता',
    district: 'dadeldhura',
    articleCount: 298,
  },
  {
    id: 'a4',
    slug: 'kamala-bhandari',
    name: { ne: 'कमला भण्डारी', en: 'Kamala Bhandari' },
    bio: {
      ne: 'कमला भण्डारी संस्कृति र पर्यटन क्षेत्रमा विशेषज्ञता राख्ने पत्रकार हुन्। उनले सुदूरपश्चिमको सांस्कृतिक विरासतलाई देशव्यापी परिचय दिएकी छन्।',
      en: 'Kamala Bhandari is a journalist with expertise in culture and tourism. She has brought national recognition to the cultural heritage of Sudurpashchim.',
    },
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    role: 'संस्कृति सम्वाददाता',
    district: 'doti',
    articleCount: 203,
  },
  {
    id: 'a5',
    slug: 'kiran-shahi',
    name: { ne: 'किरण शाही', en: 'Kiran Shahi' },
    bio: {
      ne: 'किरण शाही युवा र ऊर्जावान पत्रकार हुन् जो खेलकुद र युवा मामिलामा रिपोर्टिङ गर्छन्।',
      en: 'Kiran Shahi is a young and energetic journalist reporting on sports and youth affairs.',
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    role: 'खेलकुद सम्वाददाता',
    district: 'bajhang',
    articleCount: 156,
  },
];
