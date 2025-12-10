import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type StyleResponse = Database["public"]["Tables"]["style_responses"]["Row"];
type StyleResponseInsert = Database["public"]["Tables"]["style_responses"]["Insert"];
type StyleResponseUpdate = Database["public"]["Tables"]["style_responses"]["Update"];

export interface StyleResponseData {
  selectedLogoOptions: Record<string, string>;
  selectedPalette: string | null;
  selectedTypography: string | null;
}

/**
 * Salva ou atualiza a resposta de estilo de um cliente (requer autenticação)
 */
export async function saveStyleResponse(
  clientId: string,
  responseData: StyleResponseData
): Promise<StyleResponse> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se o cliente pertence ao usuário
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, user_id")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();

  if (clientError || !client) {
    throw new Error("Cliente não encontrado ou sem permissão");
  }

  return saveStyleResponsePublic(clientId, responseData);
}

/**
 * Salva ou atualiza a resposta de estilo de um cliente (público, para formulário)
 */
export async function saveStyleResponsePublic(
  clientId: string,
  responseData: StyleResponseData
): Promise<StyleResponse> {
  // Verificar se o cliente existe
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, status")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    throw new Error("Cliente não encontrado");
  }

  // Verificar se já foi completado (evitar sobrescrever)
  if (client.status === "completed") {
    throw new Error("Este formulário já foi respondido");
  }

  // Usar função stored procedure para inserir/atualizar
  // Isso bypassa RLS e permite inserção pública vinculada ao client_id
  // A função verifica se o cliente existe, se já foi completado, e gerencia inserção/atualização
  // Também atualiza o status do cliente automaticamente
  const { data, error } = await supabase.rpc("insert_style_response_public", {
    p_client_id: clientId,
    p_selected_logo_options: responseData.selectedLogoOptions,
    p_selected_palette: responseData.selectedPalette,
    p_selected_typography: responseData.selectedTypography,
  });

  if (error) {
    console.error("Erro detalhado ao salvar resposta:", {
      error,
      errorCode: error.code,
      errorMessage: error.message,
      errorDetails: error.details,
      errorHint: error.hint,
    });
    throw new Error(`Erro ao salvar resposta: ${error.message}`);
  }

  // A função RPC retorna um único objeto quando RETURNS é um tipo de tabela
  let response: StyleResponse;
  if (data && !Array.isArray(data)) {
    response = data as StyleResponse;
  } else if (data && Array.isArray(data) && data.length > 0) {
    response = data[0] as StyleResponse;
  } else {
    throw new Error("Resposta não retornada pela função");
  }

  return response;
}

/**
 * Busca a resposta de estilo de um cliente
 */
export async function getStyleResponseByClientId(
  clientId: string
): Promise<StyleResponse | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se o cliente pertence ao usuário
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();

  if (!client) {
    throw new Error("Cliente não encontrado ou sem permissão");
  }

  const { data: response, error } = await supabase
    .from("style_responses")
    .select("*")
    .eq("client_id", clientId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Resposta não encontrada
      return null;
    }
    throw new Error(`Erro ao buscar resposta: ${error.message}`);
  }

  return response;
}

