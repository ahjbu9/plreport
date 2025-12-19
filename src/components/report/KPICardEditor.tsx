import { KPICard } from '@/types/report';
import { EditableText } from './EditableText';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Users, FileText, Heart, Megaphone, TrendingUp, Eye, Share2 } from 'lucide-react';

interface KPICardEditorProps {
  kpi: KPICard;
  onUpdate: (updates: Partial<KPICard>) => void;
  isEditing?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  'file-text': FileText,
  heart: Heart,
  megaphone: Megaphone,
  'trending-up': TrendingUp,
  eye: Eye,
  share: Share2
};

export function KPICardEditor({ kpi, onUpdate, isEditing = true }: KPICardEditorProps) {
  const Icon = iconMap[kpi.icon] || TrendingUp;

  return (
    <Card className={`relative p-5 text-center shadow-soft border-border/50 transition-all duration-300 hover:shadow-elevated ${!kpi.visible ? 'opacity-50' : ''}`}>
      {isEditing && (
        <div className="absolute top-2 left-2">
          <Switch
            checked={kpi.visible}
            onCheckedChange={(checked) => onUpdate({ visible: checked })}
            className="scale-75"
          />
        </div>
      )}
      <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      {isEditing ? (
        <>
          <EditableText
            value={kpi.value}
            onChange={(value) => onUpdate({ value })}
            className="text-2xl font-bold text-foreground block mb-1"
          />
          <EditableText
            value={kpi.label}
            onChange={(label) => onUpdate({ label })}
            className="text-sm text-muted-foreground"
          />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
          <div className="text-sm text-muted-foreground">{kpi.label}</div>
        </>
      )}
    </Card>
  );
}
