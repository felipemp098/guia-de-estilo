import style3d from "@/assets/styles/3d.jpg";
import styleAbstrato from "@/assets/styles/abstrato.jpg";
import styleClean from "@/assets/styles/clean-minimalist.jpg";
import styleFeminino from "@/assets/styles/feminino.jpg";
import styleMasculino from "@/assets/styles/masculino.jpg";
import styleOrganic from "@/assets/styles/organic.jpg";
import styleLuxuoso from "@/assets/styles/luxuoso.jpg";
import styleTipografia from "@/assets/styles/tipografia.jpg";
import styleDivertida from "@/assets/styles/divertida.jpg";
import styleGeometrico from "@/assets/styles/geometrico.jpg";
import styleFlat from "@/assets/styles/flat.jpg";
import styleGrunge from "@/assets/styles/grunge.jpg";
import styleIlustracao from "@/assets/styles/ilustracao.jpg";
import styleVintage from "@/assets/styles/vintage.jpg";

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  image: string;
}

export const styleOptions: StyleOption[] = [
  {
    id: "3d",
    name: "3D",
    description: "Caracteriza-se por criar a ilusão de volume e massa com luz e sombra, parecendo ocupar um espaço físico.",
    characteristics: ["Ilusão de profundidade", "Volumetria", "Efeitos de luz", "Sombras de uma única cor"],
    image: style3d,
  },
  {
    id: "abstrato",
    name: "Abstrato",
    description: "Este estilo cria uma peça conceitual de arte que seja independente do que parece no mundo real.",
    characteristics: ["Representação ambígua", "Interpretação individual", "Subjetivo"],
    image: styleAbstrato,
  },
  {
    id: "clean-minimalist",
    name: "Clean Minimalist",
    description: "Caracterizado por espaços negativos e simples. É o oposto de estilos extravagantes, busca formas básicas.",
    characteristics: ["Preto, branco ou 1 cor", "Linhas fluidas ou retas", "Oposto de abstrato", "Sem sombras e luz"],
    image: styleClean,
  },
  {
    id: "feminino",
    name: "Feminino",
    description: "É normalmente caracterizado por detalhes estereotipados que atraem a atenção feminina.",
    characteristics: ["Fontes cursivas e fluidas", "Tons pastéis", "Linhas delicadas"],
    image: styleFeminino,
  },
  {
    id: "masculino",
    name: "Masculino",
    description: "É o estereótipo apelativo para homens. Detalhes incluem linhas simples e cores monocromáticas.",
    characteristics: ["Fontes pontudas ou grossas", "Tons mais escuros e frios", "Textura em pedra"],
    image: styleMasculino,
  },
  {
    id: "organic",
    name: "Orgânico / Natural",
    description: "Traz as formas naturais e reais, caracterizadas por linhas contínuas e dinâmicas.",
    characteristics: ["Elementos naturais", "Exprime ideia de natural", "Tons verdes e amarelos"],
    image: styleOrganic,
  },
  {
    id: "luxuoso",
    name: "Luxuoso",
    description: "Evoca a ideia de conforto máximo ou um prazer extra, adicional ao que é necessário.",
    characteristics: ["Cores preta, dourada e bronze", "Elegante e sofisticado", "Impacta e remete ao luxo"],
    image: styleLuxuoso,
  },
  {
    id: "tipografia",
    name: "Tipografia",
    description: "O estilo tipográfico utiliza a modificação de fontes. É o design de palavras escritas.",
    characteristics: ["Fonte é o foco do design", "Nome da empresa é o logotipo", "Pode incorporar elementos extras"],
    image: styleTipografia,
  },
  {
    id: "divertida",
    name: "Divertida",
    description: "Inspira diversão e costuma ter uma ideia informal e não rígida.",
    characteristics: ["Transmite alegria e diversão", "Colorido ou cores vividas", "Dinâmica e bem humorada"],
    image: styleDivertida,
  },
  {
    id: "geometrico",
    name: "Geométrico",
    description: "Deriva da ideia geométrica, usa linhas e formatos retos. Compõe-se por elementos poligonais.",
    characteristics: ["Linhas retas e padrões", "Incorpora simetria", "Transmite rigidez e postura"],
    image: styleGeometrico,
  },
  {
    id: "flat",
    name: "Flat",
    description: "Subcategoria do minimalista: aplica o uso mínimo de cores e sombras.",
    characteristics: ["Usa poucas cores", "Sombra não realista", "Sombra e luz de forma leve"],
    image: styleFlat,
  },
  {
    id: "grunge",
    name: "Grunge",
    description: "Subcategoria do estilo vintage, o grunge evoca um estilo sombrio dos anos 90.",
    characteristics: ["Cores escuras e monocromáticas", "Sentimento sombrio", "Estilo perigoso"],
    image: styleGrunge,
  },
  {
    id: "ilustracao",
    name: "Ilustração",
    description: "É derivado da interpretação ou explicação visual de um texto, conceito ou processo.",
    characteristics: ["Olhar de rascunho", "Desenho à mão", "Traço do desenhador"],
    image: styleIlustracao,
  },
  {
    id: "vintage",
    name: "Vintage / Retrô",
    description: "Vintage ou retrô deriva de tendências do passado (Era Victoriana, punk e Bauhaus).",
    characteristics: ["Elementos nostálgicos", "Ornamentos como laços e fitas", "Cores envelhecidas"],
    image: styleVintage,
  },
];

export const colorPalettes = [
  {
    id: "neutral",
    name: "Neutro & Elegante",
    colors: ["#1a1a1a", "#4a4a4a", "#8a8a8a", "#d4d4d4", "#f5f5f5"],
  },
  {
    id: "warm",
    name: "Quente & Acolhedor",
    colors: ["#8B4513", "#D2691E", "#F4A460", "#FFDAB9", "#FFF8DC"],
  },
  {
    id: "cool",
    name: "Frio & Profissional",
    colors: ["#1e3a5f", "#3d5a80", "#98c1d9", "#e0fbfc", "#ffffff"],
  },
  {
    id: "nature",
    name: "Natural & Orgânico",
    colors: ["#2d4a3e", "#4a7c59", "#8fbc8f", "#c8e6c9", "#f1f8e9"],
  },
  {
    id: "luxury",
    name: "Luxo & Sofisticado",
    colors: ["#1a1a1a", "#333333", "#8b6914", "#d4af37", "#f5f5dc"],
  },
  {
    id: "vibrant",
    name: "Vibrante & Moderno",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"],
  },
  {
    id: "pastel",
    name: "Pastel & Suave",
    colors: ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"],
  },
  {
    id: "monochrome",
    name: "Monocromático",
    colors: ["#0d47a1", "#1976d2", "#42a5f5", "#90caf9", "#e3f2fd"],
  },
];

export const typographyStyles = [
  {
    id: "serif-classic",
    name: "Serifada Clássica",
    description: "Transmite tradição, elegância e confiabilidade",
    preview: "Playfair Display",
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: "sans-modern",
    name: "Sans-Serif Moderna",
    description: "Clean, contemporânea e versátil",
    preview: "DM Sans",
    fontFamily: "'DM Sans', sans-serif",
  },
  {
    id: "geometric",
    name: "Geométrica",
    description: "Minimalista, técnica e precisa",
    preview: "Poppins",
    fontFamily: "'Poppins', sans-serif",
  },
  {
    id: "handwritten",
    name: "Manuscrita",
    description: "Pessoal, artística e única",
    preview: "Dancing Script",
    fontFamily: "'Dancing Script', cursive",
  },
  {
    id: "bold-impact",
    name: "Bold & Impactante",
    description: "Forte, marcante e ousada",
    preview: "Oswald",
    fontFamily: "'Oswald', sans-serif",
  },
  {
    id: "elegant-thin",
    name: "Elegante & Fina",
    description: "Sofisticada, leve e refinada",
    preview: "Cormorant Garamond",
    fontFamily: "'Cormorant Garamond', serif",
  },
];
