import { NoteSection } from '@/types/report';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Award, Calendar, Lightbulb, FileText, Plus, Trash2, CheckCircle } from 'lucide-react';

interface NoteSectionEditorProps {
  note: NoteSection;
  onUpdate: (updates: Partial<NoteSection>) => void;
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, value: string) => void;
  isEditing?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  calendar: Calendar,
  lightbulb: Lightbulb,
  'file-text': FileText
};

export function NoteSectionEditor({ 
  note, 
  onUpdate, 
  onAddItem, 
  onRemoveItem, 
  onUpdateItem,
  isEditing = true 
}: NoteSectionEditorProps) {
  const Icon = iconMap[note.icon] || FileText;

  return (
    <div className={`mb-8 ${!note.visible ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-foreground" />
          </div>
          {isEditing ? (
            <EditableText
              value={note.title}
              onChange={(title) => onUpdate({ title })}
              className="text-lg font-semibold text-primary"
            />
          ) : (
            <h3 className="text-lg font-semibold text-primary">{note.title}</h3>
          )}
        </div>
        {isEditing && (
          <Switch
            checked={note.visible}
            onCheckedChange={(checked) => onUpdate({ visible: checked })}
          />
        )}
      </div>

      <ul className="space-y-3 pr-6">
        {note.items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {isEditing ? (
                <EditableText
                  value={item}
                  onChange={(value) => onUpdateItem(index, value)}
                  className="text-foreground"
                  multiline
                />
              ) : (
                <span className="text-foreground">{item}</span>
              )}
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddItem('ملاحظة جديدة')}
          className="mt-4 mr-6"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة ملاحظة
        </Button>
      )}
    </div>
  );
}
