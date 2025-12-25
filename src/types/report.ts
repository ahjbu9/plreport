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

// Employee Evaluation
export interface EmployeeEvaluation {
  id: string;
  name: string;
  role: string;
  tasks: string;
  completionRate: number;
  notes: string;
}

export interface EmployeeEvaluationSection {
  id: string;
  title: string;
  evaluations: EmployeeEvaluation[];
  visible: boolean;
}

export interface ReportSection {
  id: string;
  type: 'kpi' | 'table' | 'platforms' | 'notes' | 'content' | 'evaluation';
  title: string;
  icon: string;
  visible: boolean;
  data: KPICard[] | ReportTable[] | PlatformCard[] | NoteSection[] | ContentCard[] | EmployeeEvaluation[];
}

// Report Types
export type ReportType = 'monthly' | 'special';

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
  reportType?: ReportType;
  month?: string;
  year?: string;
  specialReportName?: string;
  campaignName?: string;
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

// Saved Report from database
export interface SavedReport {
  id: string;
  title: string;
  month: string;
  year: string;
  data: ReportData;
  created_at: string;
  updated_at: string;
  user_id: string;
  report_type?: ReportType;
  campaign_name?: string;
}
