import { useReport } from '@/contexts/ReportContext';
import { KPICard, ReportTable, PlatformCard, NoteSection } from '@/types/report';
import { 
  Users, 
  FileText, 
  Heart, 
  Megaphone, 
  TrendingUp,
  ChartLine,
  LayoutGrid,
  ClipboardList,
  MapPin,
  Award,
  Calendar,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const kpiIconMap: Record<string, React.ElementType> = {
  users: Users,
  'file-text': FileText,
  heart: Heart,
  megaphone: Megaphone,
  'trending-up': TrendingUp
};

const noteIconMap: Record<string, React.ElementType> = {
  award: Award,
  calendar: Calendar,
  lightbulb: Lightbulb,
  'file-text': FileText
};

const sectionIcons: Record<string, React.ElementType> = {
  'chart-line': ChartLine,
  'table': ChartLine,
  'layout-grid': LayoutGrid,
  'clipboard-list': ClipboardList,
  'bar-chart': ChartLine
};

export function ReportPreview() {
  const { reportData, settings } = useReport();

  return (
    <div id="report-preview" className="max-w-5xl mx-auto bg-card p-10 shadow-elevated rounded-xl" dir="rtl">
      {/* Header */}
      {settings.showHeader && (
        <header className="text-center border-b-4 border-primary pb-6 mb-8">
          <h1 className="text-4xl font-display font-black text-primary mb-2">
            {reportData.header.title}
          </h1>
          <p className="text-muted-foreground">{reportData.header.subtitle}</p>
        </header>
      )}

      {/* Sections */}
      {reportData.sections.filter(s => s.visible).map((section) => {
        const Icon = sectionIcons[section.icon] || ChartLine;

        return (
          <section key={section.id} className="mb-10">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-primary border-b-2 border-secondary pb-3 mb-6">
              <Icon className="w-6 h-6" />
              {section.title}
            </h2>

            {/* KPI Cards */}
            {section.type === 'kpi' && settings.showKPIs && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(section.data as KPICard[]).filter(k => k.visible).map((kpi) => {
                  const KpiIcon = kpiIconMap[kpi.icon] || TrendingUp;
                  return (
                    <div key={kpi.id} className="bg-secondary/50 rounded-lg p-5 text-center border border-border">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center">
                        <KpiIcon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                      <div className="text-sm text-muted-foreground">{kpi.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tables */}
            {section.type === 'table' && (
              <>
                {(section.data as ReportTable[]).filter(t => t.visible).map((table) => {
                  const visibleCols = table.columns.filter(c => c.visible);
                  return (
                    <div key={table.id} className="mb-8">
                      <h4 className="text-lg font-semibold text-primary mb-3">{table.title}</h4>
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full">
                          <thead>
                            <tr className="gradient-primary">
                              {visibleCols.map((col) => (
                                <th key={col.id} className="px-4 py-3 text-right text-primary-foreground font-bold">
                                  {col.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, idx) => (
                              <tr 
                                key={row.id}
                                className={`border-b border-border ${settings.enableTableStriping && idx % 2 === 1 ? 'bg-muted/30' : ''} ${settings.enableHoverEffects ? 'hover:bg-muted/50' : ''}`}
                              >
                                {visibleCols.map((col) => (
                                  <td key={col.id} className="px-4 py-3 text-right text-foreground">
                                    {row.cells[col.header] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Platform Cards */}
            {section.type === 'platforms' && settings.showPlatformCards && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(section.data as PlatformCard[]).filter(p => p.visible).map((card) => (
                  <div key={card.id} className="bg-card border border-border rounded-lg p-5 shadow-soft">
                    <h4 className="flex items-center gap-2 font-bold text-foreground border-b border-border pb-3 mb-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      {card.title}
                    </h4>
                    <ul className="space-y-2">
                      {card.items.map((item, i) => (
                        <li key={i} className="flex justify-between py-1 border-b border-dashed border-border/50 last:border-0">
                          <span className="text-muted-foreground text-sm">{item.label}</span>
                          <span className="font-semibold text-primary">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {section.type === 'notes' && settings.showNotes && (
              <>
                {(section.data as NoteSection[]).filter(n => n.visible).map((note) => {
                  const NoteIcon = noteIconMap[note.icon] || FileText;
                  return (
                    <div key={note.id} className="mb-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-3">
                        <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center">
                          <NoteIcon className="w-3.5 h-3.5 text-accent-foreground" />
                        </div>
                        {note.title}
                      </h3>
                      <ul className="space-y-2 pr-6">
                        {note.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </>
            )}
          </section>
        );
      })}

      {/* Footer */}
      {settings.showFooter && (
        <footer className="text-center border-t border-border pt-6 mt-8 text-sm text-muted-foreground">
          <p>{reportData.footer.line1}</p>
          <p>{reportData.footer.line2}</p>
        </footer>
      )}
    </div>
  );
}
