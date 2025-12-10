export interface Client {
  id: string;
  name: string;
  email: string;
  status: "pending" | "completed";
  createdAt: string;
  completedAt?: string;
  selectedStyles?: string[];
  selectedPalette?: string;
  selectedTypography?: string;
}

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    status: "completed",
    createdAt: "2024-01-15",
    completedAt: "2024-01-18",
    selectedStyles: ["luxuoso", "clean-minimalist", "tipografia"],
    selectedPalette: "luxury",
    selectedTypography: "elegant-thin",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com",
    status: "pending",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    status: "completed",
    createdAt: "2024-01-10",
    completedAt: "2024-01-12",
    selectedStyles: ["organic", "feminino", "flat"],
    selectedPalette: "nature",
    selectedTypography: "handwritten",
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro@email.com",
    status: "pending",
    createdAt: "2024-01-22",
  },
];
