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

      // Create a temporary clone for PDF generation
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = '794px'; // A4 width at 96dpi
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.backgroundColor = '#ffffff';
      document.body.appendChild(clone);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usableWidth = pdfWidth - (margin * 2);
      const usableHeight = pdfHeight - (margin * 2);

      // Capture entire element as one canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        width: 794
      });

      // Remove clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Scale to fill page width properly
      const scaledWidth = usableWidth;
      const scaledHeight = (imgHeight * usableWidth) / imgWidth;

      // If content fits on one page
      if (scaledHeight <= usableHeight) {
        pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
      } else {
        // Split into multiple pages
        const pageHeight = usableHeight;
        const totalPages = Math.ceil(scaledHeight / pageHeight);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }
          
          // Calculate source region for this page
          const sourceY = (page * pageHeight / scaledHeight) * imgHeight;
          const sourceHeight = Math.min(
            (pageHeight / scaledHeight) * imgHeight,
            imgHeight - sourceY
          );
          
          // Create temporary canvas for this page portion
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = sourceHeight;
          const ctx = pageCanvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, sourceY, imgWidth, sourceHeight,
              0, 0, imgWidth, sourceHeight
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            const drawHeight = (sourceHeight / imgHeight) * scaledHeight;
            
            pdf.addImage(pageImgData, 'PNG', margin, margin, scaledWidth, drawHeight);
          }
        }
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
