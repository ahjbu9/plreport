import { useState } from 'react';
import { ReportTable } from '@/types/report';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Eye, EyeOff, Columns } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TableEditorProps {
  table: ReportTable;
  sectionId: string;
  onUpdateCell: (rowId: string, columnHeader: string, value: string) => void;
  onUpdateTitle: (title: string) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onAddColumn: (header: string) => void;
  onToggleColumnVisibility: (columnId: string) => void;
  isEditing?: boolean;
}

export function TableEditor({
  table,
  sectionId,
  onUpdateCell,
  onUpdateTitle,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onToggleColumnVisibility,
  isEditing = true
}: TableEditorProps) {
  const [newColumnHeader, setNewColumnHeader] = useState('');
  const [showColumnManager, setShowColumnManager] = useState(false);

  const visibleColumns = table.columns.filter(col => col.visible);

  const handleAddColumn = () => {
    if (newColumnHeader.trim()) {
      onAddColumn(newColumnHeader.trim());
      setNewColumnHeader('');
    }
  };

  return (
    <div className={`mb-8 ${!table.visible ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <EditableText
            value={table.title}
            onChange={onUpdateTitle}
            className="text-lg font-semibold text-primary"
          />
        ) : (
          <h4 className="text-lg font-semibold text-primary">{table.title}</h4>
        )}
        
        {isEditing && (
          <div className="flex items-center gap-2">
            <Dialog open={showColumnManager} onOpenChange={setShowColumnManager}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Columns className="w-4 h-4" />
                  إدارة الأعمدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إدارة أعمدة الجدول</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">إظهار/إخفاء الأعمدة:</p>
                    {table.columns.map(col => (
                      <div key={col.id} className="flex items-center gap-3">
                        <Checkbox
                          checked={col.visible}
                          onCheckedChange={() => onToggleColumnVisibility(col.id)}
                        />
                        <span className="text-sm">{col.header}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">إضافة عمود جديد:</p>
                    <div className="flex gap-2">
                      <Input
                        value={newColumnHeader}
                        onChange={(e) => setNewColumnHeader(e.target.value)}
                        placeholder="اسم العمود"
                        dir="rtl"
                      />
                      <Button onClick={handleAddColumn} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={onAddRow} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              صف جديد
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="gradient-primary">
              {visibleColumns.map(col => (
                <TableHead key={col.id} className="text-primary-foreground font-bold text-right">
                  {col.header}
                </TableHead>
              ))}
              {isEditing && <TableHead className="text-primary-foreground w-16">إجراءات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, rowIndex) => (
              <TableRow 
                key={row.id}
                className={`transition-colors hover:bg-muted/50 ${rowIndex % 2 === 1 ? 'bg-muted/30' : ''}`}
              >
                {visibleColumns.map(col => (
                  <TableCell key={col.id} className="text-right">
                    {isEditing ? (
                      <EditableText
                        value={row.cells[col.header] || ''}
                        onChange={(value) => onUpdateCell(row.id, col.header, value)}
                        placeholder="..."
                      />
                    ) : (
                      row.cells[col.header] || '-'
                    )}
                  </TableCell>
                ))}
                {isEditing && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveRow(row.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
