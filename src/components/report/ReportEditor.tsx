import { useReport } from '@/contexts/ReportContext';
import { KPICardEditor } from './KPICardEditor';
import { TableEditor } from './TableEditor';
import { PlatformCardEditor } from './PlatformCardEditor';
import { NoteSectionEditor } from './NoteSectionEditor';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { 
  KPICard, 
  ReportTable, 
  PlatformCard, 
  NoteSection 
} from '@/types/report';
import { 
  ChartLine, 
  Table, 
  LayoutGrid, 
  ClipboardList, 
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

const sectionIcons: Record<string, React.ElementType> = {
  'chart-line': ChartLine,
  'table': Table,
  'layout-grid': LayoutGrid,
  'clipboard-list': ClipboardList,
  'bar-chart': ChartLine
};

export function ReportEditor() {
  const { 
    reportData, 
    settings,
    updateHeader, 
    updateSectionTitle,
    toggleSectionVisibility,
    updateKPI,
    updateTableCell,
    updateTable,
    addTableRow,
    removeTableRow,
    addTableColumn,
    toggleColumnVisibility,
    updatePlatformCard,
    updateNoteSection,
    addNoteItem,
    removeNoteItem,
    updateNoteItem,
    addTable,
    addPlatformCard,
    addNoteGroup,
    removeSection
  } = useReport();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <Card className="p-8 mb-8 shadow-elevated border-0 gradient-surface">
        <div className="text-center border-b-4 border-primary pb-6">
          <EditableText
            value={reportData.header.title}
            onChange={(title) => updateHeader(title, reportData.header.subtitle)}
            className="text-3xl font-display font-black text-primary block mb-2"
          />
          <EditableText
            value={reportData.header.subtitle}
            onChange={(subtitle) => updateHeader(reportData.header.title, subtitle)}
            className="text-muted-foreground"
          />
        </div>
      </Card>

      {/* Sections */}
      {reportData.sections.map((section) => {
        const Icon = sectionIcons[section.icon] || ChartLine;
        const isCollapsed = collapsedSections[section.id];

        return (
          <Card 
            key={section.id} 
            className={`mb-6 shadow-soft border-border/50 overflow-hidden transition-all ${!section.visible ? 'opacity-60' : ''}`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <EditableText
                  value={section.title}
                  onChange={(title) => updateSectionTitle(section.id, title)}
                  className="text-xl font-bold text-foreground"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={section.visible}
                  onCheckedChange={() => toggleSectionVisibility(section.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCollapse(section.id)}
                >
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Section Content */}
            {!isCollapsed && (
              <div className="p-6">
                {section.type === 'kpi' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(section.data as KPICard[]).map((kpi) => (
                        <KPICardEditor
                          key={kpi.id}
                          kpi={kpi}
                          onUpdate={(updates) => updateKPI(section.id, kpi.id, updates)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {section.type === 'table' && (
                  <>
                    {(section.data as ReportTable[]).map((table) => (
                      <TableEditor
                        key={table.id}
                        table={table}
                        sectionId={section.id}
                        onUpdateCell={(rowId, col, value) => updateTableCell(section.id, table.id, rowId, col, value)}
                        onUpdateTitle={(title) => updateTable(section.id, table.id, { title })}
                        onAddRow={() => addTableRow(section.id, table.id)}
                        onRemoveRow={(rowId) => removeTableRow(section.id, table.id, rowId)}
                        onAddColumn={(header) => addTableColumn(section.id, table.id, header)}
                        onToggleColumnVisibility={(colId) => toggleColumnVisibility(section.id, table.id, colId)}
                      />
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addTable(section.id, 'جدول جديد')}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة جدول
                    </Button>
                  </>
                )}

                {section.type === 'platforms' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(section.data as PlatformCard[]).map((card) => (
                        <PlatformCardEditor
                          key={card.id}
                          card={card}
                          onUpdate={(updates) => updatePlatformCard(section.id, card.id, updates)}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => addPlatformCard(section.id)}
                      className="mt-4 gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة بطاقة منصة
                    </Button>
                  </>
                )}

                {section.type === 'notes' && (
                  <>
                    {(section.data as NoteSection[]).map((note) => (
                      <NoteSectionEditor
                        key={note.id}
                        note={note}
                        onUpdate={(updates) => updateNoteSection(section.id, note.id, updates)}
                        onAddItem={(item) => addNoteItem(section.id, note.id, item)}
                        onRemoveItem={(index) => removeNoteItem(section.id, note.id, index)}
                        onUpdateItem={(index, value) => updateNoteItem(section.id, note.id, index, value)}
                      />
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addNoteGroup(section.id)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة مجموعة ملاحظات
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
