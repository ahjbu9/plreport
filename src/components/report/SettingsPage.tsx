import { useReport } from '@/contexts/ReportContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EditableText } from './EditableText';
import { 
  Settings2, 
  Eye, 
  Type, 
  FileOutput,
  Plus
} from 'lucide-react';

export function SettingsPage() {
  const { 
    reportData,
    settings, 
    updateSettings, 
    updateFooter,
    addSection 
  } = useReport();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Settings2 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">تخصيص مظهر ومحتوى التقرير</p>
        </div>
      </div>

      <Tabs defaultValue="display" dir="rtl" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
          <TabsTrigger value="display" className="gap-2 py-3">
            <Eye className="w-4 h-4" />
            العرض
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2 py-3">
            <Type className="w-4 h-4" />
            المحتوى
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-2 py-3">
            <FileOutput className="w-4 h-4" />
            الأقسام
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2 py-3">
            <Settings2 className="w-4 h-4" />
            متقدم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display">
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">إعدادات العرض</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">إظهار ترويسة التقرير</Label>
                  <p className="text-sm text-muted-foreground">العنوان الرئيسي وتاريخ الإصدار</p>
                </div>
                <Switch
                  checked={settings.showHeader}
                  onCheckedChange={(checked) => updateSettings({ showHeader: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">إظهار تذييل التقرير</Label>
                  <p className="text-sm text-muted-foreground">معلومات حقوق النشر</p>
                </div>
                <Switch
                  checked={settings.showFooter}
                  onCheckedChange={(checked) => updateSettings({ showFooter: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">إظهار بطاقات المؤشرات (KPI)</Label>
                  <p className="text-sm text-muted-foreground">الأرقام الرئيسية في أعلى القسم</p>
                </div>
                <Switch
                  checked={settings.showKPIs}
                  onCheckedChange={(checked) => updateSettings({ showKPIs: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">إظهار بطاقات المنصات</Label>
                  <p className="text-sm text-muted-foreground">بطاقات المنصات الفرعية</p>
                </div>
                <Switch
                  checked={settings.showPlatformCards}
                  onCheckedChange={(checked) => updateSettings({ showPlatformCards: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">إظهار الملاحظات</Label>
                  <p className="text-sm text-muted-foreground">قسم الملاحظات والتوصيات</p>
                </div>
                <Switch
                  checked={settings.showNotes}
                  onCheckedChange={(checked) => updateSettings({ showNotes: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">تذييل التقرير</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-2 block">السطر الأول</Label>
                <Input
                  value={reportData.footer.line1}
                  onChange={(e) => updateFooter(e.target.value, reportData.footer.line2)}
                  dir="rtl"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-2 block">السطر الثاني</Label>
                <Input
                  value={reportData.footer.line2}
                  onChange={(e) => updateFooter(reportData.footer.line1, e.target.value)}
                  dir="rtl"
                  className="bg-background"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">إضافة قسم جديد</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => addSection('kpi')}
                className="h-24 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم مؤشرات KPI</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => addSection('table')}
                className="h-24 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم جداول</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => addSection('platforms')}
                className="h-24 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم منصات</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => addSection('notes')}
                className="h-24 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم ملاحظات</span>
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">إعدادات الجداول</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="text-foreground font-medium">تلوين الصفوف بالتناوب</Label>
                  <p className="text-sm text-muted-foreground">إضافة لون خلفية للصفوف الفردية</p>
                </div>
                <Switch
                  checked={settings.enableTableStriping}
                  onCheckedChange={(checked) => updateSettings({ enableTableStriping: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-foreground font-medium">تأثيرات التحويم</Label>
                  <p className="text-sm text-muted-foreground">تغيير لون الصف عند المرور عليه</p>
                </div>
                <Switch
                  checked={settings.enableHoverEffects}
                  onCheckedChange={(checked) => updateSettings({ enableHoverEffects: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
