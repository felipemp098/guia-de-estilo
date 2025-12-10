import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export interface CreateClientData {
  name: string;
  email: string;
}

export interface ClientWithResponse extends Client {
  style_response?: {
    selected_logo_options: Record<string, string>;
    selected_palette: string | null;
    selected_typography: string | null;
  } | null;
}

/**
 * Cria um novo cliente
 */
export async function createClient(data: CreateClientData): Promise<Client> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const clientData: ClientInsert = {
    user_id: user.id,
    name: data.name,
    email: data.email,
    status: "pending",
  };

  const { data: client, error } = await supabase
    .from("clients")
    .insert(clientData)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar cliente: ${error.message}`);
  }

  return client;
}

/**
 * Busca todos os clientes do usuário logado
 */
export async function getClientsByUserId(): Promise<Client[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar clientes: ${error.message}`);
  }

  return clients || [];
}

/**
 * Busca um cliente específico por ID (requer autenticação e verifica ownership)
 */
export async function getClientById(clientId: string): Promise<Client | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Cliente não encontrado
      return null;
    }
    throw new Error(`Erro ao buscar cliente: ${error.message}`);
  }

  return client;
}

/**
 * Busca um cliente por ID sem verificar autenticação (para formulário público)
 * Esta função não verifica se o cliente pertence ao usuário
 */
export async function getClientByIdPublic(clientId: string): Promise<Client | null> {
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Cliente não encontrado
      return null;
    }
    throw new Error(`Erro ao buscar cliente: ${error.message}`);
  }

  return client;
}

/**
 * Busca cliente com sua resposta de estilo (se existir)
 */
export async function getClientWithResponse(
  clientId: string
): Promise<ClientWithResponse | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select(
      `
      *,
      style_response:style_responses(
        selected_logo_options,
        selected_palette,
        selected_typography
      )
    `
    )
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Erro ao buscar cliente: ${error.message}`);
  }

  return client as ClientWithResponse;
}

/**
 * Atualiza o status de um cliente
 */
export async function updateClientStatus(
  clientId: string,
  status: "pending" | "completed"
): Promise<Client> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const updateData: ClientUpdate = {
    status,
    ...(status === "completed" && { completed_at: new Date().toISOString() }),
  };

  const { data: client, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", clientId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar cliente: ${error.message}`);
  }

  return client;
}

/**
 * Deleta um cliente
 */
export async function deleteClient(clientId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Erro ao deletar cliente: ${error.message}`);
  }
}

