export interface TableColumn {
  id: string;
  header: string;
  visible: boolean;
}

export interface TableRow {
  id: string;
  cells: Record<string, string>;
}

export interface ReportTable {
  id: string;
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
  visible: boolean;
}

export interface KPICard {
  id: string;
  icon: string;
  value: string;
  label: string;
  visible: boolean;
}

export interface PlatformCard {
  id: string;
  title: string;
  items: { label: string; value: string }[];
  visible: boolean;
}

export interface NoteSection {
  id: string;
  title: string;
  icon: string;
  items: string[];
  visible: boolean;
}

// Content Types for Best Content Section
export type ContentType = 'album' | 'infographic' | 'design' | 'video' | 'ai' | 'voiceover';

export interface ContentCard {
  id: string;
  thumbnail: string; // base64 or URL
  contentType: ContentType;
  description: string;
  visible: boolean;
}

export interface ContentSection {
  id: string;
  title: string;
  icon: string;
  cards: ContentCard[];
  visible: boolean;
}

export interface ReportSection {
  id: string;
  type: 'kpi' | 'table' | 'platforms' | 'notes' | 'content';
  title: string;
  icon: string;
  visible: boolean;
  data: KPICard[] | ReportTable[] | PlatformCard[] | NoteSection[] | ContentCard[];
}

export interface ReportHeader {
  title: string;
  subtitle: string;
}

export interface ReportFooter {
  line1: string;
  line2: string;
}

export interface ReportData {
  header: ReportHeader;
  sections: ReportSection[];
  footer: ReportFooter;
}

export interface EmailSettings {
  emails: string[];
  organizationName: string;
  reportMonth: string;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  cardStyle: 'modern' | 'classic' | 'minimal';
  fontFamily: 'cairo' | 'tajawal' | 'both';
}

export interface ReportSettings {
  showHeader: boolean;
  showFooter: boolean;
  showKPIs: boolean;
  showPlatformCards: boolean;
  showNotes: boolean;
  showContent: boolean;
  enableTableStriping: boolean;
  enableHoverEffects: boolean;
  primaryColor: string;
  accentColor: string;
  email: EmailSettings;
  theme: ThemeSettings;
}
