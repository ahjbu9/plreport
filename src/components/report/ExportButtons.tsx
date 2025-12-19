import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Save, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useReport } from '@/contexts/ReportContext';

export function ExportButtons() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const { reportData, settings, loadReport, saveToLocalStorage } = useReport();

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add Arabic font support
      pdf.setFont('helvetica');
      
      let yPosition = 20;
      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Helper function to check if we need a new page
      const checkNewPage = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Header
      if (settings.showHeader) {
        pdf.setFontSize(24);
        pdf.setTextColor(0, 121, 107);
        const headerText = reportData.header.title;
        const headerWidth = pdf.getTextWidth(headerText);
        pdf.text(headerText, pageWidth - margin - headerWidth, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        const subtitleText = reportData.header.subtitle;
        const subtitleWidth = pdf.getTextWidth(subtitleText);
        pdf.text(subtitleText, pageWidth - margin - subtitleWidth, yPosition);
        yPosition += 15;

        // Header line
        pdf.setDrawColor(0, 121, 107);
        pdf.setLineWidth(1);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Sections
      for (const section of reportData.sections.filter(s => s.visible)) {
        checkNewPage(20);
        
        // Section title
        pdf.setFontSize(16);
        pdf.setTextColor(0, 121, 107);
        const sectionTitle = section.title;
        const sectionTitleWidth = pdf.getTextWidth(sectionTitle);
        pdf.text(sectionTitle, pageWidth - margin - sectionTitleWidth, yPosition);
        yPosition += 8;
        
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // KPI Cards
        if (section.type === 'kpi' && settings.showKPIs) {
          const kpis = (section.data as any[]).filter(k => k.visible);
          const kpiWidth = (contentWidth - 15) / 4;
          let kpiX = pageWidth - margin - kpiWidth;
          
          checkNewPage(35);
          
          for (let i = 0; i < kpis.length; i++) {
            const kpi = kpis[i];
            
            // KPI background
            pdf.setFillColor(224, 242, 241);
            pdf.roundedRect(kpiX, yPosition, kpiWidth, 30, 3, 3, 'F');
            
            // KPI value
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            const valueWidth = pdf.getTextWidth(kpi.value);
            pdf.text(kpi.value, kpiX + (kpiWidth + valueWidth) / 2, yPosition + 12);
            
            // KPI label
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            const labelWidth = pdf.getTextWidth(kpi.label);
            pdf.text(kpi.label, kpiX + (kpiWidth + labelWidth) / 2, yPosition + 22);
            
            kpiX -= kpiWidth + 5;
            
            if ((i + 1) % 4 === 0 && i < kpis.length - 1) {
              yPosition += 35;
              checkNewPage(35);
              kpiX = pageWidth - margin - kpiWidth;
            }
          }
          yPosition += 40;
        }

        // Tables
        if (section.type === 'table') {
          const tables = (section.data as any[]).filter(t => t.visible);
          
          for (const table of tables) {
            checkNewPage(30);
            
            // Table title
            pdf.setFontSize(12);
            pdf.setTextColor(0, 121, 107);
            const tableTitleWidth = pdf.getTextWidth(table.title);
            pdf.text(table.title, pageWidth - margin - tableTitleWidth, yPosition);
            yPosition += 8;

            const visibleCols = table.columns.filter((c: any) => c.visible);
            const headers = visibleCols.map((c: any) => c.header).reverse();
            const rows = table.rows.map((row: any) => 
              visibleCols.map((col: any) => row.cells[col.header] || '-').reverse()
            );

            autoTable(pdf, {
              head: [headers],
              body: rows,
              startY: yPosition,
              margin: { left: margin, right: margin },
              styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 4,
                halign: 'right',
                valign: 'middle',
                overflow: 'linebreak',
                cellWidth: 'wrap'
              },
              headStyles: {
                fillColor: [0, 121, 107],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'right'
              },
              alternateRowStyles: {
                fillColor: [245, 245, 245]
              },
              tableWidth: 'auto',
              // Prevent row splitting across pages
              rowPageBreak: 'avoid',
              // Keep headers on each page
              showHead: 'everyPage'
            });

            yPosition = (pdf as any).lastAutoTable.finalY + 10;
          }
        }

        // Platform Cards
        if (section.type === 'platforms' && settings.showPlatformCards) {
          const cards = (section.data as any[]).filter(p => p.visible);
          const cardWidth = (contentWidth - 10) / 3;
          let cardX = pageWidth - margin - cardWidth;
          
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const cardHeight = 15 + (card.items.length * 8);
            
            checkNewPage(cardHeight + 5);
            
            // Card background
            pdf.setFillColor(250, 250, 250);
            pdf.setDrawColor(200, 200, 200);
            pdf.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'FD');
            
            // Card title
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            const cardTitleWidth = pdf.getTextWidth(card.title);
            pdf.text(card.title, cardX + cardWidth - 5, yPosition + 8);
            
            let itemY = yPosition + 16;
            for (const item of card.items) {
              pdf.setFontSize(8);
              pdf.setTextColor(100, 100, 100);
              pdf.text(item.label, cardX + cardWidth - 5, itemY);
              
              pdf.setTextColor(0, 121, 107);
              pdf.text(item.value, cardX + 5, itemY);
              itemY += 8;
            }
            
            cardX -= cardWidth + 5;
            
            if ((i + 1) % 3 === 0 && i < cards.length - 1) {
              yPosition += cardHeight + 8;
              checkNewPage(cardHeight + 5);
              cardX = pageWidth - margin - cardWidth;
            }
          }
          yPosition += 50;
        }

        // Notes
        if (section.type === 'notes' && settings.showNotes) {
          const notes = (section.data as any[]).filter(n => n.visible);
          
          for (const note of notes) {
            checkNewPage(15 + (note.items.length * 8));
            
            // Note title
            pdf.setFontSize(12);
            pdf.setTextColor(0, 121, 107);
            const noteTitleWidth = pdf.getTextWidth(note.title);
            pdf.text(note.title, pageWidth - margin - noteTitleWidth, yPosition);
            yPosition += 8;
            
            for (const item of note.items) {
              checkNewPage(8);
              pdf.setFontSize(10);
              pdf.setTextColor(50, 50, 50);
              const itemWidth = pdf.getTextWidth(item);
              pdf.text('• ' + item, pageWidth - margin - 10 - itemWidth, yPosition);
              yPosition += 7;
            }
            yPosition += 5;
          }
        }
      }

      // Footer
      if (settings.showFooter) {
        const footerY = pageHeight - 15;
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        
        const line1Width = pdf.getTextWidth(reportData.footer.line1);
        pdf.text(reportData.footer.line1, (pageWidth + line1Width) / 2, footerY);
        
        const line2Width = pdf.getTextWidth(reportData.footer.line2);
        pdf.text(reportData.footer.line2, (pageWidth + line2Width) / 2, footerY + 5);
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
            tr {
              page-break-inside: avoid;
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
              page-break-inside: avoid;
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

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        onClick={handleSave}
        variant="outline"
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        حفظ محلي
      </Button>
      <Button
        onClick={handleLoad}
        variant="outline"
        className="gap-2"
      >
        <FolderOpen className="w-4 h-4" />
        تحميل محفوظ
      </Button>
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
