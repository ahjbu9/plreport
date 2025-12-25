import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Archive, 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  GitCompare,
  Calendar,
  Sparkles,
  Home,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { ReportData } from '@/types/report';

interface SavedReport {
  id: string;
  title: string;
  month: string;
  year: string;
  data: ReportData;
  created_at: string;
  updated_at: string;
}

export default function ReportArchive() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('خطأ في تحميل التقارير');
      console.error(error);
    } else {
      setReports((data || []).map(r => ({
        ...r,
        data: r.data as unknown as ReportData
      })));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;
    
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportToDelete);

    if (error) {
      toast.error('خطأ في حذف التقرير');
    } else {
      toast.success('تم حذف التقرير بنجاح');
      fetchReports();
    }
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const handleBulkDelete = async () => {
    if (selectedReports.length === 0) return;
    
    const { error } = await supabase
      .from('reports')
      .delete()
      .in('id', selectedReports);

    if (error) {
      toast.error('خطأ في حذف التقارير');
    } else {
      toast.success(`تم حذف ${selectedReports.length} تقارير بنجاح`);
      setSelectedReports([]);
      fetchReports();
    }
  };

  const handleCompare = () => {
    if (selectedReports.length !== 2) {
      toast.error('يرجى اختيار تقريرين للمقارنة');
      return;
    }
    navigate(`/compare?reports=${selectedReports.join(',')}`);
  };

  const handleEdit = (reportId: string) => {
    navigate(`/editor?edit=${reportId}`);
  };

  const handleExport = async (report: SavedReport) => {
    const dataStr = JSON.stringify(report.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const fileName = `${report.title.replace(/\s+/g, '_')}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('تم تصدير التقرير بنجاح');
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.year.includes(searchQuery) ||
    report.month.includes(searchQuery)
  );

  const getReportType = (report: SavedReport) => {
    return report.data.reportType === 'special' ? 'special' : 'monthly';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Archive className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">أرشيف التقارير</h1>
                <p className="text-xs text-muted-foreground">{reports.length} تقرير محفوظ</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedReports.length === 2 && (
                <Button onClick={handleCompare} variant="outline" className="gap-2">
                  <GitCompare className="w-4 h-4" />
                  مقارنة
                </Button>
              )}
              {selectedReports.length > 0 && (
                <Button onClick={handleBulkDelete} variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  حذف ({selectedReports.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في التقارير..."
            className="pr-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredReports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد تقارير</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإنشاء تقريرك الأول</p>
              <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground">
                إنشاء تقرير جديد
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className={`border transition-all duration-200 ${
                  selectedReports.includes(report.id) 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={() => toggleReportSelection(report.id)}
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        getReportType(report) === 'special' ? 'gradient-gold' : 'gradient-primary'
                      }`}>
                        {getReportType(report) === 'special' ? (
                          <Sparkles className="w-5 h-5 text-accent-foreground" />
                        ) : (
                          <Calendar className="w-5 h-5 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <Badge variant={getReportType(report) === 'special' ? 'secondary' : 'default'}>
                      {getReportType(report) === 'special' ? 'خاص' : 'شهري'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(report.created_at)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => handleEdit(report.id)}
                    >
                      <Edit className="w-3 h-3" />
                      تعديل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(report)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setReportToDelete(report.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف التقرير نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
