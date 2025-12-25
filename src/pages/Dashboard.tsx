import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Calendar, 
  Sparkles, 
  Archive, 
  Settings, 
  LogOut,
  Plus,
  Users,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

const months = [
  { value: '01', label: 'يناير' },
  { value: '02', label: 'فبراير' },
  { value: '03', label: 'مارس' },
  { value: '04', label: 'أبريل' },
  { value: '05', label: 'مايو' },
  { value: '06', label: 'يونيو' },
  { value: '07', label: 'يوليو' },
  { value: '08', label: 'أغسطس' },
  { value: '09', label: 'سبتمبر' },
  { value: '10', label: 'أكتوبر' },
  { value: '11', label: 'نوفمبر' },
  { value: '12', label: 'ديسمبر' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [reportsCount, setReportsCount] = useState(0);
  const [monthlyDialogOpen, setMonthlyDialogOpen] = useState(false);
  const [specialDialogOpen, setSpecialDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [specialReportName, setSpecialReportName] = useState('');
  const [campaignName, setCampaignName] = useState('');

  useEffect(() => {
    fetchReportsCount();
  }, [user]);

  const fetchReportsCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setReportsCount(count || 0);
  };

  const handleCreateMonthlyReport = () => {
    if (!selectedMonth || !selectedYear) {
      toast.error('يرجى اختيار الشهر والسنة');
      return;
    }
    const monthName = months.find(m => m.value === selectedMonth)?.label;
    navigate(`/editor?type=monthly&month=${selectedMonth}&year=${selectedYear}&title=التقرير الشهري - ${monthName} ${selectedYear}`);
    setMonthlyDialogOpen(false);
  };

  const handleCreateSpecialReport = () => {
    if (!specialReportName) {
      toast.error('يرجى إدخال اسم التقرير');
      return;
    }
    navigate(`/editor?type=special&name=${encodeURIComponent(specialReportName)}&campaign=${encodeURIComponent(campaignName)}`);
    setSpecialDialogOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">نظام إدارة التقارير</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate('/settings')} className="gap-2">
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">مرحباً بك!</h2>
          <p className="text-muted-foreground">اختر نوع التقرير الذي تريد إنشاءه أو استعرض الأرشيف</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportsCount}</p>
                  <p className="text-sm text-muted-foreground">تقرير محفوظ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Creation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Report */}
          <Dialog open={monthlyDialogOpen} onOpenChange={setMonthlyDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-elevated transition-all duration-300 border-border/50 group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">التقرير الشهري</CardTitle>
                  <CardDescription>إنشاء تقرير شهري منظم مع اختيار الشهر والسنة</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2 gradient-primary text-primary-foreground">
                    <Plus className="w-4 h-4" />
                    إنشاء تقرير شهري
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء تقرير شهري جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الشهر</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشهر" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>السنة</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر السنة" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateMonthlyReport} className="w-full gradient-primary text-primary-foreground">
                  إنشاء التقرير
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Special Report */}
          <Dialog open={specialDialogOpen} onOpenChange={setSpecialDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-elevated transition-all duration-300 border-border/50 group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">تقرير خاص</CardTitle>
                  <CardDescription>تقرير مخصص لحملة أو فعالية معينة</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    إنشاء تقرير خاص
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء تقرير خاص</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>اسم التقرير</Label>
                  <Input 
                    value={specialReportName}
                    onChange={(e) => setSpecialReportName(e.target.value)}
                    placeholder="مثال: تقرير حملة #تراثنا_هويتنا"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم الحملة/الفعالية (اختياري)</Label>
                  <Input 
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="مثال: حملة شتاء دافئ"
                  />
                </div>
                <Button onClick={handleCreateSpecialReport} className="w-full gradient-gold text-accent-foreground">
                  إنشاء التقرير
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-elevated transition-all duration-300 border-border/50"
            onClick={() => navigate('/archive')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Archive className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">أرشيف التقارير</h3>
                  <p className="text-sm text-muted-foreground">استعراض وإدارة التقارير المحفوظة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card 
              className="cursor-pointer hover:shadow-elevated transition-all duration-300 border-border/50"
              onClick={() => navigate('/settings')}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">إدارة المستخدمين</h3>
                    <p className="text-sm text-muted-foreground">إضافة وإدارة المستخدمين</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
