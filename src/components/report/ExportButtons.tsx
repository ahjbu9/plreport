import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Save, FolderOpen, Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { useReport } from '@/contexts/ReportContext';

export function ExportButtons() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const { reportData, settings, loadReport, saveToLocalStorage, exportToJSON, importFromJSON, loadSettings } = useReport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      const element = document.getElementById('report-preview');
      if (!element) {
        toast.error('لم يتم العثور على التقرير');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pdfWidth - (margin * 2);
      const usableHeight = pdfHeight - (margin * 2);

      // Get all sections that should not be split
      const sections = element.querySelectorAll('header, section, footer, .grid, table, .mb-6, .mb-8, .mb-10');
      const elementsToCapture: HTMLElement[] = [];
      
      // If no sections found, capture entire element
      if (sections.length === 0) {
        elementsToCapture.push(element as HTMLElement);
      } else {
        // Get direct children and important elements
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
          elementsToCapture.push(children[i] as HTMLElement);
        }
      }

      let currentY = margin;
      let isFirstElement = true;

      for (const el of elementsToCapture) {
        // Capture each section separately
        const canvas = await html2canvas(el as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Scale to fit width while maintaining aspect ratio
        const scaledWidth = usableWidth;
        const scaledHeight = (imgHeight * usableWidth) / imgWidth;

        // Check if this element fits on current page
        if (!isFirstElement && currentY + scaledHeight > pdfHeight - margin) {
          // Add new page
          pdf.addPage();
          currentY = margin;
        }

        // If element is taller than page, we need to handle it specially
        if (scaledHeight > usableHeight) {
          // For very tall elements, capture and split carefully
          let remainingHeight = scaledHeight;
          let sourceY = 0;
          
          while (remainingHeight > 0) {
            const heightToDraw = Math.min(remainingHeight, usableHeight);
            const sourceHeight = (heightToDraw / scaledHeight) * imgHeight;
            
            // Create a temporary canvas for this portion
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = imgWidth;
            tempCanvas.height = sourceHeight;
            const ctx = tempCanvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(
                canvas, 
                0, sourceY, imgWidth, sourceHeight,
                0, 0, imgWidth, sourceHeight
              );
              
              const portionData = tempCanvas.toDataURL('image/png');
              
              if (currentY !== margin) {
                pdf.addPage();
                currentY = margin;
              }
              
              pdf.addImage(portionData, 'PNG', margin, currentY, scaledWidth, heightToDraw);
            }
            
            sourceY += sourceHeight;
            remainingHeight -= heightToDraw;
            
            if (remainingHeight > 0) {
              pdf.addPage();
              currentY = margin;
            }
          }
          currentY = margin + (scaledHeight % usableHeight) || usableHeight;
        } else {
          // Element fits, add it
          pdf.addImage(imgData, 'PNG', margin, currentY, scaledWidth, scaledHeight);
          currentY += scaledHeight + 5; // Add small gap between elements
        }
        
        isFirstElement = false;
      }

      pdf.save('التقرير_الشهري.pdf');
      toast.success('تم تصدير التقرير بنجاح كملف PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('حدث خطأ أثناء تصدير الملف');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportToWord = async () => {
    setIsExportingWord(true);
    try {
      const element = document.getElementById('report-preview');
      if (!element) {
        toast.error('لم يتم العثور على التقرير');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Tajawal', 'Arial', sans-serif; 
              direction: rtl; 
              text-align: right;
              padding: 20px;
              line-height: 1.8;
            }
            h1, h2, h3, h4 { color: #00796b; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              page-break-inside: avoid;
            }
            tr { page-break-inside: avoid; }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px; 
              text-align: right;
            }
            th { 
              background-color: #00796b; 
              color: white;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
      saveAs(blob, 'التقرير_الشهري.doc');
      toast.success('تم تصدير التقرير بنجاح كملف Word');
    } catch (error) {
      console.error('Error exporting Word:', error);
      toast.error('حدث خطأ أثناء تصدير الملف');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleSave = () => {
    saveToLocalStorage();
    toast.success('تم حفظ التقرير محلياً');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('monthly-report-data');
    if (saved) {
      loadReport(JSON.parse(saved));
      toast.success('تم تحميل التقرير المحفوظ');
    } else {
      toast.error('لا يوجد تقرير محفوظ');
    }
  };

  const handleExportJSON = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'تقرير_بيانات.json');
    toast.success('تم تصدير البيانات بنجاح');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importFromJSON(content)) {
        toast.success('تم استيراد البيانات بنجاح');
      } else {
        toast.error('فشل استيراد البيانات - تنسيق غير صالح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button onClick={handleSave} variant="outline" className="gap-2">
        <Save className="w-4 h-4" />
        حفظ محلي
      </Button>
      <Button onClick={handleLoad} variant="outline" className="gap-2">
        <FolderOpen className="w-4 h-4" />
        تحميل محفوظ
      </Button>
      <Button onClick={handleExportJSON} variant="outline" className="gap-2">
        <FileJson className="w-4 h-4" />
        تصدير JSON
      </Button>
      <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
        <Upload className="w-4 h-4" />
        استيراد JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJSON}
        className="hidden"
      />
      <Button
        onClick={exportToPDF}
        disabled={isExportingPDF}
        className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
      >
        {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        تصدير PDF
      </Button>
      <Button onClick={exportToWord} disabled={isExportingWord} variant="outline" className="gap-2">
        {isExportingWord ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        تصدير Word
      </Button>
    </div>
  );
}
