// ===================================================
//  config.js — Configurações e constantes globais
// ===================================================

const API_KEY  = 'cd9e2b29'
const OMDB_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`
const DB_URL   = 'https://dragonball-api.com/api'

// Tipos de mídia OMDB → PT
const TIPO_PT = {
  movie: 'Filme', series: 'Série', episode: 'Episódio', game: 'Jogo'
}

// Raças Dragon Ball → PT
const RACA_PT = {
  'Saiyan': 'Saiyajin', 'Human': 'Humano', 'Namekian': 'Namekuseijin',
  'Majin': 'Majin', 'Frieza Race': 'Raça de Freeza', 'Android': 'Androide',
  'Jiren Race': 'Raça de Jiren', 'God': 'Deus', 'Angel': 'Anjo',
  'Evil': 'Maligno', 'Unknown': 'Desconhecido'
}

// Gênero Dragon Ball → PT
const GENERO_PT = {
  'Male': 'Masculino', 'Female': 'Feminino', 'Unknown': 'Desconhecido'
}

// Afiliação Dragon Ball → PT
const AFIL_PT = {
  'Z Fighter': 'Guerreiro Z', 'Red Ribbon Army': 'Exército Fita Vermelha',
  'Namekian Warrior': 'Guerreiro Namekuseijin', 'Freelancer': 'Independente',
  'Army of Frieza': 'Exército de Freeza', 'Pride Troopers': 'Soldados do Orgulho',
  'Assistant of Vermoud': 'Assistente de Vermoud', 'God': 'Deus',
  'Assistant of Beerus': 'Assistente de Beerus', 'Villain': 'Vilão', 'Other': 'Outro'
}

// Dicionário de títulos famosos PT → EN
const TITULOS_EN = {
  'o senhor dos anéis': 'the lord of the rings',
  'senhor dos anéis': 'lord of the rings',
  'a sociedade do anel': 'the fellowship of the ring',
  'as duas torres': 'the two towers',
  'o retorno do rei': 'the return of the king',
  'guerra nas estrelas': 'star wars',
  'vingadores': 'avengers',
  'homem de ferro': 'iron man',
  'homem aranha': 'spider-man',
  'homem-aranha': 'spider-man',
  'capitão américa': 'captain america',
  'pantera negra': 'black panther',
  'doutor estranho': 'doctor strange',
  'guardiões da galáxia': 'guardians of the galaxy',
  'velozes e furiosos': 'fast and furious',
  'missão impossível': 'mission impossible',
  'de volta para o futuro': 'back to the future',
  'o poderoso chefão': 'the godfather',
  'clube da luta': 'fight club',
  'interestelar': 'interstellar',
  'a origem': 'inception',
  'coringa': 'joker',
  'divertida mente': 'inside out',
  'procurando nemo': 'finding nemo',
  'o rei leão': 'the lion king',
  'a bela e a fera': 'beauty and the beast',
  'exterminador do futuro': 'terminator',
  'parque dos dinossauros': 'jurassic park',
  'duna': 'dune',
  'avatar': 'avatar',
}

// Retorna tradução do dicionário ou o valor original
function tr(dicionario, valor) {
  return dicionario[valor] || valor
}
