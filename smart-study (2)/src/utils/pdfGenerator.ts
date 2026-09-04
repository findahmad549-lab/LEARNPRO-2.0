import { jsPDF } from 'jspdf';
import { StudyNote } from '../types';
import { formatMathText } from './mathFormatter';

/**
 * Generates and downloads a clean, professional, publication-grade PDF
 * of any study note for offline study.
 */
export function downloadNoteAsPDF(note: StudyNote, studentName: string = 'EduSpark Student'): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 18;
    const marginRight = 18;
    const usableWidth = pageWidth - marginLeft - marginRight; // 174mm
    const bottomMargin = 22;

    let currentY = 18;

    // Helper for adding a new page with running top banner
    const checkAddPage = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - bottomMargin) {
        doc.addPage();
        currentY = 20;

        // Running top header on subsequent pages
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`EduSpark Revision Notes • ${note.subject} - ${note.chapter}`, marginLeft, 12);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(marginLeft, 14, pageWidth - marginRight, 14);
      }
    };

    // 1. TOP BRAND ACCENT BAR
    doc.setFillColor(30, 58, 138); // Deep Navy Blue
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(14, 165, 233); // Cyan Accent Stripe
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // 2. HEADER BRAND LOGO & TITLE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(37, 99, 235); // Brand Blue
    doc.text('EDUSPARK AI  •  STUDY MASTER NOTES', marginLeft, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('OFFLINE REVISION COPY', pageWidth - marginRight, currentY, { align: 'right' });

    currentY += 8;

    // 3. NOTE TITLE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42); // Dark Slate
    const titleLines = doc.splitTextToSize(note.title, usableWidth);
    doc.text(titleLines, marginLeft, currentY);
    currentY += titleLines.length * 7 + 2;

    // 4. METADATA INFO CARD
    const metaCardHeight = 11;
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.roundedRect(marginLeft, currentY, usableWidth, metaCardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, usableWidth, metaCardHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 58, 138);

    const typeLabel = note.type ? note.type.toUpperCase().replace('_', ' ') : 'REVISION';
    const dateLabel = new Date(note.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const metaText = `Subject: ${note.subject}   |   Chapter: ${note.chapter}   |   Type: ${typeLabel}   |   Date: ${dateLabel}   |   Student: ${studentName}`;
    const truncatedMeta = doc.splitTextToSize(metaText, usableWidth - 6);
    doc.text(truncatedMeta[0] || metaText, marginLeft + 4, currentY + 7);

    currentY += metaCardHeight + 8;

    // 5. PARSE & RENDER MARKDOWN CONTENT WITH CLEAN MATH
    const cleanContent = formatMathText(note.content || '');
    const rawLines = cleanContent.split('\n');

    let inFormulaBlock = false;
    let formulaBlockLines: string[] = [];

    const flushFormulaBlock = () => {
      if (formulaBlockLines.length === 0) return;
      const blockText = formulaBlockLines.join('\n');
      const wrapped = doc.splitTextToSize(blockText, usableWidth - 12);
      const boxHeight = wrapped.length * 5 + 6;

      checkAddPage(boxHeight + 4);

      // Shaded callout background
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginLeft, currentY, usableWidth, boxHeight, 2, 2, 'F');

      // Left blue accent border
      doc.setFillColor(37, 99, 235);
      doc.rect(marginLeft, currentY, 2.5, boxHeight, 'F');

      // Formula text
      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(wrapped, marginLeft + 6, currentY + 5);

      currentY += boxHeight + 4;
      formulaBlockLines = [];
      inFormulaBlock = false;
    };

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i].trimEnd();

      // Check for markdown code / formula block ```
      if (line.trim().startsWith('```')) {
        if (inFormulaBlock) {
          flushFormulaBlock();
        } else {
          inFormulaBlock = true;
        }
        continue;
      }

      if (inFormulaBlock) {
        formulaBlockLines.push(line);
        continue;
      }

      // Check for blockquote > formula
      if (line.trim().startsWith('>')) {
        const quoteContent = line.replace(/^>\s*/, '').replace(/\*\*/g, '').trim();
        const wrapped = doc.splitTextToSize(quoteContent, usableWidth - 12);
        const boxHeight = wrapped.length * 5 + 5;

        checkAddPage(boxHeight + 3);

        doc.setFillColor(243, 244, 246);
        doc.roundedRect(marginLeft, currentY, usableWidth, boxHeight, 1.5, 1.5, 'F');
        doc.setFillColor(79, 70, 229); // Indigo accent
        doc.rect(marginLeft, currentY, 2, boxHeight, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(wrapped, marginLeft + 5, currentY + 4.5);

        currentY += boxHeight + 3;
        continue;
      }

      // Blank line -> small paragraph gap
      if (!line.trim()) {
        currentY += 3;
        continue;
      }

      // Heading 1: #
      if (line.startsWith('# ')) {
        const text = line.replace(/^#\s+/, '').replace(/\*\*/g, '').trim();
        checkAddPage(12);
        currentY += 4;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12.5);
        doc.setTextColor(30, 58, 138); // Navy
        doc.text(text, marginLeft, currentY);

        // Underline for H1
        doc.setDrawColor(191, 219, 254);
        doc.setLineWidth(0.4);
        doc.line(marginLeft, currentY + 1.5, marginLeft + Math.min(usableWidth, doc.getTextWidth(text) + 6), currentY + 1.5);

        currentY += 6;
        continue;
      }

      // Heading 2: ##
      if (line.startsWith('## ')) {
        const text = line.replace(/^##\s+/, '').replace(/\*\*/g, '').trim();
        checkAddPage(10);
        currentY += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(37, 99, 235); // Blue
        doc.text(text, marginLeft, currentY);
        currentY += 5.5;
        continue;
      }

      // Heading 3: ###
      if (line.startsWith('### ')) {
        const text = line.replace(/^###\s+/, '').replace(/\*\*/g, '').trim();
        checkAddPage(8);
        currentY += 2.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85); // Slate-700
        doc.text(text, marginLeft, currentY);
        currentY += 5;
        continue;
      }

      // Bullet items (- or *)
      if (line.match(/^[\*\-]\s+/)) {
        const text = line.replace(/^[\*\-]\s+/, '').replace(/\*\*/g, '').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        const wrapped = doc.splitTextToSize(text, usableWidth - 7);
        checkAddPage(wrapped.length * 4.5 + 1.5);

        // Bullet dot
        doc.setFillColor(37, 99, 235);
        doc.circle(marginLeft + 2, currentY - 1.2, 0.7, 'F');

        doc.text(wrapped, marginLeft + 5, currentY);
        currentY += wrapped.length * 4.5 + 1.5;
        continue;
      }

      // Numbered items (1. 2.)
      const numMatch = line.match(/^(\d+[\.\)])\s+(.*)/);
      if (numMatch) {
        const numPrefix = numMatch[1];
        const text = numMatch[2].replace(/\*\*/g, '').trim();

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(37, 99, 235);

        checkAddPage(6);
        doc.text(numPrefix, marginLeft + 1, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const wrapped = doc.splitTextToSize(text, usableWidth - 8);
        doc.text(wrapped, marginLeft + 7, currentY);
        currentY += wrapped.length * 4.5 + 1.5;
        continue;
      }

      // Regular paragraph text
      const cleanLine = line.replace(/\*\*/g, '').trim();
      if (cleanLine) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        const wrapped = doc.splitTextToSize(cleanLine, usableWidth);
        checkAddPage(wrapped.length * 4.5 + 2);
        doc.text(wrapped, marginLeft, currentY);
        currentY += wrapped.length * 4.5 + 2;
      }
    }

    if (inFormulaBlock) {
      flushFormulaBlock();
    }

    // 6. FOOTER ON ALL PAGES
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);

      // Footer divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, pageHeight - 14, pageWidth - marginRight, pageHeight - 14);

      // Footer left text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text('EduSpark AI Learning OS • For Personal Exam Preparation', marginLeft, pageHeight - 9);

      // Footer right page number
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginRight, pageHeight - 9, { align: 'right' });
    }

    // 7. SAVE FILE
    const safeTitle = note.title
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 45);
    const fileName = `${safeTitle || 'EduSpark_Notes'}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF note:', err);
    return false;
  }
}
