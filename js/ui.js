// ===================================================
//  ui.js — Funções de interface (modal, paginação, abas)
// ===================================================

// ===== MODAL =====
function abrirModal(html) {
  document.getElementById('modal-corpo').innerHTML = html
  document.getElementById('modal-overlay').classList.remove('hidden')
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.add('hidden')
}

document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal)

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) fecharModal()
})

// ===== ABAS =====
function trocarAba(aba) {
  document.getElementById('aba-filmes').classList.toggle('hidden', aba !== 'filmes')
  document.getElementById('aba-dragonball').classList.toggle('hidden', aba !== 'dragonball')
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('ativa',
      (i === 0 && aba === 'filmes') || (i === 1 && aba === 'dragonball')
    )
  })
}

// ===== PAGINAÇÃO =====
function criarBtnPag(label, fn) {
  const b = document.createElement('button')
  b.classList.add('btn-pag')
  b.textContent = label
  b.addEventListener('click', fn)
  return b
}

function renderPaginacaoFilmes(total, paginaAtual, totalPaginas) {
  const pag = document.getElementById('paginacao-filmes')
  pag.innerHTML = ''
  if (total <= 10) return

  if (paginaAtual > 1)
    pag.appendChild(criarBtnPag('‹ Anterior', () => buscarFilmes(paginaAtual - 1)))

  const ini = Math.max(1, paginaAtual - 2)
  const fim = Math.min(totalPaginas, paginaAtual + 2)
  for (let p = ini; p <= fim; p++) {
    const b = criarBtnPag(p, () => buscarFilmes(p))
    if (p === paginaAtual) b.classList.add('ativa')
    pag.appendChild(b)
  }

  if (paginaAtual < totalPaginas)
    pag.appendChild(criarBtnPag('Próximo ›', () => buscarFilmes(paginaAtual + 1)))
}

function renderPaginacaoDB(meta, links) {
  const pag = document.getElementById('paginacao-db')
  pag.innerHTML = ''

  if (links.first)    pag.appendChild(criarBtnPag('« Primeiro', () => buscarDB(1, links.first)))
  if (links.previous) pag.appendChild(criarBtnPag('‹ Anterior', () => buscarDB(1, links.previous)))

  const ini = Math.max(1, meta.currentPage - 2)
  const fim = Math.min(meta.totalPages, meta.currentPage + 2)
  for (let p = ini; p <= fim; p++) {
    const b = criarBtnPag(p, () => buscarDB(p))
    if (p === meta.currentPage) b.classList.add('ativa')
    pag.appendChild(b)
  }

  if (links.next) pag.appendChild(criarBtnPag('Próximo ›', () => buscarDB(1, links.next)))
  if (links.last) pag.appendChild(criarBtnPag('Último »',  () => buscarDB(1, links.last)))
}
