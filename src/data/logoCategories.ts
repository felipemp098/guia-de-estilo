// Importações de imagens de exemplo - você precisará adicionar as imagens reais
// Por enquanto, usando as imagens existentes como placeholder
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

export interface LogoOption {
  id: string;
  image: string;
  alt: string;
}

export interface LogoCategory {
  id: string;
  title: string;
  description: string;
  options: LogoOption[];
}

export const logoCategories: LogoCategory[] = [
  {
    id: "minimalista",
    title: "Minimalista",
    description: "Estilos limpos e simples, focados em simplicidade e clareza visual",
    options: [
      {
        id: "min-1",
        image: styleClean,
        alt: "Minimalista opção 1",
      },
      {
        id: "min-2",
        image: styleFlat,
        alt: "Minimalista opção 2",
      },
      {
        id: "min-3",
        image: styleGeometrico,
        alt: "Minimalista opção 3",
      },
      {
        id: "min-4",
        image: styleTipografia,
        alt: "Minimalista opção 4",
      },
    ],
  },
  {
    id: "luxuoso",
    title: "Luxuoso & Elegante",
    description: "Estilos sofisticados que transmitem exclusividade e refinamento",
    options: [
      {
        id: "lux-1",
        image: styleLuxuoso,
        alt: "Luxuoso opção 1",
      },
      {
        id: "lux-2",
        image: styleClean,
        alt: "Luxuoso opção 2",
      },
      {
        id: "lux-3",
        image: styleTipografia,
        alt: "Luxuoso opção 3",
      },
      {
        id: "lux-4",
        image: styleVintage,
        alt: "Luxuoso opção 4",
      },
    ],
  },
  {
    id: "moderno",
    title: "Moderno & Contemporâneo",
    description: "Designs atualizados que refletem tendências atuais e inovação",
    options: [
      {
        id: "mod-1",
        image: style3d,
        alt: "Moderno opção 1",
      },
      {
        id: "mod-2",
        image: styleAbstrato,
        alt: "Moderno opção 2",
      },
      {
        id: "mod-3",
        image: styleGeometrico,
        alt: "Moderno opção 3",
      },
      {
        id: "mod-4",
        image: styleFlat,
        alt: "Moderno opção 4",
      },
    ],
  },
  {
    id: "organico",
    title: "Orgânico & Natural",
    description: "Formas fluidas e naturais que transmitem autenticidade e conexão com a natureza",
    options: [
      {
        id: "org-1",
        image: styleOrganic,
        alt: "Orgânico opção 1",
      },
      {
        id: "org-2",
        image: styleIlustracao,
        alt: "Orgânico opção 2",
      },
      {
        id: "org-3",
        image: styleFeminino,
        alt: "Orgânico opção 3",
      },
      {
        id: "org-4",
        image: styleDivertida,
        alt: "Orgânico opção 4",
      },
    ],
  },
  {
    id: "vintage",
    title: "Vintage & Retrô",
    description: "Estilos nostálgicos inspirados em décadas passadas com toque contemporâneo",
    options: [
      {
        id: "vin-1",
        image: styleVintage,
        alt: "Vintage opção 1",
      },
      {
        id: "vin-2",
        image: styleGrunge,
        alt: "Vintage opção 2",
      },
      {
        id: "vin-3",
        image: styleTipografia,
        alt: "Vintage opção 3",
      },
      {
        id: "vin-4",
        image: styleMasculino,
        alt: "Vintage opção 4",
      },
    ],
  },
  {
    id: "divertido",
    title: "Divertido & Descontraído",
    description: "Designs alegres e descontraídos que transmitem energia positiva",
    options: [
      {
        id: "div-1",
        image: styleDivertida,
        alt: "Divertido opção 1",
      },
      {
        id: "div-2",
        image: styleIlustracao,
        alt: "Divertido opção 2",
      },
      {
        id: "div-3",
        image: styleFeminino,
        alt: "Divertido opção 3",
      },
      {
        id: "div-4",
        image: style3d,
        alt: "Divertido opção 4",
      },
    ],
  },
];

