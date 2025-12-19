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

export interface ReportSection {
  id: string;
  type: 'kpi' | 'table' | 'platforms' | 'notes';
  title: string;
  icon: string;
  visible: boolean;
  data: KPICard[] | ReportTable[] | PlatformCard[] | NoteSection[];
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

export interface ReportSettings {
  showHeader: boolean;
  showFooter: boolean;
  showKPIs: boolean;
  showPlatformCards: boolean;
  showNotes: boolean;
  enableTableStriping: boolean;
  enableHoverEffects: boolean;
  primaryColor: string;
  accentColor: string;
}
