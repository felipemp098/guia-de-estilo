import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { PlusOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onCreateClient?: () => void;
}

const Header = ({ onCreateClient }: HeaderProps) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <AntHeader className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 bg-card/95 backdrop-blur-sm border-b border-border h-16">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">GE</span>
        </div>
        <span className="font-display text-xl font-semibold text-foreground">
          Guia de Estilos
        </span>
      </Link>

      {!isLanding && (
        <div className="flex items-center gap-4">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="border-none bg-transparent"
            items={[
              {
                key: "/dashboard",
                icon: <TeamOutlined />,
                label: <Link to="/dashboard">Clientes</Link>,
              },
            ]}
          />
          {onCreateClient && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateClient}
            >
              Novo Cliente
            </Button>
          )}
        </div>
      )}

      {isLanding && (
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button type="default">Entrar</Button>
          </Link>
          <Link to="/dashboard">
            <Button type="primary">Começar Grátis</Button>
          </Link>
        </div>
      )}
    </AntHeader>
  );
};

export default Header;
