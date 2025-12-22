import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  Upload, 
  Trash2, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  FileJson,
  Download,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { ReportData, ReportTable, KPICard } from '@/types/report';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

interface SavedReport {
  id: string;
  month: string;
  year: string;
  data: ReportData;
  savedAt: string;
}

const STORAGE_KEY = 'saved-reports-archive';

const COLORS = ['#00796b', '#d4af37', '#e91e63', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#607d8b'];

export default function CompareReports() {
  const navigate = useNavigate();
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());

  const handleImportReport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.reportData) {
          const newReport: SavedReport = {
            id: Math.random().toString(36).substr(2, 9),
            month: newMonth || 'غير محدد',
            year: newYear,
            data: parsed.reportData,
            savedAt: new Date().toISOString()
          };
          const updated = [...savedReports, newReport];
          setSavedReports(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          toast.success(`تم حفظ تقرير ${newMonth} ${newYear}`);
          setNewMonth('');
        } else {
          toast.error('ملف غير صالح');
        }
      } catch {
        toast.error('فشل قراءة الملف');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [savedReports, newMonth, newYear]);

  const deleteReport = (id: string) => {
    const updated = savedReports.filter(r => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedReports(prev => prev.filter(rid => rid !== id));
    toast.success('تم حذف التقرير');
  };

  const toggleSelectReport = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const selectedReportsData = savedReports.filter(r => selectedReports.includes(r.id));

  // Extract followers data from reports
  const getFollowersData = () => {
    return selectedReportsData.map(report => {
      const tableSection = report.data.sections.find(s => s.type === 'table');
      if (!tableSection) return { name: `${report.month} ${report.year}`, total: 0 };
      
      const tables = tableSection.data as ReportTable[];
      const followersTable = tables.find(t => 
        t.columns.some(c => c.header.includes('متابعين') || c.header.includes('عدد المتابعين'))
      );
      
      if (!followersTable) return { name: `${report.month} ${report.year}`, total: 0 };
      
      const followersCol = followersTable.columns.find(c => 
        c.header.includes('متابعين') || c.header.includes('عدد المتابعين')
      );
      
      if (!followersCol) return { name: `${report.month} ${report.year}`, total: 0 };
      
      let total = 0;
      followersTable.rows.forEach(row => {
        const val = row.cells[followersCol.header] || '0';
        const cleaned = val.replace(/[,،\s]/g, '');
        const num = parseFloat(cleaned.match(/[\d.]+/)?.[0] || '0');
        total += num;
      });
      
      return { name: `${report.month} ${report.year}`, total };
    });
  };

  // Extract KPIs comparison
  const getKPIsComparison = () => {
    const kpiLabels = new Set<string>();
    selectedReportsData.forEach(report => {
      const kpiSection = report.data.sections.find(s => s.type === 'kpi');
      if (kpiSection) {
        (kpiSection.data as KPICard[]).forEach(kpi => kpiLabels.add(kpi.label));
      }
    });

    return Array.from(kpiLabels).map(label => {
      const row: Record<string, any> = { name: label };
      selectedReportsData.forEach(report => {
        const kpiSection = report.data.sections.find(s => s.type === 'kpi');
        if (kpiSection) {
          const kpi = (kpiSection.data as KPICard[]).find(k => k.label === label);
          if (kpi) {
            const val = kpi.value.replace(/[,،\s]/g, '');
            const num = parseFloat(val.match(/[\d.]+/)?.[0] || '0');
            row[`${report.month} ${report.year}`] = num;
          }
        }
      });
      return row;
    });
  };

  // Platform data per report
  const getPlatformComparison = () => {
    const platforms = new Set<string>();
    const data: Record<string, Record<string, number>> = {};

    selectedReportsData.forEach(report => {
      const tableSection = report.data.sections.find(s => s.type === 'table');
      if (!tableSection) return;
      
      const tables = tableSection.data as ReportTable[];
      const followersTable = tables.find(t => 
        t.columns.some(c => c.header.includes('المنصة'))
      );
      
      if (!followersTable) return;
      
      const platformCol = followersTable.columns.find(c => c.header.includes('المنصة'));
      const followersCol = followersTable.columns.find(c => 
        c.header.includes('متابعين') || c.header.includes('عدد المتابعين')
      );
      
      if (!platformCol || !followersCol) return;
      
      followersTable.rows.forEach(row => {
        const platform = row.cells[platformCol.header];
        const val = row.cells[followersCol.header] || '0';
        const cleaned = val.replace(/[,،\s]/g, '');
        const num = parseFloat(cleaned.match(/[\d.]+/)?.[0] || '0');
        
        if (platform) {
          platforms.add(platform);
          if (!data[platform]) data[platform] = {};
          data[platform][`${report.month} ${report.year}`] = num;
        }
      });
    });

    return Array.from(platforms).map(platform => ({
      name: platform,
      ...data[platform]
    }));
  };

  const followersData = getFollowersData();
  const kpisData = getKPIsComparison();
  const platformData = getPlatformComparison();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">مقارنة التقارير</h1>
                <p className="text-xs text-muted-foreground">قارن بين التقارير الشهرية</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للتقرير
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Import Section */}
        <Card className="p-6 mb-8 shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            رفع تقرير جديد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">الشهر</Label>
              <Input 
                value={newMonth} 
                onChange={(e) => setNewMonth(e.target.value)}
                placeholder="مثال: نوفمبر"
              />
            </div>
            <div>
              <Label className="mb-2 block">السنة</Label>
              <Input 
                value={newYear} 
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="2025"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <label className="w-full">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportReport}
                  className="hidden"
                />
                <Button asChild className="w-full gap-2 gradient-primary text-primary-foreground">
                  <span>
                    <FileJson className="w-4 h-4" />
                    اختر ملف JSON
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </Card>

        {/* Saved Reports */}
        <Card className="p-6 mb-8 shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            التقارير المحفوظة ({savedReports.length})
          </h2>
          
          {savedReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد تقارير محفوظة. قم برفع تقرير JSON للبدء.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedReports.map(report => (
                <div 
                  key={report.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReports.includes(report.id) 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleSelectReport(report.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-foreground">{report.month} {report.year}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(report.id);
                      }}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.savedAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Comparison Charts */}
        {selectedReports.length >= 2 && (
          <>
            {/* Total Followers Comparison */}
            <Card className="p-6 mb-8 shadow-soft">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                مقارنة إجمالي المتابعين
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={followersData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => v.toLocaleString('ar-EG')} />
                    <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG')} />
                    <Bar dataKey="total" fill="hsl(var(--primary))">
                      {followersData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Platform Comparison */}
            <Card className="p-6 mb-8 shadow-soft">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                مقارنة المنصات
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical">
                    <XAxis type="number" tickFormatter={(v) => v.toLocaleString('ar-EG')} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG')} />
                    <Legend />
                    {selectedReportsData.map((report, idx) => (
                      <Bar 
                        key={report.id}
                        dataKey={`${report.month} ${report.year}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* KPIs Comparison Table */}
            <Card className="p-6 mb-8 shadow-soft">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                جدول مقارنة المؤشرات
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="gradient-primary text-primary-foreground">
                      <th className="p-3 text-right">المؤشر</th>
                      {selectedReportsData.map(report => (
                        <th key={report.id} className="p-3 text-right">
                          {report.month} {report.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kpisData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-muted/30' : ''}>
                        <td className="p-3 border-b border-border font-medium">{row.name}</td>
                        {selectedReportsData.map(report => (
                          <td key={report.id} className="p-3 border-b border-border">
                            {(row[`${report.month} ${report.year}`] || 0).toLocaleString('ar-EG')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Trend Line Chart */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                خط اتجاه المتابعين
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={followersData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => v.toLocaleString('ar-EG')} />
                    <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG')} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}

        {selectedReports.length === 1 && (
          <Card className="p-8 text-center shadow-soft">
            <p className="text-muted-foreground">اختر تقريراً آخر للمقارنة</p>
          </Card>
        )}

        {selectedReports.length === 0 && savedReports.length > 0 && (
          <Card className="p-8 text-center shadow-soft">
            <p className="text-muted-foreground">اختر تقريرين أو أكثر من القائمة أعلاه للمقارنة</p>
          </Card>
        )}
      </main>
    </div>
  );
}
