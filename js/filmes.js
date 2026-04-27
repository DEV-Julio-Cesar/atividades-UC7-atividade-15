// ===================================================
//  filmes.js — Lógica da aba Filmes (OMDB API)
// ===================================================

let paginaFilmes = 1
let totalFilmes  = 1

// ===== BUSCA POR TÍTULO (parâmetro s=) — async/await =====
async function buscarFilmes(pagina = 1) {
  const termo = document.getElementById('busca').value.trim()
  const tipo  = document.getElementById('tipo').value
  const ano   = document.getElementById('ano').value

  if (!termo) {
    document.getElementById('erro').textContent = 'Digite um título.'
    return
  }

  paginaFilmes = pagina

  const grid = document.getElementById('filmes-grid')
  grid.innerHTML = ''
  document.getElementById('erro').textContent    = ''
  document.getElementById('contador').textContent = 'Buscando...'

  const btn = document.getElementById('btn-buscar')
  btn.disabled = true
  btn.textContent = '...'

  // Traduz o termo PT → EN antes de enviar para a OMDB
  const termoEN = await traduzirParaEN(termo)
  console.log(`Termo: "${termo}" → EN: "${termoEN}"`)

  // Monta URL com parâmetros da documentação OMDB
  let url = `${OMDB_URL}&s=${encodeURIComponent(termoEN)}&r=json&page=${pagina}`
  if (tipo) url += `&type=${tipo}`
  if (ano)  url += `&y=${ano}`

  try {
    const resposta = await fetch(url)
    const dados    = await resposta.json()
    console.log(JSON.stringify(dados))

    if (dados.Response === 'False') {
      document.getElementById('erro').textContent    = dados.Error
      document.getElementById('contador').textContent = ''
      renderPaginacaoFilmes(0, 1, 1)
      return
    }

    const total = parseInt(dados.totalResults)
    totalFilmes = Math.ceil(total / 10)

    document.getElementById('contador').textContent =
      `${total} resultado(s) — página ${pagina} de ${totalFilmes}`

    dados.Search.forEach((f, i) => grid.appendChild(criarCardFilme(f, i)))
    renderPaginacaoFilmes(total, paginaFilmes, totalFilmes)

  } catch (erro) {
    document.getElementById('erro').textContent = `Erro: ${erro.message}`
  } finally {
    btn.disabled    = false
    btn.textContent = '🔍 Buscar'
  }
}

// ===== CARD FILME =====
function criarCardFilme(filme, i) {
  const card = document.createElement('div')
  card.classList.add('card-filme')
  card.style.animationDelay = `${i * 0.04}s`

  const poster = filme.Poster && filme.Poster !== 'N/A'
    ? `<img src="${filme.Poster}" alt="${filme.Title}" loading="lazy" />`
    : `<div class="sem-poster">🎬</div>`

  card.innerHTML = `
    ${poster}
    <div class="card-info">
      <div class="card-titulo" title="${filme.Title}">${filme.Title}</div>
      <div class="card-sub">${filme.Year}</div>
      <div class="card-badge">${tr(TIPO_PT, filme.Type)}</div>
    </div>
  `

  // Clique busca detalhes pelo imdbID (parâmetro i=) usando .then()/.catch()
  card.addEventListener('click', () => buscarDetalhesFilme(filme.imdbID))
  return card
}

// ===== DETALHES FILME (parâmetro i=) — .then() / .catch() =====
function buscarDetalhesFilme(imdbID) {
  const enredo = document.getElementById('enredo').value

  fetch(`${OMDB_URL}&i=${imdbID}&plot=${enredo}&r=json`)
    .then(r => r.json())
    .then(async d => {
      console.log(JSON.stringify(d))

      // Traduz o enredo EN → PT
      const enredoPT = await traduzir(d.Plot, 'en')

      const poster = d.Poster && d.Poster !== 'N/A'
        ? `<img src="${d.Poster}" alt="${d.Title}" />`
        : `<div class="sem-poster" style="width:130px;height:195px;border-radius:8px">🎬</div>`

      abrirModal(`
        ${poster}
        <div class="modal-body">
          <h2>${d.Title} (${d.Year})</h2>
          <p><span class="destaque">⭐ ${d.imdbRating}</span> — ${d.Genre}</p>
          <p><strong>Diretor:</strong> ${d.Director}</p>
          <p><strong>Elenco:</strong> ${d.Actors}</p>
          <p><strong>Duração:</strong> ${d.Runtime}</p>
          <p><strong>País:</strong> ${d.Country}</p>
          <p><strong>Prêmios:</strong> ${d.Awards}</p>
          <p style="margin-top:0.5rem">${enredoPT}</p>
        </div>
      `)
    })
    .catch(e => console.log(`Erro detalhes filme: ${e}`))
}

// Enter no campo de busca
document.getElementById('busca').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarFilmes(1)
})
