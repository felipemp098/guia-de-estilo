import { Modal, Form, Input, message } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; email: string }) => void;
}

const CreateClientModal = ({
  open,
  onClose,
  onSubmit,
}: CreateClientModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      message.success("Cliente criado com sucesso!");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">Novo Cliente</span>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Criar Cliente"
      cancelText="Cancelar"
      centered
      width={480}
    >
      <Form form={form} layout="vertical" className="mt-6">
        <Form.Item
          name="name"
          label="Nome do Cliente"
          rules={[{ required: true, message: "Por favor, insira o nome" }]}
        >
          <Input
            prefix={<UserOutlined className="text-muted-foreground" />}
            placeholder="Ex: Maria Silva"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: "Por favor, insira o e-mail" },
            { type: "email", message: "E-mail inválido" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-muted-foreground" />}
            placeholder="Ex: maria@email.com"
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClientModal;
