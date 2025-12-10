import { supabase } from "@/integrations/supabase/client";
import { logoCategories, LogoCategory } from "@/data/logoCategories";

export interface LogoCategoryDB {
  id: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LogoOptionDB {
  id: string;
  category_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Busca categorias de logo do banco de dados
 * Retorna null se não houver dados cadastrados
 */
export async function fetchLogoCategoriesFromDB(): Promise<LogoCategory[] | null> {
  try {
    // Buscar categorias ativas ordenadas
    const { data: categories, error: categoriesError } = await supabase
      .from("logo_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (categoriesError) {
      console.error("Erro ao buscar categorias:", categoriesError);
      return null;
    }

    if (!categories || categories.length === 0) {
      return null;
    }

    // Buscar opções para cada categoria
    const categoryIds = categories.map((cat) => cat.id);
    const { data: options, error: optionsError } = await supabase
      .from("logo_options")
      .select("*")
      .in("category_id", categoryIds)
      .order("display_order", { ascending: true });

    if (optionsError) {
      console.error("Erro ao buscar opções:", optionsError);
      return null;
    }

    // Transformar dados do banco para o formato esperado
    const transformedCategories: LogoCategory[] = categories.map((category) => {
      const categoryOptions = options
        ?.filter((opt) => opt.category_id === category.id)
        .map((opt) => ({
          id: opt.id,
          image: opt.image_url,
          alt: opt.alt_text,
        })) || [];

      return {
        id: category.id,
        title: category.title,
        description: category.description,
        options: categoryOptions,
      };
    });

    // Retornar apenas categorias que têm pelo menos uma opção
    return transformedCategories.filter((cat) => cat.options.length > 0);
  } catch (error) {
    console.error("Erro ao buscar categorias do banco:", error);
    return null;
  }
}

/**
 * Popula o banco de dados com as categorias padrão
 */
export async function populateDefaultLogoCategories(): Promise<boolean> {
  try {
    // Verificar se já existem categorias
    const { data: existingCategories } = await supabase
      .from("logo_categories")
      .select("id")
      .limit(1);

    if (existingCategories && existingCategories.length > 0) {
      console.log("Categorias já existem no banco");
      return false;
    }

    // Inserir categorias padrão
    for (let i = 0; i < logoCategories.length; i++) {
      const category = logoCategories[i];

      // Inserir categoria
      const { data: insertedCategory, error: categoryError } = await supabase
        .from("logo_categories")
        .insert({
          title: category.title,
          description: category.description,
          display_order: i,
          is_active: true,
        })
        .select()
        .single();

      if (categoryError || !insertedCategory) {
        console.error("Erro ao inserir categoria:", categoryError);
        continue;
      }

      // Inserir opções da categoria
      const optionsToInsert = category.options.map((option, optionIndex) => ({
        category_id: insertedCategory.id,
        image_url: option.image,
        alt_text: option.alt,
        display_order: optionIndex,
      }));

      const { error: optionsError } = await supabase
        .from("logo_options")
        .insert(optionsToInsert);

      if (optionsError) {
        console.error("Erro ao inserir opções:", optionsError);
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao popular categorias padrão:", error);
    return false;
  }
}

/**
 * Busca categorias: tenta do banco primeiro, usa defaults se não houver
 */
export async function getLogoCategories(): Promise<LogoCategory[]> {
  const dbCategories = await fetchLogoCategoriesFromDB();
  
  if (dbCategories && dbCategories.length > 0) {
    return dbCategories;
  }

  // Se não houver dados no banco, retornar defaults
  return logoCategories;
}

