import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/Header";

const features = [
  {
    icon: <ThunderboltOutlined className="text-3xl text-primary" />,
    title: "Formulário Interativo",
    description:
      "Substitua PDFs estáticos por um formulário visual, fluido e 100% interativo.",
  },
  {
    icon: <RobotOutlined className="text-3xl text-primary" />,
    title: "IA Inteligente",
    description:
      "Receba sugestões automáticas baseadas nas combinações de estilos selecionados.",
  },
  {
    icon: <TeamOutlined className="text-3xl text-primary" />,
    title: "Dashboard Completo",
    description:
      "Organize todos os seus clientes e acompanhe o status de cada projeto.",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie o cliente",
    description: "Adicione o nome e e-mail do seu cliente em segundos.",
  },
  {
    number: "02",
    title: "Envie o link",
    description: "Compartilhe o formulário personalizado com seu cliente.",
  },
  {
    number: "03",
    title: "Receba insights",
    description: "A IA analisa as escolhas e gera sugestões para você.",
  },
];

const Index = () => {
  return (
    <div className="page-container">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="content-container">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-accent rounded-full text-accent-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <CheckCircleOutlined />
              <span className="hidden sm:inline">Para designers que valorizam clareza</span>
              <span className="sm:hidden">Designers</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Descubra o estilo visual
              <br />
              <span className="gradient-text">do seu cliente</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto">
              Uma plataforma que transforma o processo de briefing em uma
              experiência visual, interativa e inteligente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="h-12 px-6 sm:px-8 text-base w-full sm:w-auto"
                >
                  Começar Agora
                </Button>
              </Link>
              <Link to="/form/demo" className="w-full sm:w-auto">
                <Button size="large" className="h-12 px-6 sm:px-8 text-base w-full sm:w-auto">
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas pensadas para simplificar seu fluxo de trabalho
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card-hover p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um processo simples em três etapas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl font-display font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="content-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Experimente gratuitamente e transforme a forma como você coleta
            preferências visuais.
          </p>
          <Link to="/auth">
            <Button
              size="large"
              className="h-12 px-8 text-base bg-card text-foreground hover:bg-card/90 border-none"
            >
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  GE
                </span>
              </div>
              <span className="font-display font-semibold text-foreground">
                Guia de Estilos
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Guia de Estilos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
