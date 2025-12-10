import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { LogoCategory } from "@/data/logoCategories";

interface ReportData {
  clientName: string;
  completedAt: string | null;
  selectedLogoOptions: Record<string, string>;
  logoCategories: LogoCategory[];
  selectedPalette: {
    name: string;
    colors: string[];
  } | null;
  selectedTypography: {
    name: string;
    description: string;
  } | null;
  aiSuggestions: Array<{
    title: string;
    description: string;
    recommendations: string[];
  }>;
}

/**
 * Gera PDF do relatório
 */
export async function generateReportPDF(
  reportElement: HTMLElement,
  data: ReportData
): Promise<void> {
  try {
    // Mostrar loading
    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = "Gerando PDF...";
    loadingMessage.style.position = "fixed";
    loadingMessage.style.top = "50%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.background = "rgba(0,0,0,0.8)";
    loadingMessage.style.color = "white";
    loadingMessage.style.padding = "20px 40px";
    loadingMessage.style.borderRadius = "8px";
    loadingMessage.style.zIndex = "10000";
    document.body.appendChild(loadingMessage);

    // Criar canvas do elemento
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Remover loading
    document.body.removeChild(loadingMessage);

    // Criar PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;
    const marginX = (pdfWidth - imgScaledWidth) / 2;
    const marginY = (pdfHeight - imgScaledHeight) / 2;

    // Adicionar primeira página
    pdf.addImage(imgData, "PNG", marginX, marginY, imgScaledWidth, imgScaledHeight);

    // Se o conteúdo for maior que uma página, adicionar páginas adicionais
    let heightLeft = imgScaledHeight;
    let position = marginY;

    while (heightLeft >= 0) {
      position = heightLeft - imgScaledHeight + marginY;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", marginX, position, imgScaledWidth, imgScaledHeight);
      heightLeft -= pdfHeight;
    }

    // Salvar PDF
    const fileName = `Relatorio_${data.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error("Erro ao gerar PDF. Tente novamente.");
  }
}

/**
 * Gera PDF usando método alternativo (mais controlado)
 */
export async function generateReportPDFAdvanced(data: ReportData): Promise<void> {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Função para adicionar nova página se necessário
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Título
  pdf.setFontSize(20);
  pdf.setTextColor(75, 141, 248); // Cor primária
  pdf.text("Relatório de Estilo Visual", margin, yPosition);
  yPosition += 10;

  // Informações do cliente
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Cliente: ${data.clientName}`, margin, yPosition);
  yPosition += 6;
  if (data.completedAt) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Respondido em: ${new Date(data.completedAt).toLocaleDateString("pt-BR")}`,
      margin,
      yPosition
    );
    yPosition += 8;
  }

  // Tipos de Logo Selecionados
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setTextColor(75, 141, 248);
  pdf.text("Tipos de Logo Selecionados", margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  data.logoCategories.forEach((category) => {
    const selectedOptionId = data.selectedLogoOptions[category.id];
    if (selectedOptionId) {
      checkPageBreak(10);
      pdf.setFontSize(11);
      pdf.text(`• ${category.title}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(category.description, margin + 10, yPosition, {
        maxWidth: pageWidth - margin * 2 - 10,
      });
      yPosition += 8;
      pdf.setTextColor(0, 0, 0);
    }
  });

  yPosition += 5;

  // Paleta de Cores
  if (data.selectedPalette) {
    checkPageBreak(25);
    pdf.setFontSize(14);
    pdf.setTextColor(75, 141, 248);
    pdf.text("Paleta de Cores", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(data.selectedPalette.name, margin, yPosition);
    yPosition += 6;

    // Desenhar cores
    const colorBoxSize = 8;
    const colorSpacing = 2;
    let xPosition = margin;
    data.selectedPalette.colors.forEach((color) => {
      if (xPosition + colorBoxSize > pageWidth - margin) {
        yPosition += colorBoxSize + colorSpacing;
        xPosition = margin;
      }
      // Converter hex para RGB
      const rgb = hexToRgb(color);
      if (rgb) {
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(xPosition, yPosition, colorBoxSize, colorBoxSize, "F");
        xPosition += colorBoxSize + colorSpacing;
      }
    });
    yPosition += colorBoxSize + 10;
  }

  // Tipografia
  if (data.selectedTypography) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setTextColor(75, 141, 248);
    pdf.text("Tipografia", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(data.selectedTypography.name, margin, yPosition);
    yPosition += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(data.selectedTypography.description, margin, yPosition, {
      maxWidth: pageWidth - margin * 2,
    });
    yPosition += 10;
  }

  // Sugestões de IA
  if (data.aiSuggestions.length > 0) {
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setTextColor(75, 141, 248);
    pdf.text("Sugestões da IA", margin, yPosition);
    yPosition += 8;

    data.aiSuggestions.forEach((suggestion) => {
      checkPageBreak(30);
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(suggestion.title, margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(suggestion.description, margin, yPosition, {
        maxWidth: pageWidth - margin * 2,
      });
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Recomendações:", margin + 5, yPosition);
      yPosition += 6;

      suggestion.recommendations.forEach((rec) => {
        checkPageBreak(8);
        pdf.text(`  • ${rec}`, margin + 10, yPosition, {
          maxWidth: pageWidth - margin * 2 - 10,
        });
        yPosition += 6;
      });

      yPosition += 5;
    });
  }

  // Rodapé
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    pdf.text(
      "Guia de Estilos - Relatório Gerado Automaticamente",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Salvar PDF
  const fileName = `Relatorio_${data.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(fileName);
}

/**
 * Converte cor hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

