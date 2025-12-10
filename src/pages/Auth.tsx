import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Divider, Alert } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";

const { Title, Text } = Typography;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (values: { email: string; password: string; name?: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            setError("Email ou senha incorretos. Verifique suas credenciais.");
          } else {
            setError(error.message);
          }
          return;
        }
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: values.name,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setError("Este email já está cadastrado. Tente fazer login.");
          } else {
            setError(error.message);
          }
          return;
        }

        setSuccess("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    form.resetFields();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-elegant p-8 border border-border">
            <div className="text-center mb-8">
              <Title level={2} className="!mb-2 !text-foreground">
                {isLogin ? "Bem-vindo de volta" : "Criar conta"}
              </Title>
              <Text className="text-muted-foreground">
                {isLogin 
                  ? "Entre na sua conta para continuar" 
                  : "Crie sua conta para começar"}
              </Text>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className="mb-6"
                closable
                onClose={() => setError(null)}
              />
            )}

            {success && (
              <Alert
                message={success}
                type="success"
                showIcon
                className="mb-6"
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              size="large"
            >
              {!isLogin && (
                <Form.Item
                  name="name"
                  label="Nome completo"
                  rules={[
                    { required: true, message: "Digite seu nome" },
                    { min: 2, message: "Nome deve ter pelo menos 2 caracteres" },
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-muted-foreground" />}
                    placeholder="Seu nome"
                  />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Digite seu email" },
                  { type: "email", message: "Digite um email válido" },
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-muted-foreground" />}
                  placeholder="seu@email.com"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  { required: true, message: "Digite sua senha" },
                  { min: 6, message: "Senha deve ter pelo menos 6 caracteres" },
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-muted-foreground" />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item className="mb-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  className="h-12 text-base font-medium"
                >
                  {isLogin ? "Entrar" : "Criar conta"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="!my-6">
              <Text className="text-muted-foreground text-sm">ou</Text>
            </Divider>

            <div className="text-center">
              <Text className="text-muted-foreground">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              </Text>
              <Button 
                type="link" 
                onClick={toggleMode}
                className="!px-1 font-medium"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
