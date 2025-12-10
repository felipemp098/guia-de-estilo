import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  saveStyleResponse,
  saveStyleResponsePublic,
  getStyleResponseByClientId,
  type StyleResponseData,
} from "@/services/styleResponsesService";
import type { Database } from "@/integrations/supabase/types";

type StyleResponse = Database["public"]["Tables"]["style_responses"]["Row"];

/**
 * Hook para salvar resposta de estilo (requer autenticação)
 */
export function useSaveStyleResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      responseData,
    }: {
      clientId: string;
      responseData: StyleResponseData;
    }) => saveStyleResponse(clientId, responseData),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({
        queryKey: ["client", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientWithResponse", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["styleResponse", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientPublic", variables.clientId],
      });
      message.success("Resposta salva com sucesso!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Erro ao salvar resposta");
    },
  });
}

/**
 * Hook para salvar resposta de estilo (público, para formulário)
 */
export function useSaveStyleResponsePublic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      responseData,
    }: {
      clientId: string;
      responseData: StyleResponseData;
    }) => saveStyleResponsePublic(clientId, responseData),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["clientPublic", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["styleResponse", variables.clientId],
      });
      message.success("Resposta salva com sucesso!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Erro ao salvar resposta");
    },
  });
}

/**
 * Hook para buscar resposta de estilo por clientId
 */
export function useStyleResponse(clientId: string | undefined) {
  return useQuery<StyleResponse | null>({
    queryKey: ["styleResponse", clientId],
    queryFn: () =>
      clientId
        ? getStyleResponseByClientId(clientId)
        : Promise.resolve(null),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}

