import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Tabs,
  Card,
  Statistic,
  Tooltip,
  message,
  Spin,
  Empty,
  Skeleton,
} from "antd";
import {
  EyeOutlined,
  CopyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Header from "@/components/layout/Header";
import CreateClientModal from "@/components/CreateClientModal";
import { useAuth } from "@/hooks/useAuth";
import { useClients, useCreateClient } from "@/hooks/useClients";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useClients();
  const createClientMutation = useCreateClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateClient = async (values: { name: string; email: string }) => {
    try {
      await createClientMutation.mutateAsync(values);
      setIsModalOpen(false);
    } catch (error) {
      // Erro já é tratado no hook
      console.error("Erro ao criar cliente:", error);
    }
  };

  const copyLink = (clientId: string) => {
    const link = `${window.location.origin}/form/${clientId}`;
    navigator.clipboard.writeText(link);
    message.success("Link copiado!");
  };

  const filteredClients =
    activeTab === "all"
      ? clients
      : clients.filter((c) => c.status === activeTab);

  const columns: ColumnsType<Client> = [
    {
      title: "Cliente",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name, record) => (
        <div>
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status) => (
        <Tag
          color={status === "completed" ? "success" : "warning"}
          icon={
            status === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
        >
          <span className="hidden sm:inline">
            {status === "completed" ? "Respondido" : "Pendente"}
          </span>
          <span className="sm:hidden">
            {status === "completed" ? "OK" : "..."}
          </span>
        </Tag>
      ),
    },
    {
      title: "Criado em",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 120,
      render: (date: string) => (
        <span className="text-xs sm:text-sm">
          {new Date(date).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 100,
      fixed: 'right' as const,
      render: (_, record) => (
        <div className="flex items-center gap-1 sm:gap-2 justify-end">
          <Tooltip title="Copiar link do formulário">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyLink(record.id)}
            />
          </Tooltip>
          {record.status === "completed" && (
            <Tooltip title="Ver relatório">
              <Link to={`/report/${record.id}`}>
                <Button type="text" size="small" icon={<EyeOutlined />} />
              </Link>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: clients.length,
    completed: clients.filter((c) => c.status === "completed").length,
    pending: clients.filter((c) => c.status === "pending").length,
  };

  return (
    <div className="page-container">
      <Header onCreateClient={() => setIsModalOpen(true)} />

      <main className="pt-24 pb-12 px-2 sm:px-4">
        <div className="content-container">
          {/* Stats Cards */}
          {clientsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass-card">
                  <Skeleton active paragraph={{ rows: 0 }} />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
              <Card className="glass-card">
                <Statistic
                  title={
                    <span className="text-muted-foreground">Total de Clientes</span>
                  }
                  value={stats.total}
                  prefix={<TeamOutlined className="text-primary" />}
                />
              </Card>
              <Card className="glass-card">
                <Statistic
                  title={
                    <span className="text-muted-foreground">Respondidos</span>
                  }
                  value={stats.completed}
                  prefix={<CheckCircleOutlined className="text-success" />}
                  valueStyle={{ color: "hsl(var(--success))" }}
                />
              </Card>
              <Card className="glass-card">
                <Statistic
                  title={<span className="text-muted-foreground">Pendentes</span>}
                  value={stats.pending}
                  prefix={<ClockCircleOutlined className="text-warning" />}
                  valueStyle={{ color: "hsl(var(--warning))" }}
                />
              </Card>
            </div>
          )}

          {/* Clients Table */}
          <Card className="glass-card animate-slide-up">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: "all", label: "Todos" },
                { key: "pending", label: "Pendentes" },
                { key: "completed", label: "Respondidos" },
              ]}
            />
            {clientsError ? (
              <Empty
                description="Erro ao carregar clientes. Tente novamente."
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={filteredClients}
                  rowKey="id"
                  pagination={{ pageSize: 10, responsive: true }}
                  locale={{ emptyText: "Nenhum cliente encontrado" }}
                  loading={clientsLoading}
                  scroll={{ x: 'max-content' }}
                />
              </div>
            )}
          </Card>
        </div>
      </main>

      <CreateClientModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
};

export default Dashboard;
