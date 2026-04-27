// ===================================================
//  traducao.js — Funções de tradução via Google Translate
// ===================================================

// Traduz qualquer texto para PT (usado nas descrições ES/EN → PT)
async function traduzir(texto, de = 'es') {
  if (!texto || texto === 'N/A') return texto
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${de}&tl=pt&dt=t&q=${encodeURIComponent(texto)}`
    const res  = await fetch(url)
    const json = await res.json()
    return json[0].map(f => f[0]).join('')
  } catch {
    return texto
  }
}

// Traduz o termo de busca PT → EN para enviar à OMDB
async function traduzirParaEN(termo) {
  const chave = termo.toLowerCase().trim()

  // 1 — dicionário local (títulos famosos)
  if (TITULOS_EN[chave]) return TITULOS_EN[chave]

  // 2 — Google Translate com sl=pt forçado
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=${encodeURIComponent(termo)}`
    const res  = await fetch(url)
    const json = await res.json()
    const traduzido = json[0].map(f => f[0]).join('').trim()
    if (traduzido.toLowerCase() !== chave) return traduzido
  } catch { /* ignora */ }

  // 3 — fallback: retorna o original
  return termo
}
