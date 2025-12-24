import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useReport } from '@/contexts/ReportContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, FolderOpen, Trash2, Calendar, FileText } from 'lucide-react';

interface SavedReport {
  id: string;
  title: string;
  month: string;
  year: string;
  created_at: string;
  updated_at: string;
}

const months = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const years = ['2024', '2025', '2026', '2027', '2028'];

export function SavedReports() {
  const { user } = useAuth();
  const { reportData, settings, loadReport, loadSettings } = useReport();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newMonth, setNewMonth] = useState('يناير');
  const [newYear, setNewYear] = useState('2025');

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, title, month, year, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('حدث خطأ في جلب التقارير');
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!newTitle.trim()) {
      toast.error('يرجى إدخال عنوان للتقرير');
      return;
    }

    setSaving(true);
    try {
      const insertData = {
        user_id: user.id,
        title: newTitle.trim(),
        month: newMonth,
        year: newYear,
        data: { reportData, settings } as unknown as import('@/integrations/supabase/types').Json
      };
      
      const { error } = await supabase
        .from('reports')
        .insert(insertData);

      if (error) throw error;

      toast.success('تم حفظ التقرير بنجاح');
      setNewTitle('');
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('حدث خطأ في حفظ التقرير');
    } finally {
      setSaving(false);
    }
  };

  const loadSavedReport = async (reportId: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('data')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      const reportDataFromDb = data.data as { reportData: any; settings: any };
      
      if (reportDataFromDb.reportData) {
        loadReport(reportDataFromDb.reportData);
      }
      if (reportDataFromDb.settings) {
        loadSettings(reportDataFromDb.settings);
      }

      toast.success('تم تحميل التقرير بنجاح');
    } catch (error) {
      console.error('Error loading report:', error);
      toast.error('حدث خطأ في تحميل التقرير');
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast.success('تم حذف التقرير بنجاح');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('حدث خطأ في حذف التقرير');
    }
  };

  if (!user) {
    return (
      <Card className="p-6 shadow-soft">
        <div className="text-center text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>يجب تسجيل الدخول لحفظ واسترجاع التقارير</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">التقارير المحفوظة</h3>
          <p className="text-sm text-muted-foreground">حفظ واسترجاع التقارير</p>
        </div>
      </div>

      {/* Save new report form */}
      <div className="p-4 bg-muted/50 rounded-lg mb-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Save className="w-4 h-4" />
          حفظ التقرير الحالي
        </h4>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>عنوان التقرير</Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: تقرير نوفمبر"
            />
          </div>
          <div>
            <Label>الشهر</Label>
            <Select value={newMonth} onValueChange={setNewMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>السنة</Label>
            <Select value={newYear} onValueChange={setNewYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={saveReport} disabled={saving} className="w-full gradient-gold text-accent-foreground">
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </div>
      </div>

      {/* Saved reports list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد تقارير محفوظة</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{report.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {report.month} {report.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadSavedReport(report.id)}
                  className="gap-1"
                >
                  <FolderOpen className="w-4 h-4" />
                  تحميل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteReport(report.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
