import type { WineRegion } from "./types";

/**
 * Guia de Vinhos — as quatro regiões da rota e suas vinícolas (guia QIMO).
 */
export const wineRegions: WineRegion[] = [
  {
    slug: "peljesac",
    name: "Pelješac",
    island: false,
    coordinates: { lat: 42.9, lng: 17.4 },
    image: { src: "/images/wine-peljesac.svg", alt: "Vinhedos íngremes de Dingač, Pelješac" },
    history:
      "O coração tinto da Croácia. Em encostas marítimas de até 45° — a chamada “viticultura heroica”, colhida à mão — o Plavac Mali atinge sua expressão máxima, com as denominações protegidas Dingač (a mais antiga do país, 1961) e Postup.",
    grapes: ["Plavac Mali", "Dingač", "Postup"],
    wineries: [
      { name: "Grgić Vina (Trstenik)", region: "Pelješac", badge: "Por barco", description: "Fundada em 1996 por Miljenko “Mike” Grgich, vencedor do Julgamento de Paris (1976). Só nativas: Pošip e Plavac Mali de Dingač. Adega com vista sobre o porto. grgic-vina.com" },
      { name: "Korta Katarina (Orebić)", region: "Pelješac", badge: "Relais & Châteaux", description: "A vinícola mais luxuosa da rota. Plavac Mali, Pošip e rosé de Dingač/Postup. Degustações com reserva, harmonização e terraço à beira-mar. Acomoda chegada de iate. Ultra-premium." },
      { name: "Saints Hills", region: "Pelješac", badge: "Michel Rolland", description: "Projeto da família Tolj com consultoria do enólogo Michel Rolland. Dingač “Sv. Lucia”, Plavac “Black”, brancos Nevina. Restaurante de alta gastronomia. Tours 13h/15h/19h, com reserva." },
      { name: "Miloš / Stagnum (Ponikve)", region: "Pelješac", badge: "Ícone cult", description: "Família há 500+ anos. O “Stagnum” é tido como o primeiro vinho cult croata. Plavac orgânico de encostas de 45°, longa guarda. Tasting junto à cave, perto de Ston. milos.hr" },
      { name: "Matuško (Potomje)", region: "Pelješac", description: "A maior cave subterrânea da península; Dingač encorpado de fruta escura e especiarias. Tour de cave + degustação em ambiente rústico. Parada clássica e acessível." },
      { name: "Bartulović (Prizdrina)", region: "Pelješac", badge: "Autêntica", description: "Pequena vinícola familiar; uma das poucas com direito à denominação Dingač. Degustação íntima sob a casa do produtor, com anfitrião caloroso." },
    ],
    experiences: [
      "Degustação privativa de Dingač e Postup com vista sobre as encostas marítimas",
      "Ostras de Mali Ston e fleur de sal harmonizadas com Plavac de Pelješac",
    ],
  },
  {
    slug: "korcula",
    name: "Korčula & Lumbarda",
    island: true,
    coordinates: { lat: 42.95, lng: 17.05 },
    image: { src: "/images/wine-korcula.svg", alt: "Vinhedos de areia em Lumbarda, Korčula" },
    history:
      "O reino dos brancos. O celebrado Pošip (Čara/Smokvica) foi a 1ª casta branca croata com denominação (1967); e o raríssimo Grk de Lumbarda — videira de flores apenas femininas — cresce na areia, precisando do Plavac por perto para polinizar.",
    grapes: ["Pošip", "Grk", "Plavac Mali"],
    wineries: [
      { name: "Bire (Franko Milina-Bire)", region: "Lumbarda", badge: "Orgânica", description: "Primeira vinícola orgânica de Korčula, tradição bimilenar. Excelente Grk, rosé e Plavac Mali, entre limoeiros, em propriedade mediterrânea autêntica. Só dinheiro. bire.hr" },
      { name: "Zure (Bartul Batistić-Zure)", region: "Lumbarda", description: "Familiar, os maiores vinhedos da ilha; Grk (inclusive prošek e espumante), Pošip e o melhor Plavac Mali de Korčula. Tem restaurante (terraço de vinhas) e hospedagem. zure.hr" },
      { name: "Popić (Zoran Cebalo-Popić)", region: "Lumbarda", description: "Vinícola familiar em Mala Postrana; degustação muito elogiada de Grk e Pošip, calorosa e próxima dos produtores." },
      { name: "PZ Čara & Toreta", region: "Čara · Smokvica", badge: "Berço do Pošip", description: "No planalto de Čara/Smokvica, berço do Pošip. PZ Čara (cooperativa) e Toreta (com museu do vinho). Ideal para conhecer o Pošip na origem." },
    ],
    experiences: [
      "Prova de Grk nas vinhas de areia de Lumbarda",
      "Vertical de Pošip na origem (Čara/Smokvica), com tapas e joias de coral na Old Town",
    ],
  },
  {
    slug: "hvar",
    name: "Hvar",
    island: true,
    coordinates: { lat: 43.13, lng: 16.75 },
    image: { src: "/images/wine-hvar.svg", alt: "Planície vinícola de Stari Grad, Hvar" },
    history:
      "Vinho e lavanda. A planície de Stari Grad (UNESCO) é cultivada desde os colonos gregos; aqui floresce a Bogdanuša, casta branca autóctone (“dádiva de Deus”). As encostas marítimas de Sveta Nedjelja dão o único Grand Cru do país.",
    grapes: ["Plavac Mali", "Bogdanuša", "Pošip"],
    wineries: [
      { name: "Tomić / Bastijana (Jelsa)", region: "Hvar", badge: "Cênica", description: "De Andro Tomić. Sala de degustação “Triklinij” inspirada nas caves do Palácio de Diocleciano. Veliki Plavac Mali, branco Beleca, rosé Opolo e o célebre Prošek. vina-tomic.com" },
      { name: "Zlatan Otok (Sveta Nedjelja)", region: "Hvar", badge: "Grand Cru", description: "Único Grand Cru da Croácia (Zlatan Plavac). Adega subaquática e cave a 70 m de profundidade. Vinhedos marítimos íngremes; a chegada pelo mar é cênica. Premium." },
      { name: "Duboković (Jelsa)", region: "Hvar", badge: "Boutique", description: "Konoba à luz de velas — a degustação mais íntima da ilha. Plavac “Medvid” e “2718” (sol numa garrafa). Azeites aromatizados, souvenir ideal. dubokovic.hr" },
      { name: "Carić (Svirče / Vrboska)", region: "Hvar", description: "Familiar; castas indígenas (Plavac “Plovac Ploški”, Bogdanuša, Pošip). Degustação com harmonização de vinho e chocolate." },
    ],
    experiences: [
      "Triklinij de Tomić, inspirado nas caves de Diocleciano",
      "Bogdanuša gelada ao pôr do sol; campos de lavanda em Velo Grablje",
    ],
  },
  {
    slug: "brac",
    name: "Brač",
    island: true,
    coordinates: { lat: 43.27, lng: 16.65 },
    image: { src: "/images/wine-brac.svg", alt: "Vinhedos de pedra branca de Brač" },
    history:
      "A pedra branca na taça. Na ilha cuja rocha ergueu o Palácio de Diocleciano, o Plavac Mali de altitude dá tintos minerais. A histórica 1ª Cooperativa da Dalmácia (Bol, 1903) é hoje a Stina.",
    grapes: ["Plavac Mali", "Pošip", "Vugava"],
    wineries: [
      { name: "Stina (Bol)", region: "Brač", badge: "Por barco", description: "Na Riva de Bol, na 1ª Cooperativa da Dalmácia (1903). Plavac Mali, Pošip, Crljenak e Vugava; rótulos inspirados na pedra branca de Brač. Atraca à porta. ~€38,50/pessoa. stina-vino.hr" },
      { name: "Senjković", region: "Brač", badge: "Autêntica", description: "Vinícola familiar de Brač, recomendada para uma experiência mais acolhedora e autêntica, fora do circuito turístico." },
    ],
    experiences: [
      "Prova de Plavac na Stina, à beira da Riva de Bol, combinada com a praia Zlatni Rat",
    ],
  },
];

export function getWineRegion(slug: string) {
  return wineRegions.find((r) => r.slug === slug);
}

/** Índice de castas autóctones da Dalmácia (guia QIMO). */
export const grapeVarieties: {
  name: string;
  color: "tinto" | "branco" | "sobremesa";
  note: string;
}[] = [
  { name: "Plavac Mali", color: "tinto", note: "A casta tinta-rainha da Dalmácia: encorpada, taninos firmes, cereja escura, ameixa, figo e especiarias. Filha de Crljenak (Tribidrag) × Dobričić. Servir a 17–19°C." },
  { name: "Dingač", color: "tinto", note: "A denominação protegida mais antiga da Croácia (Pelješac); Plavac de encostas marítimas de até 45°. Amora, figo, tabaco, final longo. Coroa as ostras de Ston." },
  { name: "Postup", color: "tinto", note: "Vizinha do Dingač, igualmente potente e estruturada; harmoniza muito bem com peixe branco e brodet." },
  { name: "Pošip", color: "branco", note: "O branco indígena mais celebrado (Korčula): encorpado, dourado, damasco seco, figo e cítrico. 1ª casta branca croata com denominação (1967). Servir a 10–12°C." },
  { name: "Grk", color: "branco", note: "Raríssimo, só na areia de Lumbarda; a videira tem apenas flores femininas (precisa do Plavac para polinizar). Seco, com final amargo elegante (grk = “amargo”)." },
  { name: "Bogdanuša", color: "branco", note: "De Hvar (“dádiva de Deus”): leve, fresco, floral e cítrico, de baixo álcool. Da planície de Stari Grad, Patrimônio UNESCO." },
  { name: "Vugava", color: "branco", note: "De Vis: aromático e encorpado, com damasco maduro, cítrico e toque de abacaxi; ~14%. Ligado à antiga colônia grega de Issa." },
  { name: "Maraština / Rukatac", color: "branco", note: "Branco dálmata difundido na costa; frutado (damasco, pêssego, marmelo), encorpado e de baixa acidez. Também base de prošek." },
  { name: "Debit", color: "branco", note: "Norte da Dalmácia; fresco, cítrico, de baixo álcool — ótimo com ostras. Frequentemente em blend com a Maraština." },
  { name: "Tribidrag (Crljenak)", color: "tinto", note: "Provado por DNA (UC Davis, 2001) como o Zinfandel = Primitivo. Nome em registro de 1444; achado entre apenas 9 videiras em Kaštel Novi. Pai do Plavac Mali." },
  { name: "Prošek", color: "sobremesa", note: "Vinho doce de uvas passas (método passito), 15–18%, estilo Porto / Vin Santo. Sem relação com o Prosecco italiano. Protegido pela UE." },
];
