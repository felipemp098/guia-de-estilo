import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  createClient,
  getClientsByUserId,
  getClientById,
  getClientByIdPublic,
  getClientWithResponse,
  updateClientStatus,
  deleteClient,
  type CreateClientData,
} from "@/services/clientsService";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

/**
 * Hook para buscar todos os clientes do usuário
 */
export function useClients() {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClientsByUserId,
    staleTime: 30 * 1000, // Cache por 30 segundos
    retry: 2,
  });
}

/**
 * Hook para buscar um cliente específico (requer autenticação)
 */
export function useClient(clientId: string | undefined) {
  return useQuery<Client | null>({
    queryKey: ["client", clientId],
    queryFn: () => (clientId ? getClientById(clientId) : Promise.resolve(null)),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook para buscar um cliente específico sem autenticação (para formulário público)
 */
export function useClientPublic(clientId: string | undefined) {
  return useQuery<Client | null>({
    queryKey: ["clientPublic", clientId],
    queryFn: () => (clientId ? getClientByIdPublic(clientId) : Promise.resolve(null)),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    retry: 2,
    retryDelay: 1000,
  });
}

/**
 * Hook para buscar cliente com resposta de estilo
 */
export function useClientWithResponse(clientId: string | undefined) {
  return useQuery({
    queryKey: ["clientWithResponse", clientId],
    queryFn: () =>
      clientId ? getClientWithResponse(clientId) : Promise.resolve(null),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook para criar um novo cliente
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientData) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      message.success("Cliente criado com sucesso!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Erro ao criar cliente");
    },
  });
}

/**
 * Hook para atualizar status do cliente
 */
export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      status,
    }: {
      clientId: string;
      status: "pending" | "completed";
    }) => updateClientStatus(clientId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({
        queryKey: ["client", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientWithResponse", variables.clientId],
      });
      message.success("Status atualizado com sucesso!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Erro ao atualizar status");
    },
  });
}

/**
 * Hook para deletar cliente
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      message.success("Cliente deletado com sucesso!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Erro ao deletar cliente");
    },
  });
}

