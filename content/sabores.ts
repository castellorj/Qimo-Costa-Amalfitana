import type { GlossaryTerm, ShoppingItem } from "./types";

/**
 * Glossário gastronômico para ler o cardápio dálmata (guia QIMO, slides 43–44).
 */
export const glossary: GlossaryTerm[] = [
  { term: "Peka / ispod peke", kind: "tecnica", definition: "Cozimento lento sob campânula de ferro coberta de brasas — carne ou polvo com batatas e ervas. Encomende com horas de antecedência." },
  { term: "Brodet / brudet", kind: "prato", definition: "Ensopado de vários peixes e mariscos, com cebola, vinagre e tomate; servido com polenta." },
  { term: "Pašticada", kind: "prato", definition: "O prato régio dálmata: carne marinada até 24h em vinho tinto, ameixas e especiarias, servida com nhoque." },
  { term: "Crni rižot", kind: "prato", definition: "Risoto negro de lula/choco com tinta de sépia, alho e vinho — salino e marcante." },
  { term: "Buzara", kind: "tecnica", definition: "Método de cozinhar scampi/mariscos em vinho branco, alho, salsa e farinha de rosca." },
  { term: "Blitva", kind: "prato", definition: "Acelga com batata, alho e azeite — o acompanhamento onipresente da costa." },
  { term: "Gregada", kind: "prato", definition: "Ensopado de peixe branco (típico de Hvar) com batata, alho, azeite e vinho branco." },
  { term: "Konoba", kind: "lugar", definition: "A taverna familiar tradicional — o coração da cozinha dálmata autêntica." },
  { term: "Pršut", kind: "ingrediente", definition: "Presunto cru dálmata, curado ao vento (bura) e fatiado fino. DOP “Dalmatinski pršut”." },
  { term: "Paški sir", kind: "ingrediente", definition: "Queijo de ovelha da ilha de Pag (DOP): duro, salgado e cristalino, com notas de butterscotch." },
  { term: "Kamenice", kind: "ingrediente", definition: "Ostras — as de Ston/Mali Ston são lendárias, comidas frescas com limão." },
  { term: "Salata od hobotnice", kind: "prato", definition: "Salada de polvo cozido com cebola, alcaparras, azeitonas, salsa, azeite e limão." },
  { term: "Soparnik", kind: "prato", definition: "Torta fina de acelga e cebola da região de Poljica, assada sobre brasas — patrimônio croata." },
  { term: "Fritule & kroštule", kind: "prato", definition: "Bolinhos fritos com cítrico, passas e rakija (fritule); massa frita em fita (kroštule)." },
  { term: "Rožata", kind: "prato", definition: "O pudim de caramelo de Dubrovnik, aromatizado com licor de rosas (rozalin)." },
  { term: "Marenda", kind: "lugar", definition: "A refeição/lanche dálmata do meio da manhã — uma instituição local." },
];

/**
 * Compras de distinção — o que comprar de típico (guia QIMO, slides 45–46).
 */
export const shopping: ShoppingItem[] = [
  { name: "Lavanda de Hvar", category: "Aroma · Hvar", badge: "Produto da ilha", description: "Óleos, sachês, sabonetes, cremes e mel de lavanda. Coração: Velo Grablje, Brusje e Selca. Floração de pico em jun/jul. Procure o selo “Hrvatski otočni proizvod”." },
  { name: "Vinhos & rakija", category: "Vinho", badge: "Direto da adega", description: "Dingač, Postup, Pošip e Grk comprados direto nas vinícolas (melhor procedência e safras limitadas). Loza, travarica e o Maraschino de Zadar." },
  { name: "Azeite extra-virgem", category: "Azeite", badge: "DOP", description: "Brač (“Bračko” DOP, marca Brachia em garrafa de cerâmica) e Korčula (marca Marco Polo). Busque DOP, casta nativa (Oblica) e data de colheita recente." },
  { name: "Sal de Ston", category: "Sal", badge: "4.000 anos", description: "A Solana Ston é a salina mais antiga da Europa em atividade. Compre o fleur de sel na própria salina — souvenir gastronômico perfeito e sem restrição." },
  { name: "Maraschino (Zadar)", category: "Destilado", badge: "Desde 1759", description: "O licor de cereja marasca, ícone histórico da Dalmácia. Garrafa elegante, ótima para presentear e para coquetéis clássicos em casa." },
  { name: "Coral & filigrana de prata", category: "Joias", badge: "Artesanal", description: "Coral vermelho do Adriático (tradição de Zlarin) e filigrana de Konavle/Dubrovnik. Em Korčula, a Coral Shop Irena (3ª geração). Selo “Authentically Croatian”." },
  { name: "Renda de bilros", category: "Renda", badge: "UNESCO", description: "A čipka de Pag e a renda de ágave das beneditinas de Hvar são Patrimônio Imaterial da UNESCO. Compre direto das rendeiras e conventos." },
  { name: "Paški sir (queijo de Pag)", category: "Queijo", badge: "Ver alfândega", description: "Queijo de ovelha DOP premiado (Gligora, Paška Sirana). Iguaria de presente — atenção: laticínios têm restrição de entrada no Brasil." },
  { name: "Pršut dálmata", category: "Charcutaria", badge: "Ver alfândega", description: "Presunto curado DOP, soberbo. Restrição: carnes não entram no Brasil sem autorização prévia — melhor saborear in loco." },
  { name: "Mel, figo & alfarroba", category: "Doces", description: "Mel de lavanda/sálvia de Hvar, figos secos, produtos de alfarroba e amêndoa, e o biscoito paprenjok. (Mel também tem restrição alfandegária.)" },
  { name: "Cosméticos & cerâmica", category: "Cerâmica", description: "Sabonetes e cosméticos de lavanda e oliva, cerâmica e artesanato local — lembranças “seguras”, sem restrição alfandegária." },
];
