import { populateDefaultLogoCategories } from "@/services/logoCategoriesService";

/**
 * Função utilitária para popular dados padrão no banco
 * Pode ser chamada manualmente ou em um script de setup
 */
export async function populateAllDefaultData() {
  console.log("Populando dados padrão...");
  
  const logoCategoriesSuccess = await populateDefaultLogoCategories();
  
  if (logoCategoriesSuccess) {
    console.log("✅ Categorias de logo populadas com sucesso");
  } else {
    console.log("ℹ️ Categorias de logo já existem ou houve erro");
  }

  return {
    logoCategories: logoCategoriesSuccess,
  };
}

