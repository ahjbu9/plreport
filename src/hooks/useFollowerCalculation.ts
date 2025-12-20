import { useMemo } from 'react';
import { ReportData, ReportTable } from '@/types/report';

const parseNumber = (value: string): number => {
  if (!value) return 0;
  
  // Remove commas and spaces
  let cleaned = value.replace(/[,،\s]/g, '');
  
  // Handle Arabic numbers
  const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replace(new RegExp(arabicNumerals[i], 'g'), String(i));
  }
  
  // Extract numbers
  const match = cleaned.match(/[\d.]+/);
  if (!match) return 0;
  
  return parseFloat(match[0]) || 0;
};

export function useFollowerCalculation(reportData: ReportData) {
  return useMemo(() => {
    // Find the first table section that contains platform followers data
    const tableSection = reportData.sections.find(
      s => s.type === 'table' && s.visible
    );
    
    if (!tableSection) return null;
    
    const tables = tableSection.data as ReportTable[];
    
    // Find a table with "متابعين" in the title or columns
    const followersTable = tables.find(table => {
      const hasFollowersColumn = table.columns.some(
        col => col.header.includes('متابعين') || col.header.includes('المتابعين')
      );
      const hasPlatformColumn = table.columns.some(
        col => col.header.includes('المنصة') || col.header.includes('منصة')
      );
      return hasFollowersColumn && hasPlatformColumn;
    });
    
    if (!followersTable) return null;
    
    // Find the followers column
    const followersColumn = followersTable.columns.find(
      col => col.header.includes('متابعين') || col.header.includes('المتابعين')
    );
    
    if (!followersColumn) return null;
    
    // Find the platform column
    const platformColumn = followersTable.columns.find(
      col => col.header.includes('المنصة') || col.header.includes('منصة')
    );
    
    if (!platformColumn) return null;
    
    // Calculate totals per platform
    const platformData: { platform: string; followers: number }[] = [];
    let totalFollowers = 0;
    
    for (const row of followersTable.rows) {
      const platform = row.cells[platformColumn.header] || '';
      const followersStr = row.cells[followersColumn.header] || '0';
      const followers = parseNumber(followersStr);
      
      if (platform && followers > 0) {
        platformData.push({ platform, followers });
        totalFollowers += followers;
      }
    }
    
    return {
      totalFollowers,
      platformData,
      formattedTotal: totalFollowers.toLocaleString('ar-EG')
    };
  }, [reportData]);
}
