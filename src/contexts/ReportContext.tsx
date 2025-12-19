import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ReportData, ReportSettings, ReportSection, ReportTable, KPICard, PlatformCard, NoteSection, TableRow, TableColumn } from '@/types/report';
import { initialReportData, initialSettings } from '@/data/initialReportData';

interface ReportContextType {
  reportData: ReportData;
  settings: ReportSettings;
  updateHeader: (title: string, subtitle: string) => void;
  updateFooter: (line1: string, line2: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateKPI: (sectionId: string, kpiId: string, updates: Partial<KPICard>) => void;
  updateTable: (sectionId: string, tableId: string, updates: Partial<ReportTable>) => void;
  updateTableCell: (sectionId: string, tableId: string, rowId: string, columnHeader: string, value: string) => void;
  addTableRow: (sectionId: string, tableId: string) => void;
  removeTableRow: (sectionId: string, tableId: string, rowId: string) => void;
  addTableColumn: (sectionId: string, tableId: string, header: string) => void;
  toggleColumnVisibility: (sectionId: string, tableId: string, columnId: string) => void;
  updatePlatformCard: (sectionId: string, cardId: string, updates: Partial<PlatformCard>) => void;
  updateNoteSection: (sectionId: string, noteId: string, updates: Partial<NoteSection>) => void;
  addNoteItem: (sectionId: string, noteId: string, item: string) => void;
  removeNoteItem: (sectionId: string, noteId: string, index: number) => void;
  updateNoteItem: (sectionId: string, noteId: string, index: number, value: string) => void;
  updateSettings: (updates: Partial<ReportSettings>) => void;
  addSection: (type: ReportSection['type']) => void;
  removeSection: (sectionId: string) => void;
  addTable: (sectionId: string, title: string) => void;
  addPlatformCard: (sectionId: string) => void;
  addNoteGroup: (sectionId: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportData, setReportData] = useState<ReportData>(initialReportData);
  const [settings, setSettings] = useState<ReportSettings>(initialSettings);

  const updateHeader = (title: string, subtitle: string) => {
    setReportData(prev => ({
      ...prev,
      header: { title, subtitle }
    }));
  };

  const updateFooter = (line1: string, line2: string) => {
    setReportData(prev => ({
      ...prev,
      footer: { line1, line2 }
    }));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, title } : s
      )
    }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      )
    }));
  };

  const updateKPI = (sectionId: string, kpiId: string, updates: Partial<KPICard>) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'kpi') {
          return {
            ...s,
            data: (s.data as KPICard[]).map(k => 
              k.id === kpiId ? { ...k, ...updates } : k
            )
          };
        }
        return s;
      })
    }));
  };

  const updateTable = (sectionId: string, tableId: string, updates: Partial<ReportTable>) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => 
              t.id === tableId ? { ...t, ...updates } : t
            )
          };
        }
        return s;
      })
    }));
  };

  const updateTableCell = (sectionId: string, tableId: string, rowId: string, columnHeader: string, value: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => {
              if (t.id === tableId) {
                return {
                  ...t,
                  rows: t.rows.map(r => 
                    r.id === rowId ? { ...r, cells: { ...r.cells, [columnHeader]: value } } : r
                  )
                };
              }
              return t;
            })
          };
        }
        return s;
      })
    }));
  };

  const addTableRow = (sectionId: string, tableId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => {
              if (t.id === tableId) {
                const newCells: Record<string, string> = {};
                t.columns.forEach(col => {
                  newCells[col.header] = '';
                });
                return {
                  ...t,
                  rows: [...t.rows, { id: generateId(), cells: newCells }]
                };
              }
              return t;
            })
          };
        }
        return s;
      })
    }));
  };

  const removeTableRow = (sectionId: string, tableId: string, rowId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => {
              if (t.id === tableId) {
                return {
                  ...t,
                  rows: t.rows.filter(r => r.id !== rowId)
                };
              }
              return t;
            })
          };
        }
        return s;
      })
    }));
  };

  const addTableColumn = (sectionId: string, tableId: string, header: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => {
              if (t.id === tableId) {
                const newColumn: TableColumn = { id: generateId(), header, visible: true };
                return {
                  ...t,
                  columns: [...t.columns, newColumn],
                  rows: t.rows.map(r => ({
                    ...r,
                    cells: { ...r.cells, [header]: '' }
                  }))
                };
              }
              return t;
            })
          };
        }
        return s;
      })
    }));
  };

  const toggleColumnVisibility = (sectionId: string, tableId: string, columnId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return {
            ...s,
            data: (s.data as ReportTable[]).map(t => {
              if (t.id === tableId) {
                return {
                  ...t,
                  columns: t.columns.map(c => 
                    c.id === columnId ? { ...c, visible: !c.visible } : c
                  )
                };
              }
              return t;
            })
          };
        }
        return s;
      })
    }));
  };

  const updatePlatformCard = (sectionId: string, cardId: string, updates: Partial<PlatformCard>) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'platforms') {
          return {
            ...s,
            data: (s.data as PlatformCard[]).map(p => 
              p.id === cardId ? { ...p, ...updates } : p
            )
          };
        }
        return s;
      })
    }));
  };

  const updateNoteSection = (sectionId: string, noteId: string, updates: Partial<NoteSection>) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'notes') {
          return {
            ...s,
            data: (s.data as NoteSection[]).map(n => 
              n.id === noteId ? { ...n, ...updates } : n
            )
          };
        }
        return s;
      })
    }));
  };

  const addNoteItem = (sectionId: string, noteId: string, item: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'notes') {
          return {
            ...s,
            data: (s.data as NoteSection[]).map(n => 
              n.id === noteId ? { ...n, items: [...n.items, item] } : n
            )
          };
        }
        return s;
      })
    }));
  };

  const removeNoteItem = (sectionId: string, noteId: string, index: number) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'notes') {
          return {
            ...s,
            data: (s.data as NoteSection[]).map(n => {
              if (n.id === noteId) {
                return { ...n, items: n.items.filter((_, i) => i !== index) };
              }
              return n;
            })
          };
        }
        return s;
      })
    }));
  };

  const updateNoteItem = (sectionId: string, noteId: string, index: number, value: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'notes') {
          return {
            ...s,
            data: (s.data as NoteSection[]).map(n => {
              if (n.id === noteId) {
                const newItems = [...n.items];
                newItems[index] = value;
                return { ...n, items: newItems };
              }
              return n;
            })
          };
        }
        return s;
      })
    }));
  };

  const updateSettings = (updates: Partial<ReportSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const addSection = (type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: generateId(),
      type,
      title: 'قسم جديد',
      icon: type === 'kpi' ? 'bar-chart' : type === 'table' ? 'table' : type === 'platforms' ? 'layout-grid' : 'clipboard-list',
      visible: true,
      data: type === 'kpi' ? [] : type === 'table' ? [] : type === 'platforms' ? [] : []
    };
    setReportData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const addTable = (sectionId: string, title: string) => {
    const newTable: ReportTable = {
      id: generateId(),
      title,
      visible: true,
      columns: [
        { id: generateId(), header: 'العمود 1', visible: true },
        { id: generateId(), header: 'العمود 2', visible: true }
      ],
      rows: [
        { id: generateId(), cells: { 'العمود 1': '', 'العمود 2': '' } }
      ]
    };
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'table') {
          return { ...s, data: [...(s.data as ReportTable[]), newTable] };
        }
        return s;
      })
    }));
  };

  const addPlatformCard = (sectionId: string) => {
    const newCard: PlatformCard = {
      id: generateId(),
      title: 'منصة جديدة',
      visible: true,
      items: [{ label: 'البند', value: 'القيمة' }]
    };
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'platforms') {
          return { ...s, data: [...(s.data as PlatformCard[]), newCard] };
        }
        return s;
      })
    }));
  };

  const addNoteGroup = (sectionId: string) => {
    const newNote: NoteSection = {
      id: generateId(),
      title: 'مجموعة ملاحظات جديدة',
      icon: 'file-text',
      visible: true,
      items: ['ملاحظة جديدة']
    };
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'notes') {
          return { ...s, data: [...(s.data as NoteSection[]), newNote] };
        }
        return s;
      })
    }));
  };

  return (
    <ReportContext.Provider value={{
      reportData,
      settings,
      updateHeader,
      updateFooter,
      updateSectionTitle,
      toggleSectionVisibility,
      updateKPI,
      updateTable,
      updateTableCell,
      addTableRow,
      removeTableRow,
      addTableColumn,
      toggleColumnVisibility,
      updatePlatformCard,
      updateNoteSection,
      addNoteItem,
      removeNoteItem,
      updateNoteItem,
      updateSettings,
      addSection,
      removeSection,
      addTable,
      addPlatformCard,
      addNoteGroup
    }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}
