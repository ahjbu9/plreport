import { ContentCard, ContentType } from '@/types/report';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Image, 
  Trash2, 
  Upload, 
  Film, 
  Palette, 
  BarChart3, 
  Images, 
  Sparkles, 
  Mic,
  Plus
} from 'lucide-react';
import { useRef } from 'react';

interface ContentCardEditorProps {
  card: ContentCard;
  onUpdate: (updates: Partial<ContentCard>) => void;
  onRemove?: () => void;
}

const contentTypeConfig: Record<ContentType, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  album: { label: 'ألبوم صور', icon: Images, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  infographic: { label: 'تصميم معلوماتي', icon: BarChart3, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  design: { label: 'تصميم', icon: Palette, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  video: { label: 'فيديو', icon: Film, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  ai: { label: 'ذكاء اصطناعي', icon: Sparkles, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  voiceover: { label: 'فويس أوفر', icon: Mic, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' }
};

export function ContentCardEditor({ card, onUpdate, onRemove }: ContentCardEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = contentTypeConfig[card.contentType];
  const TypeIcon = config.icon;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-soft transition-all hover:shadow-elevated flex flex-col">
      {/* Thumbnail - Adaptive container */}
      <div 
        className="relative bg-muted cursor-pointer group min-h-[120px] max-h-[200px] flex items-center justify-center overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {card.thumbnail ? (
          <img 
            src={card.thumbnail} 
            alt={card.description}
            className="w-full h-auto max-h-[200px] object-contain"
          />
        ) : (
          <div className="w-full h-[140px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Image className="w-10 h-10" />
            <span className="text-sm">اضغط لرفع صورة</span>
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleImageUpload}
        />
        
        {/* Content Type Badge */}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md ${config.bgColor} ${config.color}`}>
          <TypeIcon className="w-3.5 h-3.5" />
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">نوع المحتوى</Label>
          <Select 
            value={card.contentType} 
            onValueChange={(value: ContentType) => onUpdate({ contentType: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(contentTypeConfig).map(([key, val]) => {
                const Icon = val.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${val.color}`} />
                      {val.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">وصف المحتوى</Label>
          <Textarea
            value={card.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="أدخل وصف المحتوى..."
            className="mt-1 min-h-[60px] resize-none"
            dir="rtl"
          />
        </div>

        {onRemove && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف البطاقة
          </Button>
        )}
      </div>
    </Card>
  );
}

export function AddContentCardButton({ onAdd, disabled }: { onAdd: () => void; disabled?: boolean }) {
  return (
    <Card 
      className={`aspect-[4/3] flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 border-border hover:border-primary hover:bg-muted/50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onAdd}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Plus className="w-6 h-6 text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">إضافة محتوى</span>
    </Card>
  );
}

// Content Type Badge for Preview
export function ContentTypeBadge({ type }: { type: ContentType }) {
  const config = contentTypeConfig[type];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export { contentTypeConfig };
