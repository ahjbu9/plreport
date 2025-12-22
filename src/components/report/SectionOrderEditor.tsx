import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useReport } from '@/contexts/ReportContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GripVertical, 
  Save, 
  RotateCcw,
  ChartLine,
  Table,
  LayoutGrid,
  ClipboardList,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const sectionIcons: Record<string, React.ElementType> = {
  'kpi': ChartLine,
  'content': Sparkles,
  'table': Table,
  'platforms': LayoutGrid,
  'notes': ClipboardList
};

export function SectionOrderEditor() {
  const { reportData, updateSectionsOrder, saveToLocalStorage } = useReport();
  const [sections, setSections] = useState(reportData.sections);

  useEffect(() => {
    setSections(reportData.sections);
  }, [reportData.sections]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setSections(items);
  };

  const handleSave = () => {
    updateSectionsOrder(sections);
    saveToLocalStorage();
    toast.success('تم حفظ ترتيب الأقسام');
  };

  const handleReset = () => {
    setSections(reportData.sections);
    toast.info('تم إعادة الترتيب الأصلي');
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">ترتيب الأقسام</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            إعادة
          </Button>
          <Button onClick={handleSave} className="gap-2 gradient-primary text-primary-foreground">
            <Save className="w-4 h-4" />
            حفظ الترتيب
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        اسحب وأفلت الأقسام لتغيير ترتيبها في التقرير
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-2"
            >
              {sections.map((section, index) => {
                const Icon = sectionIcons[section.type] || ChartLine;
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          snapshot.isDragging 
                            ? 'bg-primary/10 border-primary shadow-lg' 
                            : 'bg-muted/30 border-border hover:border-primary/50'
                        }`}
                      >
                        <div 
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>
                        
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{section.title}</span>
                          <span className="text-xs text-muted-foreground mr-2">
                            ({section.type})
                          </span>
                        </div>

                        {section.visible ? (
                          <Eye className="w-4 h-4 text-primary" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}

                        <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}
