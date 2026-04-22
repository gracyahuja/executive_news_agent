import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Capture the newsletter DOM node and export it as a multi-page PDF.
 * @param {HTMLElement} element  The DOM node to capture
 * @param {string} filename      PDF file name (without extension)
 */
export async function exportToPDF(element, filename = "Costco-Executive-Brief") {
  if (!element) throw new Error("No element provided for PDF export");

  // Temporarily expand any overflow-hidden containers for full capture
  const originalOverflow = element.style.overflow;
  element.style.overflow = "visible";

  const canvas = await html2canvas(element, {
    scale: 2, // retina quality
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 1200,
  });

  element.style.overflow = originalOverflow;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Scale image to fit PDF width
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${filename}.pdf`);
}
