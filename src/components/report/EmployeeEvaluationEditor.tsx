import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { EmployeeEvaluation } from '@/types/report';

interface EmployeeEvaluationEditorProps {
  sectionId: string;
  evaluations: EmployeeEvaluation[];
  onUpdate: (sectionId: string, evaluations: EmployeeEvaluation[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function EmployeeEvaluationEditor({ sectionId, evaluations, onUpdate }: EmployeeEvaluationEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addEmployee = () => {
    const newEmployee: EmployeeEvaluation = {
      id: generateId(),
      name: '',
      role: '',
      tasks: '',
      completionRate: 0,
      notes: ''
    };
    onUpdate(sectionId, [...evaluations, newEmployee]);
  };

  const removeEmployee = (id: string) => {
    onUpdate(sectionId, evaluations.filter(e => e.id !== id));
  };

  const updateEmployee = (id: string, updates: Partial<EmployeeEvaluation>) => {
    onUpdate(sectionId, evaluations.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {evaluations.map((employee) => (
        <Card key={employee.id} className="border border-border/50">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <Input
                    value={employee.name}
                    onChange={(e) => updateEmployee(employee.id, { name: e.target.value })}
                    placeholder="اسم الموظف"
                    className="font-semibold text-foreground border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                  />
                </div>
                <div className={`font-bold text-lg ${getCompletionColor(employee.completionRate)}`}>
                  {employee.completionRate}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === employee.id ? null : employee.id)}
                >
                  {expandedId === employee.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmployee(employee.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedId === employee.id && (
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">التوصيف الوظيفي</label>
                  <Input
                    value={employee.role}
                    onChange={(e) => updateEmployee(employee.id, { role: e.target.value })}
                    placeholder="مثال: مصمم جرافيك"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">نسبة الإنجاز</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[employee.completionRate]}
                      onValueChange={([value]) => updateEmployee(employee.id, { completionRate: value })}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className={`font-bold w-12 text-center ${getCompletionColor(employee.completionRate)}`}>
                      {employee.completionRate}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">المهام المطلوبة</label>
                <Textarea
                  value={employee.tasks}
                  onChange={(e) => updateEmployee(employee.id, { tasks: e.target.value })}
                  placeholder="اكتب المهام المطلوبة من الموظف..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">ملاحظات</label>
                <Textarea
                  value={employee.notes}
                  onChange={(e) => updateEmployee(employee.id, { notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية..."
                  rows={2}
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}
      
      <Button onClick={addEmployee} variant="outline" className="w-full gap-2">
        <Plus className="w-4 h-4" />
        إضافة موظف
      </Button>
    </div>
  );
}
