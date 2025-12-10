import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import ptBR from "antd/locale/pt_BR";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useTheme } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StyleForm from "./pages/StyleForm";
import Report from "./pages/Report";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente interno que precisa do tema
const AppContent = () => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  // Ant Design theme configuration
  const antTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: "#4b8df8",
      borderRadius: 8,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    },
  };

  return (
    <ErrorBoundary>
      <ConfigProvider theme={antTheme} locale={ptBR}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/form/:clientId" element={<StyleForm />} />
              <Route path="/report/:clientId" element={<Report />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="guia-estilos-theme">
      <AppContent />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
