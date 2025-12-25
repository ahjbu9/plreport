import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReportProvider, useReport } from '@/contexts/ReportContext';
import { ReportEditor as Editor } from '@/components/report/ReportEditor';
import { ReportPreview } from '@/components/report/ReportPreview';
import { SettingsPage } from '@/components/report/SettingsPage';
import { ExportButtons } from '@/components/report/ExportButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Pencil, Eye, Settings, Save, Home, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ReportData } from '@/types/report';
import { Json } from '@/integrations/supabase/types';

function EditorContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reportData, loadReport, updateHeader } = useReport();
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const reportType = searchParams.get('type') as 'monthly' | 'special' || 'monthly';
  const month = searchParams.get('month') || '';
  const year = searchParams.get('year') || '';
  const title = searchParams.get('title') || '';
  const editId = searchParams.get('edit');
  const specialName = searchParams.get('name') || '';
  const campaignName = searchParams.get('campaign') || '';

  useEffect(() => {
    if (editId) {
      loadExistingReport(editId);
    } else if (title) {
      updateHeader(title, `تاريخ إصدار التقرير: ${new Date().toLocaleDateString('ar-SA')}`);
    } else if (specialName) {
      updateHeader(specialName, campaignName ? `حملة: ${campaignName}` : `تاريخ: ${new Date().toLocaleDateString('ar-SA')}`);
    }
  }, [editId, title, specialName]);

  const loadExistingReport = async (id: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('خطأ في تحميل التقرير');
      navigate('/archive');
      return;
    }

    setReportId(id);
    loadReport(data.data as unknown as ReportData);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setSaving(true);

    const reportPayload = {
      title: reportData.header.title,
      month: month || new Date().getMonth().toString().padStart(2, '0'),
      year: year || new Date().getFullYear().toString(),
      data: {
        ...reportData,
        reportType,
        month,
        year,
        specialReportName: specialName,
        campaignName
      } as unknown as Json,
      user_id: user.id
    };

    try {
      if (reportId) {
        // Update existing report
        const { error } = await supabase
          .from('reports')
          .update(reportPayload)
          .eq('id', reportId);

        if (error) throw error;
        toast.success('تم تحديث التقرير بنجاح');
      } else {
        // Create new report
        const { data, error } = await supabase
          .from('reports')
          .insert(reportPayload)
          .select()
          .single();

        if (error) throw error;
        setReportId(data.id);
        toast.success('تم حفظ التقرير بنجاح');
      }
    } catch (error) {
      console.error(error);
      toast.error('خطأ في حفظ التقرير');
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="w-5 h-5" />
              </Button>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                reportType === 'special' ? 'gradient-gold' : 'gradient-primary'
              }`}>
                {reportType === 'special' ? (
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                ) : (
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground font-display">محرر التقارير</h1>
                  <Badge variant={reportType === 'special' ? 'secondary' : 'default'}>
                    {reportType === 'special' ? 'تقرير خاص' : 'تقرير شهري'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{reportData.header.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gap-2 gradient-primary text-primary-foreground"
              >
                <Save className="w-4 h-4" />
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              {activeTab === 'preview' && <ExportButtons />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 h-auto p-1.5 bg-muted/50">
            <TabsTrigger value="edit" className="gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <Pencil className="w-4 h-4" />
              التحرير
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <Eye className="w-4 h-4" />
              المعاينة
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="animate-fade-up">
            <Editor />
          </TabsContent>

          <TabsContent value="preview" className="animate-fade-up">
            <ReportPreview />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-up">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function ReportEditorPage() {
  return (
    <ReportProvider>
      <EditorContent />
    </ReportProvider>
  );
}
