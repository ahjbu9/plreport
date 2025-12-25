import { useReport } from '@/contexts/ReportContext';
import { KPICardEditor, AddKPIButton } from './KPICardEditor';
import { TableEditor } from './TableEditor';
import { PlatformCardEditor } from './PlatformCardEditor';
import { NoteSectionEditor } from './NoteSectionEditor';
import { ContentCardEditor, AddContentCardButton } from './ContentCardEditor';
import { EmployeeEvaluationEditor } from './EmployeeEvaluationEditor';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useFollowerCalculation } from '@/hooks/useFollowerCalculation';
import { 
  KPICard, 
  ReportTable, 
  PlatformCard, 
  NoteSection,
  ContentCard,
  EmployeeEvaluation
} from '@/types/report';
import { 
  ChartLine, 
  Table, 
  LayoutGrid, 
  ClipboardList, 
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  Users
} from 'lucide-react';
import { useState } from 'react';

const sectionIcons: Record<string, React.ElementType> = {
  'chart-line': ChartLine,
  'table': Table,
  'layout-grid': LayoutGrid,
  'clipboard-list': ClipboardList,
  'bar-chart': ChartLine,
  'sparkles': Sparkles,
  'users': Users
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
    removeSection,
    addKPI,
    removeKPI,
    removePlatformCard,
    updateContentCard,
    addContentCard,
    removeContentCard,
    updateEmployeeEvaluation
  } = useReport();

  const followerData = useFollowerCalculation(reportData);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Get KPI with auto-calculated total followers
  const getKPIWithAutoValue = (kpi: KPICard) => {
    if (kpi.label.includes('إجمالي المتابعين') && followerData) {
      return { ...kpi, value: followerData.formattedTotal };
    }
    return kpi;
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
                      {(section.data as KPICard[]).map((kpi) => {
                        const kpiWithAutoValue = getKPIWithAutoValue(kpi);
                        const isAutoCalculated = kpi.label.includes('إجمالي المتابعين') && !!followerData;
                        return (
                          <KPICardEditor
                            key={kpi.id}
                            kpi={kpiWithAutoValue}
                            onUpdate={(updates) => updateKPI(section.id, kpi.id, updates)}
                            onRemove={(section.data as KPICard[]).length > 3 ? () => removeKPI(section.id, kpi.id) : undefined}
                            isAutoCalculated={isAutoCalculated}
                          />
                        );
                      })}
                      {(section.data as KPICard[]).length < 8 && (
                        <AddKPIButton 
                          onAdd={() => addKPI(section.id)}
                          disabled={(section.data as KPICard[]).length >= 8}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      * يمكنك إضافة من 3 إلى 8 مؤشرات. إذا كان المؤشر يحتوي على "إجمالي المتابعين" في عنوانه، سيتم حسابه تلقائياً من جدول المنصات.
                    </p>
                  </>
                )}

                {section.type === 'content' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {(section.data as ContentCard[]).map((card) => (
                        <ContentCardEditor
                          key={card.id}
                          card={card}
                          onUpdate={(updates) => updateContentCard(section.id, card.id, updates)}
                          onRemove={() => removeContentCard(section.id, card.id)}
                        />
                      ))}
                      {(section.data as ContentCard[]).length < 8 && (
                        <AddContentCardButton 
                          onAdd={() => addContentCard(section.id)}
                          disabled={(section.data as ContentCard[]).length >= 8}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      * يمكنك إضافة حتى 8 بطاقات محتوى مميز. اضغط على الصورة لرفع ثمبنيل جديد.
                    </p>
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
                          onRemove={() => removePlatformCard(section.id, card.id)}
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

                {section.type === 'evaluation' && (
                  <EmployeeEvaluationEditor
                    sectionId={section.id}
                    evaluations={section.data as EmployeeEvaluation[]}
                    onUpdate={updateEmployeeEvaluation}
                  />
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
