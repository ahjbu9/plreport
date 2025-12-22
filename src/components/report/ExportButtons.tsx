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

      // Create a temporary wrapper for consistent sizing
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: 794px;
        background: white;
        padding: 40px;
        box-sizing: border-box;
      `;

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        background: white;
        box-shadow: none;
        border-radius: 0;
      `;

      // Fix content cards grid - force 4 columns with equal sizing
      const contentGrids = clone.querySelectorAll('.grid');
      contentGrids.forEach(grid => {
        const el = grid as HTMLElement;
        // Check if it's the content cards grid (4 columns)
        if (el.classList.contains('grid-cols-2') && el.classList.contains('md:grid-cols-4')) {
          el.style.display = 'grid';
          el.style.gridTemplateColumns = 'repeat(4, 1fr)';
          el.style.gap = '12px';
          el.style.width = '100%';
          
          // Fix each card to be equal size
          const cards = el.children;
          Array.from(cards).forEach(card => {
            const cardEl = card as HTMLElement;
            cardEl.style.width = '100%';
            cardEl.style.minHeight = '200px';
            cardEl.style.display = 'flex';
            cardEl.style.flexDirection = 'column';
            cardEl.style.overflow = 'visible';
            
            // Fix image container
            const imgContainer = cardEl.querySelector('.aspect-video, .aspect-square, [class*="aspect"]') as HTMLElement;
            if (imgContainer) {
              imgContainer.style.height = '120px';
              imgContainer.style.minHeight = '120px';
              imgContainer.style.maxHeight = '120px';
              imgContainer.style.overflow = 'hidden';
            }
            
            // Fix description text - ensure it doesn't get cut off
            const descEl = cardEl.querySelector('p, .text-sm') as HTMLElement;
            if (descEl) {
              descEl.style.overflow = 'visible';
              descEl.style.textOverflow = 'clip';
              descEl.style.whiteSpace = 'normal';
              descEl.style.wordBreak = 'break-word';
              descEl.style.lineHeight = '1.4';
              descEl.style.fontSize = '11px';
            }
          });
        } else if (el.classList.contains('grid-cols-4') || el.classList.contains('md:grid-cols-4')) {
          el.style.display = 'grid';
          el.style.gridTemplateColumns = 'repeat(4, 1fr)';
          el.style.gap = '12px';
        } else if (el.classList.contains('grid-cols-3') || el.classList.contains('md:grid-cols-3')) {
          el.style.display = 'grid';
          el.style.gridTemplateColumns = 'repeat(3, 1fr)';
          el.style.gap = '12px';
        } else if (el.classList.contains('grid-cols-2') || el.classList.contains('md:grid-cols-2')) {
          el.style.display = 'grid';
          el.style.gridTemplateColumns = 'repeat(2, 1fr)';
          el.style.gap = '12px';
        }
      });

      // Fix images for PDF
      const images = clone.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '120px';
        img.style.objectFit = 'contain';
      });

      // Fix notes section to prevent text cutting at page breaks
      const noteSections = clone.querySelectorAll('ul, li');
      noteSections.forEach(note => {
        const el = note as HTMLElement;
        el.style.pageBreakInside = 'avoid';
        el.style.breakInside = 'avoid';
        el.style.marginBottom = '8px';
      });

      // Style cards to prevent page breaks
      const cards = clone.querySelectorAll('[class*="rounded"]');
      cards.forEach(card => {
        const el = card as HTMLElement;
        el.style.pageBreakInside = 'avoid';
        el.style.breakInside = 'avoid';
      });

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        width: 794,
        height: wrapper.scrollHeight
      });

      document.body.removeChild(wrapper);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit width
      const scale = contentWidth / (imgWidth / 2); // divided by 2 because of scale: 2
      const scaledHeight = (imgHeight / 2) * scale;
      
      // Handle multi-page with smart breaks
      const pageHeightPx = contentHeight / scale * 2; // pixels per page
      let currentY = 0;
      let pageNum = 0;

      while (currentY < imgHeight) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        // Calculate how much to capture for this page
        let captureHeight = Math.min(pageHeightPx, imgHeight - currentY);
        
        // Create page canvas
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = captureHeight;
        const ctx = pageCanvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, currentY, imgWidth, captureHeight,
            0, 0, imgWidth, captureHeight
          );
          
          const pageData = pageCanvas.toDataURL('image/png', 1.0);
          const destHeight = (captureHeight / 2) * scale;
          pdf.addImage(pageData, 'PNG', margin, margin, contentWidth, destHeight);
        }

        currentY += captureHeight;
        pageNum++;
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
      // Generate structured Word-compatible HTML
      const generateWordContent = () => {
        let html = '';
        
        // Header
        if (settings.showHeader) {
          html += `
            <div style="text-align: center; border-bottom: 4px solid #00796b; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #00796b; font-size: 28px; margin: 0;">${reportData.header.title}</h1>
              <p style="color: #666; margin-top: 10px;">${reportData.header.subtitle}</p>
            </div>
          `;
        }

        // Sections
        reportData.sections.filter(s => s.visible).forEach(section => {
          html += `
            <div style="margin-bottom: 40px; page-break-inside: avoid;">
              <h2 style="color: #00796b; font-size: 20px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 20px;">
                ${section.title}
              </h2>
          `;

          // KPIs
          if (section.type === 'kpi' && settings.showKPIs) {
            html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><tr>';
            const kpis = section.data as any[];
            kpis.filter(k => k.visible).forEach((kpi, i) => {
              html += `
                <td style="width: 25%; text-align: center; padding: 15px; background: #f5f5f5; border: 1px solid #ddd;">
                  <div style="font-size: 24px; font-weight: bold; color: #00796b;">${kpi.value}</div>
                  <div style="font-size: 12px; color: #666;">${kpi.label}</div>
                </td>
              `;
              if ((i + 1) % 4 === 0 && i < kpis.length - 1) html += '</tr><tr>';
            });
            html += '</tr></table>';
          }

          // Content Cards
          if (section.type === 'content' && settings.showContent) {
            const cards = section.data as any[];
            html += '<table style="width: 100%; border-collapse: collapse;"><tr>';
            cards.filter(c => c.visible).forEach((card, i) => {
              const typeLabels: Record<string, string> = {
                'album': 'ألبوم',
                'infographic': 'إنفوجرافيك',
                'design': 'تصميم',
                'video': 'فيديو',
                'ai': 'ذكاء اصطناعي',
                'voiceover': 'فويس أوفر'
              };
              html += `
                <td style="width: 25%; vertical-align: top; padding: 10px; border: 1px solid #ddd;">
                  <div style="background: #00796b; color: white; padding: 5px 10px; font-size: 12px; display: inline-block; margin-bottom: 10px;">
                    ${typeLabels[card.contentType] || card.contentType}
                  </div>
                  <div style="font-size: 14px; color: #333;">${card.description}</div>
                </td>
              `;
              if ((i + 1) % 4 === 0 && i < cards.length - 1) html += '</tr><tr>';
            });
            html += '</tr></table>';
          }

          // Tables
          if (section.type === 'table') {
            const tables = section.data as any[];
            tables.filter(t => t.visible).forEach(table => {
              const visibleCols = table.columns.filter((c: any) => c.visible);
              html += `
                <h3 style="color: #00796b; font-size: 16px; margin: 20px 0 10px;">${table.title}</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background: #00796b; color: white;">
                      ${visibleCols.map((col: any) => `<th style="padding: 12px; text-align: right; border: 1px solid #ddd;">${col.header}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${table.rows.map((row: any, idx: number) => `
                      <tr style="background: ${idx % 2 === 1 ? '#f5f5f5' : 'white'};">
                        ${visibleCols.map((col: any) => `<td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${row.cells[col.header] || '-'}</td>`).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;
            });
          }

          // Platform Cards
          if (section.type === 'platforms' && settings.showPlatformCards) {
            const cards = section.data as any[];
            html += '<table style="width: 100%; border-collapse: collapse;"><tr>';
            cards.filter(c => c.visible).forEach((card, i) => {
              html += `
                <td style="width: 33%; vertical-align: top; padding: 10px; border: 1px solid #ddd;">
                  <h4 style="color: #00796b; margin: 0 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">${card.title}</h4>
                  ${card.items.map((item: any) => `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #eee;">
                      <span style="color: #666;">${item.label}</span>
                      <span style="font-weight: bold; color: #00796b;">${item.value}</span>
                    </div>
                  `).join('')}
                </td>
              `;
              if ((i + 1) % 3 === 0 && i < cards.length - 1) html += '</tr><tr>';
            });
            html += '</tr></table>';
          }

          // Notes
          if (section.type === 'notes' && settings.showNotes) {
            const notes = section.data as any[];
            notes.filter(n => n.visible).forEach(note => {
              html += `
                <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-right: 4px solid #d4af37;">
                  <h4 style="color: #00796b; margin: 0 0 10px;">${note.title}</h4>
                  <ul style="margin: 0; padding-right: 20px;">
                    ${note.items.map((item: string) => `<li style="margin-bottom: 8px; color: #333;">${item}</li>`).join('')}
                  </ul>
                </div>
              `;
            });
          }

          html += '</div>';
        });

        // Footer
        if (settings.showFooter) {
          html += `
            <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px; color: #666; font-size: 12px;">
              <p style="margin: 5px 0;">${reportData.footer.line1}</p>
              <p style="margin: 5px 0;">${reportData.footer.line2}</p>
            </div>
          `;
        }

        return html;
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body { 
              font-family: 'Tajawal', 'Arial', sans-serif; 
              direction: rtl; 
              text-align: right;
              line-height: 1.8;
              color: #333;
              max-width: 21cm;
              margin: 0 auto;
              padding: 20px;
            }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
            h2, h3, h4 { page-break-after: avoid; }
          </style>
        </head>
        <body>
          ${generateWordContent()}
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
