import { useState } from 'react';
import { ReportProvider } from '@/contexts/ReportContext';
import { ReportEditor } from '@/components/report/ReportEditor';
import { ReportPreview } from '@/components/report/ReportPreview';
import { SettingsPage } from '@/components/report/SettingsPage';
import { ExportButtons } from '@/components/report/ExportButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Eye, Settings, FileText } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('edit');

  return (
    <ReportProvider>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground font-display">محرر التقارير</h1>
                  <p className="text-xs text-muted-foreground">نظام إنشاء وتحرير التقارير الشهرية</p>
                </div>
              </div>
              
              {activeTab === 'preview' && <ExportButtons />}
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
              <ReportEditor />
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
    </ReportProvider>
  );
};

export default Index;
