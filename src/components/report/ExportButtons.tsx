import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function ExportButtons() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      const element = document.getElementById('report-preview');
      if (!element) {
        toast.error('لم يتم العثور على التقرير');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 210;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 210;
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
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px; 
              text-align: right;
            }
            th { 
              background-color: #00796b; 
              color: white;
            }
            .kpi-card {
              display: inline-block;
              padding: 15px;
              margin: 10px;
              background: #e0f2f1;
              border-radius: 8px;
              text-align: center;
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

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={exportToPDF}
        disabled={isExportingPDF}
        className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
      >
        {isExportingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        تصدير PDF
      </Button>
      <Button
        onClick={exportToWord}
        disabled={isExportingWord}
        variant="outline"
        className="gap-2"
      >
        {isExportingWord ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        تصدير Word
      </Button>
    </div>
  );
}
