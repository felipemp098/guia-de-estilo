import { useParams, Link } from "react-router-dom";
import {
  Card,
  Tag,
  Collapse,
  Button,
  Divider,
  Typography,
  Empty,
  Spin,
  Breadcrumb,
  message,
} from "antd";
import {
  DownloadOutlined,
  BulbOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import Header from "@/components/layout/Header";
import { colorPalettes, typographyStyles } from "@/data/styles";
import { useLogoCategories } from "@/hooks/useLogoCategories";
import { useClientWithResponse } from "@/hooks/useClients";
import { generateReportPDFAdvanced } from "@/utils/pdfGenerator";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Report = () => {
  const { clientId } = useParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { categories: logoCategories } = useLogoCategories();
  const { data: clientData, isLoading, error } = useClientWithResponse(clientId);

  if (isLoading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !clientData || clientData.status !== "completed") {
    return (
      <div className="page-container min-h-screen">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="content-container">
            <Empty
              description="Relatório não encontrado ou ainda não foi preenchido"
              className="py-20"
            >
              <Link to="/dashboard">
                <Button type="primary">Voltar ao Dashboard</Button>
              </Link>
            </Empty>
          </div>
        </main>
      </div>
    );
  }

  const client = clientData;
  const styleResponse = client.style_response;

  // Parse selectedLogoOptions do JSONB
  const selectedLogoOptions: Record<string, string> =
    styleResponse?.selected_logo_options
      ? (typeof styleResponse.selected_logo_options === "string"
          ? JSON.parse(styleResponse.selected_logo_options)
          : (styleResponse.selected_logo_options as Record<string, string>))
      : {};

  const selectedPaletteData = colorPalettes.find(
    (p) => p.id === styleResponse?.selected_palette
  );
  const selectedTypographyData = typographyStyles.find(
    (t) => t.id === styleResponse?.selected_typography
  );

  const handleExportPDF = async () => {
    if (!client || !styleResponse) return;

    setIsGeneratingPDF(true);
    try {
      await generateReportPDFAdvanced({
        clientName: client.name,
        completedAt: client.completed_at,
        selectedLogoOptions,
        logoCategories,
        selectedPalette: selectedPaletteData
          ? {
              name: selectedPaletteData.name,
              colors: selectedPaletteData.colors,
            }
          : null,
        selectedTypography: selectedTypographyData
          ? {
              name: selectedTypographyData.name,
              description: selectedTypographyData.description,
            }
          : null,
        aiSuggestions: [
          {
            title: "Sugestão Principal",
            description:
              "Baseado nas escolhas do cliente, recomendamos uma identidade visual que combine sofisticação com clareza.",
            recommendations: [
              "Utilize elementos minimalistas com toques de luxo",
              "Aposte em contrastes elegantes entre tipografia e espaços negativos",
              "Incorpore detalhes dourados ou metálicos sutis",
            ],
          },
          {
            title: "Sugestão Alternativa",
            description:
              "Uma abordagem mais ousada que mantém a essência das preferências selecionadas.",
            recommendations: [
              "Explore variações mais contrastantes da paleta escolhida",
              "Considere tipografias display para títulos impactantes",
              "Adicione elementos gráficos inspirados nos estilos selecionados",
            ],
          },
        ],
      });
      message.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      message.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // AI-generated suggestions based on selections
  const aiSuggestions = [
    {
      title: "Sugestão Principal",
      description:
        "Baseado nas escolhas do cliente, recomendamos uma identidade visual que combine sofisticação com clareza.",
      recommendations: [
        "Utilize elementos minimalistas com toques de luxo",
        "Aposte em contrastes elegantes entre tipografia e espaços negativos",
        "Incorpore detalhes dourados ou metálicos sutis",
      ],
      palette: selectedPaletteData?.colors || [],
    },
    {
      title: "Sugestão Alternativa",
      description:
        "Uma abordagem mais ousada que mantém a essência das preferências selecionadas.",
      recommendations: [
        "Explore variações mais contrastantes da paleta escolhida",
        "Considere tipografias display para títulos impactantes",
        "Adicione elementos gráficos inspirados nos estilos selecionados",
      ],
      palette: selectedPaletteData?.colors.slice().reverse() || [],
    },
  ];

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-2 sm:px-4">
        <div ref={reportRef} className="content-container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
            <div className="flex-1 min-w-0">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item>
                  <Link to="/dashboard">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className="truncate">Relatório de {client.name}</Breadcrumb.Item>
              </Breadcrumb>
              <Title level={2} className="!mb-0 text-xl sm:text-2xl">
                Relatório de {client.name}
              </Title>
              <Text type="secondary" className="text-xs sm:text-sm">
                Respondido em{" "}
                {client.completed_at
                  ? new Date(client.completed_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Data não disponível"}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              loading={isGeneratingPDF}
              onClick={handleExportPDF}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>

          {/* Selected Logo Options */}
          <Card className="glass-card mb-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <StarOutlined className="text-xl text-primary" />
              <Title level={4} className="!mb-0">
                Tipos de Logo Selecionados
              </Title>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logoCategories.map((category) => {
                const selectedOptionId = selectedLogoOptions[category.id];
                const selectedOption = category.options.find(
                  (opt) => opt.id === selectedOptionId
                );
                if (!selectedOption) return null;

                return (
                  <div
                    key={category.id}
                    className="border border-border rounded-xl p-3 sm:p-4"
                  >
                    <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={selectedOption.image}
                          alt={selectedOption.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base sm:text-lg text-foreground mb-1">
                          {category.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                          {category.description}
                        </p>
                        <Tag color="blue" className="text-xs sm:text-sm">
                          Opção selecionada
                        </Tag>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Color Palette */}
          <Card
            className="glass-card mb-6 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BgColorsOutlined className="text-xl text-primary" />
              <Title level={4} className="!mb-0">
                Paleta de Cores
              </Title>
            </div>
            {selectedPaletteData && (
              <>
                <div className="flex h-20 rounded-xl overflow-hidden mb-3">
                  {selectedPaletteData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 flex items-end justify-center pb-2"
                      style={{ backgroundColor: color }}
                    >
                      <span
                        className="text-xs font-mono px-2 py-1 rounded"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          color: "#333",
                        }}
                      >
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                <Text className="text-foreground font-medium">
                  {selectedPaletteData.name}
                </Text>
              </>
            )}
          </Card>

          {/* Typography */}
          <Card
            className="glass-card mb-6 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FontSizeOutlined className="text-xl text-primary" />
              <Title level={4} className="!mb-0">
                Tipografia
              </Title>
            </div>
            {selectedTypographyData && (
              <div className="flex items-center gap-6">
                <div
                  className="text-4xl"
                  style={{ fontFamily: selectedTypographyData.fontFamily }}
                >
                  Aa
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {selectedTypographyData.name}
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedTypographyData.description}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Divider />

          {/* AI Suggestions */}
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 mb-6">
              <BulbOutlined className="text-2xl text-primary" />
              <Title level={3} className="!mb-0">
                Sugestões da IA
              </Title>
            </div>

            <Collapse
              defaultActiveKey={["0"]}
              className="bg-transparent border-none"
            >
              {aiSuggestions.map((suggestion, index) => (
                <Panel
                  key={index}
                  header={
                    <span className="font-semibold text-base">
                      {suggestion.title}
                    </span>
                  }
                  className="!bg-card !rounded-xl !mb-4 !border-border"
                >
                  <Paragraph className="text-muted-foreground">
                    {suggestion.description}
                  </Paragraph>
                  <div className="mb-4">
                    <Text strong className="block mb-2">
                      Recomendações:
                    </Text>
                    <ul className="list-disc list-inside space-y-1">
                      {suggestion.recommendations.map((rec, i) => (
                        <li key={i} className="text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Text strong className="block mb-2">
                      Paleta Sugerida:
                    </Text>
                    <div className="flex h-10 rounded-lg overflow-hidden w-64">
                      {suggestion.palette.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
