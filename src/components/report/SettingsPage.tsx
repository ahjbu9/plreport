import { useNavigate } from 'react-router-dom';
import { useReport } from '@/contexts/ReportContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionOrderEditor } from './SectionOrderEditor';
import { 
  Settings2, 
  Eye, 
  FileOutput,
  Plus,
  RotateCcw,
  Palette,
  Mail,
  X,
  Sparkles,
  Save,
  Send,
  BarChart3,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function SettingsPage() {
  const navigate = useNavigate();
  const { 
    reportData,
    settings, 
    updateSettings, 
    updateFooter,
    addSection,
    resetToDefault
  } = useReport();

  const [newEmail, setNewEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('monthly-report-settings', JSON.stringify(settings));
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  const addEmail = () => {
    if (newEmail && !settings.email.emails.includes(newEmail)) {
      updateSettings({
        email: { ...settings.email, emails: [...settings.email.emails, newEmail] }
      });
      setNewEmail('');
      toast.success('تمت إضافة البريد الإلكتروني');
    }
  };

  const removeEmail = (email: string) => {
    updateSettings({
      email: { ...settings.email, emails: settings.email.emails.filter(e => e !== email) }
    });
  };

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
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted">
          <TabsTrigger value="display" className="gap-2 py-3">
            <Eye className="w-4 h-4" />
            العرض
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2 py-3">
            <Palette className="w-4 h-4" />
            المظهر
          </TabsTrigger>
          <TabsTrigger value="order" className="gap-2 py-3">
            <GripVertical className="w-4 h-4" />
            الترتيب
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2 py-3">
            <Mail className="w-4 h-4" />
            البريد
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">إعدادات العرض</h3>
              <Button onClick={handleSaveSettings} className="gap-2 gradient-primary text-primary-foreground">
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </Button>
            </div>
            
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
                  <Label className="text-foreground font-medium">إظهار قسم أفضل محتوى</Label>
                  <p className="text-sm text-muted-foreground">بطاقات المحتوى المميز</p>
                </div>
                <Switch
                  checked={settings.showContent}
                  onCheckedChange={(checked) => updateSettings({ showContent: checked })}
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

        <TabsContent value="theme">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">تخصيص المظهر</h3>
              <Button onClick={handleSaveSettings} className="gap-2 gradient-primary text-primary-foreground">
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-foreground font-medium mb-2 block">نمط البطاقات</Label>
                <Select 
                  value={settings.theme.cardStyle} 
                  onValueChange={(value: 'modern' | 'classic' | 'minimal') => 
                    updateSettings({ theme: { ...settings.theme, cardStyle: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">عصري</SelectItem>
                    <SelectItem value="classic">كلاسيكي</SelectItem>
                    <SelectItem value="minimal">بسيط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">الخط</Label>
                <Select 
                  value={settings.theme.fontFamily} 
                  onValueChange={(value: 'cairo' | 'tajawal' | 'both') => 
                    updateSettings({ theme: { ...settings.theme, fontFamily: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cairo">Cairo</SelectItem>
                    <SelectItem value="tajawal">Tajawal</SelectItem>
                    <SelectItem value="both">مزيج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="order">
          <SectionOrderEditor />
          
          <Card className="p-6 shadow-soft mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              مقارنة التقارير
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              قارن بين التقارير الشهرية باستخدام الرسوم البيانية والجداول
            </p>
            <Button onClick={() => navigate('/compare')} className="gap-2 gradient-gold text-accent-foreground">
              <BarChart3 className="w-4 h-4" />
              الانتقال لصفحة المقارنة
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">إعدادات البريد الإلكتروني</h3>
              <Button onClick={handleSaveSettings} className="gap-2 gradient-primary text-primary-foreground">
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-foreground font-medium mb-2 block">اسم المؤسسة</Label>
                <Input
                  value={settings.email.organizationName}
                  onChange={(e) => updateSettings({ email: { ...settings.email, organizationName: e.target.value } })}
                  dir="rtl"
                  className="bg-background"
                />
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">شهر التقرير</Label>
                <Input
                  value={settings.email.reportMonth}
                  onChange={(e) => updateSettings({ email: { ...settings.email, reportMonth: e.target.value } })}
                  dir="rtl"
                  className="bg-background"
                  placeholder="مثال: نوفمبر 2025"
                />
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">قائمة البريد الإلكتروني</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    dir="ltr"
                    className="bg-background"
                  />
                  <Button onClick={addEmail} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.email.emails.map((email) => (
                    <span key={email} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {email}
                      <button onClick={() => removeEmail(email)} className="text-destructive hover:text-destructive/80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-md font-semibold text-foreground mb-4">إرسال التقرير بالبريد الإلكتروني</h4>
              <p className="text-sm text-muted-foreground mb-4">
                سيتم إرسال التقرير بثلاث نسخ (PDF، Word، JSON) إلى جميع العناوين المحددة أعلاه.
              </p>
              <Button 
                disabled={settings.email.emails.length === 0 || isSending}
                className="gap-2 gradient-gold text-accent-foreground w-full md:w-auto"
                onClick={() => {
                  if (settings.email.emails.length === 0) {
                    toast.error('يرجى إضافة بريد إلكتروني أولاً');
                    return;
                  }
                  toast.info('لإرسال التقرير بالبريد الإلكتروني، يلزم تفعيل Lovable Cloud');
                }}
              >
                <Send className="w-4 h-4" />
                {isSending ? 'جاري الإرسال...' : 'إرسال التقرير'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">إضافة قسم جديد</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => addSection('kpi')} className="h-24 flex-col gap-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم مؤشرات KPI</span>
              </Button>

              <Button variant="outline" onClick={() => addSection('content')} className="h-24 flex-col gap-2">
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <span>قسم أفضل محتوى</span>
              </Button>

              <Button variant="outline" onClick={() => addSection('table')} className="h-24 flex-col gap-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم جداول</span>
              </Button>

              <Button variant="outline" onClick={() => addSection('platforms')} className="h-24 flex-col gap-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>قسم منصات</span>
              </Button>

              <Button variant="outline" onClick={() => addSection('notes')} className="h-24 flex-col gap-2 col-span-2">
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">إعدادات الجداول</h3>
              <Button onClick={handleSaveSettings} className="gap-2 gradient-primary text-primary-foreground">
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </Button>
            </div>
            
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

              <div className="flex items-center justify-between py-3 border-b border-border">
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

          <Card className="p-6 shadow-soft mt-6">
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

          <Card className="p-6 shadow-soft mt-6 border-destructive/30">
            <h3 className="text-lg font-semibold text-destructive mb-4">إعادة التعيين</h3>
            <p className="text-sm text-muted-foreground mb-4">
              سيتم إعادة جميع البيانات والإعدادات إلى الوضع الافتراضي. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                resetToDefault();
                toast.success('تم إعادة التعيين إلى الوضع الافتراضي');
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة التعيين للوضع الافتراضي
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
