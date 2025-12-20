import { useState } from 'react';
import { PlatformCard } from '@/types/report';
import { EditableText } from './EditableText';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getPlatformIcon, getPlatformColor } from './PlatformIcons';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface PlatformCardEditorProps {
  card: PlatformCard;
  onUpdate: (updates: Partial<PlatformCard>) => void;
  onRemove?: () => void;
  isEditing?: boolean;
}

export function PlatformCardEditor({ card, onUpdate, onRemove, isEditing = true }: PlatformCardEditorProps) {
  const PlatformIcon = getPlatformIcon(card.title);
  const platformColor = getPlatformColor(card.title);
  
  const updateItem = (index: number, field: 'label' | 'value', newValue: string) => {
    const newItems = [...card.items];
    newItems[index] = { ...newItems[index], [field]: newValue };
    onUpdate({ items: newItems });
  };

  const addItem = () => {
    onUpdate({ items: [...card.items, { label: 'بند جديد', value: '' }] });
  };

  const removeItem = (index: number) => {
    onUpdate({ items: card.items.filter((_, i) => i !== index) });
  };

  return (
    <Card className={`relative p-5 shadow-soft border-border/50 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${!card.visible ? 'opacity-50' : ''}`}>
      {isEditing && (
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <Switch
            checked={card.visible}
            onCheckedChange={(checked) => onUpdate({ visible: checked })}
            className="scale-75"
          />
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-6 w-6 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${platformColor}20` }}
        >
          <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
        </div>
        {isEditing ? (
          <EditableText
            value={card.title}
            onChange={(title) => onUpdate({ title })}
            className="font-bold text-foreground"
          />
        ) : (
          <h4 className="font-bold text-foreground">{card.title}</h4>
        )}
      </div>

      <ul className="space-y-2">
        {card.items.map((item, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b border-dashed border-border/50 last:border-0">
            <div className="flex items-center gap-2 flex-1">
              {isEditing ? (
                <>
                  <EditableText
                    value={item.label}
                    onChange={(value) => updateItem(index, 'label', value)}
                    className="text-muted-foreground text-sm"
                  />
                  <span className="text-muted-foreground">:</span>
                  <EditableText
                    value={item.value}
                    onChange={(value) => updateItem(index, 'value', value)}
                    className="font-semibold text-primary"
                  />
                </>
              ) : (
                <>
                  <span className="text-muted-foreground text-sm">{item.label}:</span>
                  <span className="font-semibold text-primary">{item.value}</span>
                </>
              )}
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      {isEditing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={addItem}
          className="w-full mt-3 text-muted-foreground hover:text-primary"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة بند
        </Button>
      )}
    </Card>
  );
}
