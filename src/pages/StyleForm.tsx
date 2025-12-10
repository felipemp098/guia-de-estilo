import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Steps, Button, Progress, Result, message } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import StyleCard from "@/components/StyleCard";
import ColorPaletteCard from "@/components/ColorPaletteCard";
import TypographyCard from "@/components/TypographyCard";
import { styleOptions, colorPalettes, typographyStyles } from "@/data/styles";

const StyleForm = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [selectedTypography, setSelectedTypography] = useState<string | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { title: "Estilos", description: "Escolha até 3 estilos" },
    { title: "Cores", description: "Selecione uma paleta" },
    { title: "Tipografia", description: "Escolha um estilo" },
    { title: "Confirmação", description: "Revise suas escolhas" },
  ];

  const handleStyleToggle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter((id) => id !== styleId));
    } else if (selectedStyles.length < 3) {
      setSelectedStyles([...selectedStyles, styleId]);
    } else {
      message.warning("Você pode selecionar no máximo 3 estilos");
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && selectedStyles.length === 0) {
      message.warning("Selecione pelo menos 1 estilo");
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
      setIsCompleted(true);
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
                Quais estilos te atraem?
              </h2>
              <p className="text-muted-foreground">
                Selecione até 3 estilos que representam sua visão (
                {selectedStyles.length}/3 selecionados)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {styleOptions.map((style) => (
                <StyleCard
                  key={style.id}
                  {...style}
                  selected={selectedStyles.includes(style.id)}
                  onClick={() => handleStyleToggle(style.id)}
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
              {/* Selected Styles */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  Estilos Selecionados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedStyles.map((styleId) => {
                    const style = styleOptions.find((s) => s.id === styleId);
                    return style ? (
                      <div
                        key={styleId}
                        className="rounded-lg overflow-hidden border border-border"
                      >
                        <img
                          src={style.image}
                          alt={style.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-center text-sm font-medium text-foreground">
                          {style.name}
                        </div>
                      </div>
                    ) : null;
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
        <div className="content-container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  GE
                </span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Guia de Estilos
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
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
      <div className="hidden md:block pt-28 pb-8 px-4">
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
      <main className="pt-28 md:pt-8 pb-32 px-4">
        <div className="content-container">{renderStepContent()}</div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="content-container py-4">
          <div className="flex items-center justify-between">
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Voltar
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
