import { useQuery } from "@tanstack/react-query";
import { getLogoCategories, populateDefaultLogoCategories } from "@/services/logoCategoriesService";
import { LogoCategory } from "@/data/logoCategories";

export function useLogoCategories() {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useQuery<LogoCategory[]>({
    queryKey: ["logoCategories"],
    queryFn: getLogoCategories,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  const populateDefaults = async () => {
    const success = await populateDefaultLogoCategories();
    if (success) {
      refetch();
    }
    return success;
  };

  return {
    categories: categories || [],
    isLoading,
    error,
    refetch,
    populateDefaults,
  };
}

