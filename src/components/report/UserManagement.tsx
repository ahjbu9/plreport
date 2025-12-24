import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, UserPlus, Trash2, Shield, User } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: 'admin' | 'user';
}

export function UserManagement() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserProfile[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          display_name: profile.display_name,
          role: (userRole?.role as 'admin' | 'user') || 'user'
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('حدث خطأ في جلب المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setIsCreating(true);
    try {
      // Sign up the new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: newUserRole
          });

        if (roleError) throw roleError;
      }

      toast.success('تم إنشاء المستخدم بنجاح');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.message?.includes('User already registered')) {
        toast.error('هذا البريد الإلكتروني مسجل مسبقاً');
      } else {
        toast.error('حدث خطأ في إنشاء المستخدم');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // Check if role exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        
        if (error) throw error;
      }

      toast.success('تم تحديث الصلاحية بنجاح');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('حدث خطأ في تحديث الصلاحية');
    }
  };

  if (!isAdmin) {
    return (
      <Card className="p-6 shadow-soft">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>ليس لديك صلاحية للوصول لإدارة المستخدمين</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Users className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">إدارة المستخدمين</h3>
          <p className="text-sm text-muted-foreground">إضافة وتعديل صلاحيات المستخدمين</p>
        </div>
      </div>

      {/* Add new user form */}
      <div className="p-4 bg-muted/50 rounded-lg mb-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          إضافة مستخدم جديد
        </h4>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="email@example.com"
              dir="ltr"
            />
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
          <div>
            <Label>الصلاحية</Label>
            <Select value={newUserRole} onValueChange={(v: 'admin' | 'user') => setNewUserRole(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">مستخدم</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={createUser} disabled={isCreating} className="w-full gradient-primary text-primary-foreground">
              {isCreating ? 'جاري الإنشاء...' : 'إضافة'}
            </Button>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا يوجد مستخدمين
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.display_name || 'بدون اسم'}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select 
                  value={user.role} 
                  onValueChange={(v: 'admin' | 'user') => updateUserRole(user.id, v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
