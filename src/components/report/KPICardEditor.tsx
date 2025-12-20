import { KPICard } from '@/types/report';
import { EditableText } from './EditableText';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Users, FileText, Heart, Megaphone, TrendingUp, Eye, Share2, 
  BarChart3, PieChart, LineChart, Globe, Star, Zap, Target,
  CheckCircle, Clock, DollarSign, Percent, Activity,
  Plus, Trash2, ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KPICardEditorProps {
  kpi: KPICard;
  onUpdate: (updates: Partial<KPICard>) => void;
  onRemove?: () => void;
  isEditing?: boolean;
  isAutoCalculated?: boolean;
}

export const kpiIconOptions = [
  { key: 'users', icon: Users, label: 'المستخدمين' },
  { key: 'file-text', icon: FileText, label: 'الملفات' },
  { key: 'heart', icon: Heart, label: 'القلب' },
  { key: 'megaphone', icon: Megaphone, label: 'الإعلان' },
  { key: 'trending-up', icon: TrendingUp, label: 'الصعود' },
  { key: 'eye', icon: Eye, label: 'المشاهدات' },
  { key: 'share', icon: Share2, label: 'المشاركة' },
  { key: 'bar-chart', icon: BarChart3, label: 'رسم بياني' },
  { key: 'pie-chart', icon: PieChart, label: 'دائري' },
  { key: 'line-chart', icon: LineChart, label: 'خطي' },
  { key: 'globe', icon: Globe, label: 'عالمي' },
  { key: 'star', icon: Star, label: 'نجمة' },
  { key: 'zap', icon: Zap, label: 'سريع' },
  { key: 'target', icon: Target, label: 'هدف' },
  { key: 'check-circle', icon: CheckCircle, label: 'تم' },
  { key: 'clock', icon: Clock, label: 'الوقت' },
  { key: 'dollar', icon: DollarSign, label: 'مالي' },
  { key: 'percent', icon: Percent, label: 'نسبة' },
  { key: 'activity', icon: Activity, label: 'نشاط' },
];

export const iconMap: Record<string, React.ElementType> = Object.fromEntries(
  kpiIconOptions.map(opt => [opt.key, opt.icon])
);

export function KPICardEditor({ kpi, onUpdate, onRemove, isEditing = true, isAutoCalculated = false }: KPICardEditorProps) {
  const Icon = iconMap[kpi.icon] || TrendingUp;

  return (
    <Card className={`relative p-5 text-center shadow-soft border-border/50 transition-all duration-300 hover:shadow-elevated ${!kpi.visible ? 'opacity-50' : ''}`}>
      {isEditing && (
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Switch
            checked={kpi.visible}
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
      
      {isEditing ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-14 h-14 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group">
              <Icon className="w-7 h-7 text-primary-foreground" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronDown className="w-3 h-3 text-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-1 p-2">
              {kpiIconOptions.map((opt) => {
                const OptIcon = opt.icon;
                return (
                  <DropdownMenuItem
                    key={opt.key}
                    onClick={() => onUpdate({ icon: opt.key })}
                    className={`flex items-center justify-center p-2 cursor-pointer ${kpi.icon === opt.key ? 'bg-primary/20' : ''}`}
                  >
                    <OptIcon className="w-5 h-5" />
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
      )}

      {isEditing && !isAutoCalculated ? (
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
          {isAutoCalculated && (
            <div className="text-xs text-primary mt-1">(محسوب تلقائياً)</div>
          )}
        </>
      )}
    </Card>
  );
}

interface AddKPIButtonProps {
  onAdd: () => void;
  disabled?: boolean;
}

export function AddKPIButton({ onAdd, disabled }: AddKPIButtonProps) {
  return (
    <Card 
      onClick={disabled ? undefined : onAdd}
      className={`p-5 text-center border-dashed border-2 cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[140px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
        <Plus className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="text-sm text-muted-foreground">إضافة مؤشر جديد</div>
      {disabled && <div className="text-xs text-destructive mt-1">الحد الأقصى 8 مؤشرات</div>}
    </Card>
  );
}
