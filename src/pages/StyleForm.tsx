import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Steps, Button, Progress, Result, message, Spin } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import LogoCategoryCard from "@/components/LogoCategoryCard";
import ColorPaletteCard from "@/components/ColorPaletteCard";
import TypographyCard from "@/components/TypographyCard";
import { useLogoCategories } from "@/hooks/useLogoCategories";
import { useSaveStyleResponsePublic } from "@/hooks/useStyleResponses";
import { useClientPublic } from "@/hooks/useClients";
import { colorPalettes, typographyStyles } from "@/data/styles";

const StyleForm = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { categories: logoCategories, isLoading: categoriesLoading } = useLogoCategories();
  const { data: client, isLoading: clientLoading, error: clientError } = useClientPublic(clientId);
  const saveResponseMutation = useSaveStyleResponsePublic();
  const [currentStep, setCurrentStep] = useState(0);
  // Mapeia categoryId -> optionId selecionada
  const [selectedLogoOptions, setSelectedLogoOptions] = useState<Record<string, string>>({});
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [selectedTypography, setSelectedTypography] = useState<string | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { title: "Tipos de Logo", description: "Selecione uma opção em cada categoria" },
    { title: "Cores", description: "Selecione uma paleta" },
    { title: "Tipografia", description: "Escolha um estilo" },
    { title: "Confirmação", description: "Revise suas escolhas" },
  ];

  const handleLogoOptionSelect = (categoryId: string, optionId: string) => {
    setSelectedLogoOptions((prev) => ({
      ...prev,
      [categoryId]: optionId,
    }));
  };

  const allCategoriesSelected = logoCategories.every(
    (category) => selectedLogoOptions[category.id]
  );

  // Mostrar loading enquanto busca categorias ou cliente
  if ((categoriesLoading && logoCategories.length === 0) || clientLoading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Verificar se cliente existe (apenas após o loading terminar e não houver erro de rede)
  if (!clientLoading && !client && clientId && !clientError) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Result
            status="404"
            title="Cliente não encontrado"
            subTitle="O link do formulário é inválido ou o cliente não existe. Verifique o link e tente novamente."
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                Voltar ao Início
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  // Tratar erros de rede/autenticação
  if (clientError && !clientLoading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Result
            status="500"
            title="Erro ao carregar formulário"
            subTitle="Ocorreu um erro ao buscar as informações do cliente. Tente recarregar a página."
            extra={[
              <Button type="primary" key="reload" onClick={() => window.location.reload()}>
                Recarregar Página
              </Button>,
              <Button key="home" onClick={() => navigate("/")}>
                Voltar ao Início
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  // Verificar se já foi completado
  if (!clientLoading && client?.status === "completed") {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Result
            status="success"
            title="Formulário já respondido"
            subTitle="Este formulário já foi preenchido anteriormente. Entre em contato com o designer se precisar fazer alterações."
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                Voltar ao Início
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (currentStep === 0 && !allCategoriesSelected) {
      message.warning("Selecione uma opção em cada categoria de logo");
      return;
    }
    if (currentStep === 1 && !selectedPalette) {
      message.warning("Selecione uma paleta de cores");
      return;
    }
    if (currentStep === 2 && !selectedTypography) {
      message.warning("Selecione um estilo de tipografia");
      return;
    }
    if (currentStep === 3) {
      // Salvar resposta no banco
      if (!clientId) {
        message.error("ID do cliente não encontrado");
        return;
      }

      try {
        await saveResponseMutation.mutateAsync({
          clientId,
          responseData: {
            selectedLogoOptions,
            selectedPalette,
            selectedTypography,
          },
        });
        setIsCompleted(true);
      } catch (error) {
        console.error("Erro ao salvar resposta:", error);
        // Erro já é mostrado pelo hook
      }
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isCompleted) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center animate-scale-in">
          <Result
            status="success"
            title="Obrigado pelas suas escolhas!"
            subTitle="Suas preferências foram enviadas ao designer. Em breve você receberá um relatório personalizado."
            extra={[
              <Button
                type="primary"
                key="home"
                onClick={() => navigate("/")}
                size="large"
              >
                Voltar ao Início
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Escolha seus tipos de logo preferidos
              </h2>
              <p className="text-muted-foreground">
                Selecione uma opção em cada categoria abaixo (
                {Object.keys(selectedLogoOptions).length}/{logoCategories.length} categorias)
              </p>
            </div>
            <div className="space-y-6 max-w-5xl mx-auto">
              {logoCategories.map((category) => (
                <LogoCategoryCard
                  key={category.id}
                  category={category}
                  selectedOptionId={selectedLogoOptions[category.id] || null}
                  onSelectOption={(optionId) =>
                    handleLogoOptionSelect(category.id, optionId)
                  }
                />
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Qual paleta de cores você prefere?
              </h2>
              <p className="text-muted-foreground">
                Escolha a paleta que melhor representa a sua marca
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {colorPalettes.map((palette) => (
                <ColorPaletteCard
                  key={palette.id}
                  {...palette}
                  selected={selectedPalette === palette.id}
                  onClick={() => setSelectedPalette(palette.id)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Qual estilo tipográfico você prefere?
              </h2>
              <p className="text-muted-foreground">
                A tipografia define a personalidade da sua marca
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {typographyStyles.map((typo) => (
                <TypographyCard
                  key={typo.id}
                  {...typo}
                  selected={selectedTypography === typo.id}
                  onClick={() => setSelectedTypography(typo.id)}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Revise suas escolhas
              </h2>
              <p className="text-muted-foreground">
                Confirme se está tudo correto antes de enviar
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Selected Logo Options */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  Tipos de Logo Selecionados
                </h3>
                <div className="space-y-4">
                  {logoCategories.map((category) => {
                    const selectedOptionId = selectedLogoOptions[category.id];
                    const selectedOption = category.options.find(
                      (opt) => opt.id === selectedOptionId
                    );
                    if (!selectedOption) return null;

                    return (
                      <div
                        key={category.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <h4 className="font-medium text-foreground mb-2">
                          {category.title}
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                            <img
                              src={selectedOption.image}
                              alt={selectedOption.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Palette */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  Paleta de Cores
                </h3>
                {selectedPalette && (
                  <div>
                    <div className="flex h-16 rounded-lg overflow-hidden mb-2">
                      {colorPalettes
                        .find((p) => p.id === selectedPalette)
                        ?.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>
                    <p className="text-center text-foreground font-medium">
                      {colorPalettes.find((p) => p.id === selectedPalette)?.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Typography */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  Tipografia
                </h3>
                {selectedTypography && (
                  <div className="text-center">
                    <div
                      className="text-3xl py-4 text-foreground"
                      style={{
                        fontFamily: typographyStyles.find(
                          (t) => t.id === selectedTypography
                        )?.fontFamily,
                      }}
                    >
                      {
                        typographyStyles.find((t) => t.id === selectedTypography)
                          ?.preview
                      }
                    </div>
                    <p className="text-foreground font-medium">
                      {
                        typographyStyles.find((t) => t.id === selectedTypography)
                          ?.name
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="content-container py-3 sm:py-4 px-2 sm:px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  GE
                </span>
              </div>
              <span className="font-display text-lg sm:text-xl font-semibold text-foreground hidden sm:inline">
                Guia de Estilos
              </span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </div>
          <Progress
            percent={progress}
            showInfo={false}
            strokeColor="hsl(var(--primary))"
            trailColor="hsl(var(--border))"
            size="small"
          />
        </div>
      </div>

      {/* Steps (Desktop) */}
      <div className="hidden md:block pt-28 pb-8 px-2 sm:px-4">
        <div className="content-container">
          <Steps
            current={currentStep}
            items={steps.map((step) => ({
              title: step.title,
              description: step.description,
            }))}
          />
        </div>
      </div>

      {/* Content */}
      <main className="pt-24 sm:pt-28 md:pt-8 pb-32 px-2 sm:px-4">
        <div className="content-container">{renderStepContent()}</div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="content-container py-3 sm:py-4 px-2 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <Button
              type="primary"
              size="large"
              icon={
                currentStep === steps.length - 1 ? (
                  <CheckOutlined />
                ) : (
                  <ArrowRightOutlined />
                )
              }
              onClick={handleNext}
              className="flex-1 sm:flex-initial"
            >
              {currentStep === steps.length - 1 ? "Enviar" : "Avançar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleForm;
