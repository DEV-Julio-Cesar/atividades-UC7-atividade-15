// ===================================================
//  dragonball.js — Lógica da aba Dragon Ball API
// ===================================================

let dbLinks = {}

// ===== ALTERNA FILTROS CONFORME SEÇÃO =====
function trocarSecaoDB() {
  const isChar = document.getElementById('db-secao').value === 'characters'
  document.getElementById('db-filtro-raca').classList.toggle('hidden', !isChar)
  document.getElementById('db-filtro-afiliacao').classList.toggle('hidden', !isChar)
  document.getElementById('db-filtro-destruido').classList.toggle('hidden', isChar)
  document.getElementById('db-grid').innerHTML        = ''
  document.getElementById('paginacao-db').innerHTML   = ''
  document.getElementById('db-contador').textContent  = ''
}

// ===== BUSCA DB (async/await) =====
async function buscarDB(pagina = 1, urlDireta = null) {
  const secao = document.getElementById('db-secao').value
  const grid  = document.getElementById('db-grid')
  grid.innerHTML = ''
  document.getElementById('db-erro').textContent    = ''
  document.getElementById('db-contador').textContent = 'Buscando...'

  // Monta URL com filtros ou usa link direto da paginação
  let url = urlDireta || `${DB_URL}/${secao}?page=${pagina}&limit=12`

  if (!urlDireta) {
    if (secao === 'characters') {
      const raca = document.getElementById('db-raca').value
      const afil = document.getElementById('db-afiliacao').value
      // Filtros não têm paginação conforme documentação
      if (raca || afil) {
        url = `${DB_URL}/characters?`
        if (raca) url += `race=${encodeURIComponent(raca)}&`
        if (afil) url += `affiliation=${encodeURIComponent(afil)}`
      }
    } else {
      const dest = document.getElementById('db-destruido').value
      if (dest !== '') url = `${DB_URL}/planets?isDestroyed=${dest}`
    }
  }

  try {
    const resposta = await fetch(url)
    const dados    = await resposta.json()
    console.log(JSON.stringify(dados))

    const itens  = Array.isArray(dados) ? dados : dados.items
    const meta   = dados.meta  || null
    dbLinks      = dados.links || {}

    if (!itens || itens.length === 0) {
      document.getElementById('db-erro').textContent    = 'Nenhum resultado encontrado.'
      document.getElementById('db-contador').textContent = ''
      return
    }

    const total  = meta ? meta.totalItems   : itens.length
    const pAtual = meta ? meta.currentPage  : 1
    const pTotal = meta ? meta.totalPages   : 1

    document.getElementById('db-contador').textContent =
      `${total} resultado(s)${meta ? ` — página ${pAtual} de ${pTotal}` : ''}`

    itens.forEach((item, i) => {
      const card = secao === 'characters'
        ? criarCardPersonagem(item, i)
        : criarCardPlaneta(item, i)
      grid.appendChild(card)
    })

    if (meta && meta.totalPages > 1) renderPaginacaoDB(meta, dbLinks)

  } catch (erro) {
    document.getElementById('db-erro').textContent = `Erro: ${erro.message}`
    console.log(`Erro DB: ${erro}`)
  }
}

// ===== CARD PERSONAGEM =====
function criarCardPersonagem(p, i) {
  const card = document.createElement('div')
  card.classList.add('card-db')
  card.style.animationDelay = `${i * 0.04}s`

  const img = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
    : `<div class="sem-poster">👤</div>`

  card.innerHTML = `
    ${img}
    <div class="card-info">
      <div class="card-titulo">${p.name}</div>
      <div class="card-sub">${tr(RACA_PT, p.race)} — ${tr(GENERO_PT, p.gender)}</div>
      <div class="card-badge">⚡ Ki: ${p.ki}</div>
    </div>
  `
  card.addEventListener('click', () => buscarDetalhesDB('characters', p.id))
  return card
}

// ===== CARD PLANETA =====
function criarCardPlaneta(p, i) {
  const card = document.createElement('div')
  card.classList.add('card-db')
  card.style.animationDelay = `${i * 0.04}s`

  const img = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
    : `<div class="sem-poster">🌍</div>`

  const status = p.isDestroyed
    ? `<span style="color:#e50914">💥 Destruído</span>`
    : `<span style="color:#2ecc71">✅ Existente</span>`

  card.innerHTML = `
    ${img}
    <div class="card-info">
      <div class="card-titulo">${p.name}</div>
      <div class="card-sub">${status}</div>
    </div>
  `
  card.addEventListener('click', () => buscarDetalhesDB('planets', p.id))
  return card
}

// ===== DETALHES DB — .then() / .catch() =====
function buscarDetalhesDB(secao, id) {
  fetch(`${DB_URL}/${secao}/${id}`)
    .then(r => r.json())
    .then(async d => {
      console.log(JSON.stringify(d))
      if (secao === 'characters') await mostrarModalPersonagem(d)
      else await mostrarModalPlaneta(d)
    })
    .catch(e => console.log(`Erro detalhes DB: ${e}`))
}

// ===== MODAL PERSONAGEM =====
async function mostrarModalPersonagem(d) {
  const descricao = await traduzir(d.description, 'es')

  const transfs = d.transformations && d.transformations.length > 0
    ? `<div class="transformacoes">
        ${d.transformations.map(t =>
          `<div class="transf-item">
            <img src="${t.image}" alt="${t.name}" />
            ${t.name}
          </div>`
        ).join('')}
       </div>`
    : ''

  abrirModal(`
    <img src="${d.image}" alt="${d.name}" />
    <div class="modal-body">
      <h2>${d.name}</h2>
      <p>
        <span class="tag">${tr(RACA_PT, d.race)}</span>
        <span class="tag">${tr(GENERO_PT, d.gender)}</span>
        <span class="tag">${tr(AFIL_PT, d.affiliation)}</span>
      </p>
      <p><span class="destaque">⚡ Ki:</span> ${d.ki} / Máx: ${d.maxKi}</p>
      <p>${descricao}</p>
      ${d.originPlanet ? `<p><strong>Planeta de origem:</strong> ${d.originPlanet.name}</p>` : ''}
      ${transfs ? `<p><strong>Transformações:</strong></p>${transfs}` : ''}
    </div>
  `)
}

// ===== MODAL PLANETA =====
async function mostrarModalPlaneta(d) {
  const descricao = await traduzir(d.description, 'es')

  const status = d.isDestroyed
    ? `<span style="color:#e50914">💥 Destruído</span>`
    : `<span style="color:#2ecc71">✅ Existente</span>`

  const personagens = d.characters && d.characters.length > 0
    ? d.characters.map(c => `<span class="tag">${c.name}</span>`).join('')
    : 'Nenhum personagem associado'

  abrirModal(`
    <img src="${d.image}" alt="${d.name}" />
    <div class="modal-body">
      <h2>${d.name}</h2>
      <p>${status}</p>
      <p>${descricao}</p>
      <p><strong>Personagens:</strong></p>
      <p>${personagens}</p>
    </div>
  `)
}

// Carrega personagens ao iniciar
buscarDB(1)
