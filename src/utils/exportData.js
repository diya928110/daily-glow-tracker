import jsPDF from 'jspdf';

export const exportToPDF = (data, filename = 'daily-glow-data') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Daily Glow Tracker Data', 20, 20);
  
  let yPosition = 40;
  
  Object.entries(data).forEach(([section, sectionData]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text(section.toUpperCase(), 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    if (typeof sectionData === 'object') {
      Object.entries(sectionData).forEach(([key, value]) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        const text = `${key}: ${JSON.stringify(value)}`;
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      });
    }
    
    yPosition += 10;
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportToJSON = (data, filename = 'daily-glow-data') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${filename}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};