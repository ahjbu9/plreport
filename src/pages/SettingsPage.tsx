import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/report/UserManagement';
import { useAuth } from '@/hooks/useAuth';
import { Home, Users, Settings, LogOut } from 'lucide-react';

export default function SettingsPageRoute() {
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!isAdmin) {
    navigate('/');
    return null;
  }

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
                <Settings className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">الإعدادات</h1>
                <p className="text-xs text-muted-foreground">إدارة النظام والمستخدمين</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" dir="rtl">
          <TabsList className="grid w-full max-w-sm grid-cols-1 mb-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              إدارة المستخدمين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
                <CardDescription>إضافة وتعديل المستخدمين وصلاحياتهم</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
