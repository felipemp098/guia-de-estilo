import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StyleForm from "./pages/StyleForm";
import Report from "./pages/Report";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Ant Design theme configuration
const antTheme = {
  token: {
    colorPrimary: "#4b8df8",
    borderRadius: 8,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
