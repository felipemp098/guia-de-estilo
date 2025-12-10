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
import { mockClients, Client } from "@/data/mockClients";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [activeTab, setActiveTab] = useState("all");

  const handleCreateClient = (values: { name: string; email: string }) => {
    const newClient: Client = {
      id: String(Date.now()),
      name: values.name,
      email: values.email,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setClients([newClient, ...clients]);
    setIsModalOpen(false);
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
      render: (name, record) => (
        <div>
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
          {status === "completed" ? "Respondido" : "Pendente"}
        </Tag>
      ),
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("pt-BR"),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Copiar link do formulário">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyLink(record.id)}
            />
          </Tooltip>
          {record.status === "completed" && (
            <Tooltip title="Ver relatório">
              <Link to={`/report/${record.id}`}>
                <Button type="text" icon={<EyeOutlined />} />
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

      <main className="pt-24 pb-12 px-4">
        <div className="content-container">
          {/* Stats Cards */}
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
            <Table
              columns={columns}
              dataSource={filteredClients}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: "Nenhum cliente encontrado" }}
            />
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
