import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Dropdown } from "antd";
import { PlusOutlined, TeamOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onCreateClient?: () => void;
}

const Header = ({ onCreateClient }: HeaderProps) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { user, signOut } = useAuth();

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      onClick: signOut,
    },
  ];

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

      {!isLanding && user && (
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
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} className="flex items-center">
              {user.email?.split("@")[0]}
            </Button>
          </Dropdown>
        </div>
      )}

      {isLanding && (
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button type="default">Entrar</Button>
          </Link>
          <Link to="/auth">
            <Button type="primary">Começar Grátis</Button>
          </Link>
        </div>
      )}
    </AntHeader>
  );
};

export default Header;
