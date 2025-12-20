import { 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle, 
  Send, 
  Youtube,
  Linkedin,
  Globe,
  Smartphone,
  Radio,
  Tv,
  Rss
} from 'lucide-react';

export const platformIcons: Record<string, React.ElementType> = {
  'فيسبوك': Facebook,
  'facebook': Facebook,
  'تويتر': Twitter,
  'تويتر (X)': Twitter,
  'twitter': Twitter,
  'x': Twitter,
  'إنستغرام': Instagram,
  'انستغرام': Instagram,
  'instagram': Instagram,
  'واتساب': MessageCircle,
  'واتساب (قنوات)': MessageCircle,
  'whatsapp': MessageCircle,
  'تلغرام': Send,
  'telegram': Send,
  'يوتيوب': Youtube,
  'youtube': Youtube,
  'لينكدإن': Linkedin,
  'linkedin': Linkedin,
  'موقع': Globe,
  'website': Globe,
  'تطبيق': Smartphone,
  'app': Smartphone,
  'راديو': Radio,
  'radio': Radio,
  'تلفزيون': Tv,
  'tv': Tv,
  'rss': Rss
};

export const getPlatformIcon = (platform: string): React.ElementType => {
  const normalizedPlatform = platform.toLowerCase().trim();
  
  for (const [key, icon] of Object.entries(platformIcons)) {
    if (normalizedPlatform.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedPlatform)) {
      return icon;
    }
  }
  
  return Globe;
};

export const platformColors: Record<string, string> = {
  'فيسبوك': '#1877F2',
  'facebook': '#1877F2',
  'تويتر': '#1DA1F2',
  'تويتر (X)': '#000000',
  'twitter': '#1DA1F2',
  'x': '#000000',
  'إنستغرام': '#E4405F',
  'انستغرام': '#E4405F',
  'instagram': '#E4405F',
  'واتساب': '#25D366',
  'واتساب (قنوات)': '#25D366',
  'whatsapp': '#25D366',
  'تلغرام': '#0088CC',
  'telegram': '#0088CC',
  'يوتيوب': '#FF0000',
  'youtube': '#FF0000',
  'لينكدإن': '#0A66C2',
  'linkedin': '#0A66C2'
};

export const getPlatformColor = (platform: string): string => {
  const normalizedPlatform = platform.toLowerCase().trim();
  
  for (const [key, color] of Object.entries(platformColors)) {
    if (normalizedPlatform.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedPlatform)) {
      return color;
    }
  }
  
  return '#00796b';
};
