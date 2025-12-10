import { useParams, Link } from "react-router-dom";
import {
  Card,
  Tag,
  Collapse,
  Button,
  Divider,
  Typography,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  BulbOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/Header";
import { mockClients } from "@/data/mockClients";
import { styleOptions, colorPalettes, typographyStyles } from "@/data/styles";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Report = () => {
  const { clientId } = useParams();
  const client = mockClients.find((c) => c.id === clientId);

  if (!client || client.status !== "completed") {
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

  const selectedStylesData = styleOptions.filter((s) =>
    client.selectedStyles?.includes(s.id)
  );
  const selectedPaletteData = colorPalettes.find(
    (p) => p.id === client.selectedPalette
  );
  const selectedTypographyData = typographyStyles.find(
    (t) => t.id === client.selectedTypography
  );

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

      <main className="pt-24 pb-12 px-4">
        <div className="content-container max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeftOutlined />
                <span>Voltar ao Dashboard</span>
              </Link>
              <Title level={2} className="!mb-0">
                Relatório de {client.name}
              </Title>
              <Text type="secondary">
                Respondido em{" "}
                {new Date(client.completedAt!).toLocaleDateString("pt-BR")}
              </Text>
            </div>
            <Button type="primary" icon={<DownloadOutlined />} size="large">
              Exportar PDF
            </Button>
          </div>

          {/* Selected Styles */}
          <Card className="glass-card mb-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <StarOutlined className="text-xl text-primary" />
              <Title level={4} className="!mb-0">
                Estilos Selecionados
              </Title>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedStylesData.map((style) => (
                <Tag key={style.id} color="blue" className="text-sm px-3 py-1">
                  {style.name}
                </Tag>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedStylesData.map((style) => (
                <div
                  key={style.id}
                  className="rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-foreground mb-1">
                      {style.name}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
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
