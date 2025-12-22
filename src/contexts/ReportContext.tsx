import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ReportData, ReportSettings, ReportSection, ReportTable, KPICard, PlatformCard, NoteSection, TableColumn, ContentCard } from '@/types/report';
import { initialReportData, initialSettings } from '@/data/initialReportData';

interface ReportContextType {
  reportData: ReportData;
  settings: ReportSettings;
  updateHeader: (title: string, subtitle: string) => void;
  updateFooter: (line1: string, line2: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateKPI: (sectionId: string, kpiId: string, updates: Partial<KPICard>) => void;
  addKPI: (sectionId: string) => void;
  removeKPI: (sectionId: string, kpiId: string) => void;
  updateTable: (sectionId: string, tableId: string, updates: Partial<ReportTable>) => void;
  updateTableCell: (sectionId: string, tableId: string, rowId: string, columnHeader: string, value: string) => void;
  addTableRow: (sectionId: string, tableId: string) => void;
  removeTableRow: (sectionId: string, tableId: string, rowId: string) => void;
  addTableColumn: (sectionId: string, tableId: string, header: string) => void;
  toggleColumnVisibility: (sectionId: string, tableId: string, columnId: string) => void;
  updatePlatformCard: (sectionId: string, cardId: string, updates: Partial<PlatformCard>) => void;
  removePlatformCard: (sectionId: string, cardId: string) => void;
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
  // Content section functions
  updateContentCard: (sectionId: string, cardId: string, updates: Partial<ContentCard>) => void;
  addContentCard: (sectionId: string) => void;
  removeContentCard: (sectionId: string, cardId: string) => void;
  saveToLocalStorage: () => void;
  loadReport: (data: ReportData) => void;
  loadSettings: (settings: ReportSettings) => void;
  resetToDefault: () => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => boolean;
  updateSectionsOrder: (sections: ReportSection[]) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const STORAGE_KEY = 'monthly-report-data';
const SETTINGS_KEY = 'monthly-report-settings';

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportData, setReportData] = useState<ReportData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialReportData;
  });
  const [settings, setSettings] = useState<ReportSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist
      return {
        ...initialSettings,
        ...parsed,
        email: { ...initialSettings.email, ...parsed.email },
        theme: { ...initialSettings.theme, ...parsed.theme }
      };
    }
    return initialSettings;
  });

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const loadReport = (data: ReportData) => {
    setReportData(data);
  };

  const loadSettings = (newSettings: ReportSettings) => {
    setSettings(newSettings);
  };

  const resetToDefault = () => {
    setReportData(initialReportData);
    setSettings(initialSettings);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  };

  const exportToJSON = () => {
    return JSON.stringify({ reportData, settings }, null, 2);
  };

  const importFromJSON = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.reportData) {
        setReportData(parsed.reportData);
      }
      if (parsed.settings) {
        setSettings({ ...initialSettings, ...parsed.settings });
      }
      return true;
    } catch {
      return false;
    }
  };

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

  const addKPI = (sectionId: string) => {
    const newKPI: KPICard = {
      id: generateId(),
      icon: 'trending-up',
      value: '0',
      label: 'مؤشر جديد',
      visible: true
    };
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'kpi') {
          const currentKPIs = s.data as KPICard[];
          if (currentKPIs.length < 8) {
            return { ...s, data: [...currentKPIs, newKPI] };
          }
        }
        return s;
      })
    }));
  };

  const removeKPI = (sectionId: string, kpiId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'kpi') {
          const currentKPIs = s.data as KPICard[];
          if (currentKPIs.length > 3) {
            return { ...s, data: currentKPIs.filter(k => k.id !== kpiId) };
          }
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

  const removePlatformCard = (sectionId: string, cardId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'platforms') {
          return {
            ...s,
            data: (s.data as PlatformCard[]).filter(p => p.id !== cardId)
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

  // Content Card Functions
  const updateContentCard = (sectionId: string, cardId: string, updates: Partial<ContentCard>) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'content') {
          return {
            ...s,
            data: (s.data as ContentCard[]).map(c => 
              c.id === cardId ? { ...c, ...updates } : c
            )
          };
        }
        return s;
      })
    }));
  };

  const addContentCard = (sectionId: string) => {
    const newCard: ContentCard = {
      id: generateId(),
      thumbnail: '',
      contentType: 'design',
      description: 'محتوى جديد',
      visible: true
    };
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'content') {
          const currentCards = s.data as ContentCard[];
          if (currentCards.length < 8) {
            return { ...s, data: [...currentCards, newCard] };
          }
        }
        return s;
      })
    }));
  };

  const removeContentCard = (sectionId: string, cardId: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId && s.type === 'content') {
          return {
            ...s,
            data: (s.data as ContentCard[]).filter(c => c.id !== cardId)
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
      title: type === 'content' ? 'أفضل محتوى' : 'قسم جديد',
      icon: type === 'kpi' ? 'bar-chart' : type === 'table' ? 'table' : type === 'platforms' ? 'layout-grid' : type === 'content' ? 'sparkles' : 'clipboard-list',
      visible: true,
      data: []
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

  const updateSectionsOrder = (sections: ReportSection[]) => {
    setReportData(prev => ({
      ...prev,
      sections
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
      addKPI,
      removeKPI,
      updateTable,
      updateTableCell,
      addTableRow,
      removeTableRow,
      addTableColumn,
      toggleColumnVisibility,
      updatePlatformCard,
      removePlatformCard,
      updateNoteSection,
      addNoteItem,
      removeNoteItem,
      updateNoteItem,
      updateContentCard,
      addContentCard,
      removeContentCard,
      updateSettings,
      addSection,
      removeSection,
      addTable,
      addPlatformCard,
      addNoteGroup,
      saveToLocalStorage,
      loadReport,
      loadSettings,
      resetToDefault,
      exportToJSON,
      importFromJSON,
      updateSectionsOrder
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
