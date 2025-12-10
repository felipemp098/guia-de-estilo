import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Dropdown, Avatar } from "antd";
import { PlusOutlined, TeamOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onCreateClient?: () => void;
}

const Header = ({ onCreateClient }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const clientMenuItems = [
    {
      key: "new-client",
      icon: <PlusOutlined />,
      label: "Novo Cliente",
      onClick: () => onCreateClient?.(),
    },
  ];

  return (
    <AntHeader className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 bg-card/95 backdrop-blur-sm border-b border-border h-16">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">GE</span>
        </div>
        <span className="font-display text-lg sm:text-xl font-semibold text-foreground hidden sm:inline">
          Guia de Estilos
        </span>
      </Link>

      {!isLanding && user && (
        <div className="flex items-center gap-2 sm:gap-4">
          <Dropdown
            menu={{ items: clientMenuItems }}
            placement="bottomLeft"
            trigger={["hover", "click"]}
          >
            <Link
              to="/dashboard"
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <TeamOutlined />
              <span className="hidden sm:inline">Clientes</span>
            </Link>
          </Dropdown>
          <ThemeToggle />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-accent/50 border border-primary/20 hover:bg-accent transition-colors cursor-pointer">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-primary text-primary-foreground"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground hidden sm:inline">
                {user.email?.split("@")[0]}
              </span>
            </div>
          </Dropdown>
        </div>
      )}

      {isLanding && (
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link to="/auth">
            <Button type="default" size="small" className="hidden sm:inline-flex">
              Entrar
            </Button>
          </Link>
          <Link to="/auth">
            <Button type="primary" size="small" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Começar Grátis</span>
              <span className="sm:hidden">Começar</span>
            </Button>
          </Link>
        </div>
      )}
    </AntHeader>
  );
};

export default Header;
