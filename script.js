const musicList = document.getElementById('music-list');
const search = document.getElementById('search');

let songs = [];
let filteredSongs = [];

let currentIndex = 0;
const limit = 50;

let viewingFavorites = false;


// ==========================================
// CARREGAR CATÁLOGO
// ==========================================

fetch('catalogo-thomaz-oke.json?v=2')

  .then(response => response.json())

  .then(data => {

    songs = data;

    filteredSongs = songs;

    loadMoreSongs();

  })

  .catch(error => {

    console.error(error);

    musicList.innerHTML = `

      <div style="
        text-align:center;
        padding:40px;
        color:#ff4d4d;
        font-size:20px;
      ">

        Erro ao carregar catálogo.

      </div>

    `;

  });


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizeText(text){

  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

}


// ==========================================
// RENDERIZAR MÚSICAS
// ==========================================

function renderSongs(list){

  list.forEach(song => {

    const musica = song.musica || 'Sem música';

    const artista = song.artista || 'Sem artista';

    const codigo = song.codigo || '0000';

    musicList.innerHTML += `

      <div class="card">

        <div class="code">
          ${codigo}
        </div>

        <h2>
          ${musica}
        </h2>

        <div class="artist">
          ${artista}
        </div>

        <button
          class="favorite-btn"
          onclick="toggleFavorite('${codigo}','${musica}','${artista}')"
        >
          ❤️ Favoritar
        </button>

      </div>

    `;

  });

}


// ==========================================
// CARREGAR MAIS MÚSICAS
// ==========================================

function loadMoreSongs(){

  const nextSongs = filteredSongs.slice(
    currentIndex,
    currentIndex + limit
  );

  renderSongs(nextSongs);

  currentIndex += limit;

}


// ==========================================
// SCROLL INFINITO
// ==========================================

window.addEventListener('scroll', () => {

  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  if(
    !viewingFavorites &&
    scrollTop + clientHeight >= scrollHeight - 100 &&
    currentIndex < filteredSongs.length
  ){

    loadMoreSongs();

  }

});


// ==========================================
// BUSCA
// ==========================================

search.addEventListener('keyup', () => {

  const term = normalizeText(
    search.value.trim()
  );


  // REGISTRAR PESQUISA
  if(term.length > 2){

    let ranking = JSON.parse(
      localStorage.getItem('ranking')
    ) || {};

    ranking[term] = (ranking[term] || 0) + 1;

    localStorage.setItem(
      'ranking',
      JSON.stringify(ranking)
    );

  }


  currentIndex = 0;

  musicList.innerHTML = '';


  // SE BUSCA ESTIVER VAZIA
  if(term === ''){

    viewingFavorites = false;

    filteredSongs = songs;

    loadMoreSongs();

    return;

  }


  // FILTRAR MÚSICAS
  filteredSongs = songs.filter(song => {

    const musica = normalizeText(
      song.musica || ''
    );

    const artista = normalizeText(
      song.artista || ''
    );

    const codigo = String(
      song.codigo || ''
    );


    const texto =
      `${musica} ${artista} ${codigo}`;


    // BUSCA NORMAL
    if(texto.includes(term)){
      return true;
    }


    // TOLERÂNCIA PARA "H"
    const textoSemH =
      texto.replace(/h/g, '');

    const termoSemH =
      term.replace(/h/g, '');

    if(textoSemH.includes(termoSemH)){
      return true;
    }


    // TOLERÂNCIA PARA VV
    const textoSemVV =
      texto.replace(/vv/g, 'v');

    const termoSemVV =
      term.replace(/vv/g, 'v');

    if(textoSemVV.includes(termoSemVV)){
      return true;
    }


    return false;

  });


  loadMoreSongs();

});


// ==========================================
// FAVORITAR / DESFAVORITAR
// ==========================================

function toggleFavorite(codigo, musica, artista){

  let favorites = JSON.parse(
    localStorage.getItem('favorites')
  ) || [];


  const exists = favorites.find(
    item => String(item.codigo) === String(codigo)
  );


  // REMOVER DOS FAVORITOS
  if(exists){

    favorites = favorites.filter(
      item => String(item.codigo) !== String(codigo)
    );


    localStorage.setItem(
      'favorites',
      JSON.stringify(favorites)
    );


    alert('❌ Música removida das favoritas');


    // SE ESTIVER NA TELA DE FAVORITOS
    if(viewingFavorites){

      musicList.innerHTML = '';

      renderSongs(favorites);

    }

    return;

  }


  // ADICIONAR AOS FAVORITOS
  favorites.push({

    codigo: String(codigo),

    musica: musica,

    artista: artista

  });


  localStorage.setItem(
    'favorites',
    JSON.stringify(favorites)
  );


  alert('❤️ Música adicionada às favoritas');

}


// ==========================================
// IMPORTANTE PARA O BOTÃO FAVORITAR
// ==========================================

window.toggleFavorite = toggleFavorite;


// ==========================================
// BOTÃO "MINHAS MÚSICAS FAVORITAS"
// ==========================================

const showFavoritesBtn =
  document.getElementById('showFavorites');


if(showFavoritesBtn){

  showFavoritesBtn.addEventListener('click', () => {

    viewingFavorites = true;

    const favorites = JSON.parse(
      localStorage.getItem('favorites')
    ) || [];


    musicList.innerHTML = '';

    currentIndex = 0;


    if(favorites.length === 0){

      musicList.innerHTML = `

        <div style="
          text-align:center;
          padding:40px;
          color:white;
          font-size:20px;
        ">

          ❤️ Nenhuma música favoritada ainda.

        </div>

      `;

      return;

    }


    renderSongs(favorites);

  });

}


// ==========================================
// BOTÃO "CATÁLOGO ATUALIZADO"
// ==========================================

const showAllBtn =
  document.getElementById('showAll');


if(showAllBtn){

  showAllBtn.addEventListener('click', () => {

    viewingFavorites = false;

    currentIndex = 0;

    filteredSongs = songs;

    musicList.innerHTML = '';

    loadMoreSongs();

  });

}


// ==========================================
// BOTÃO "MAIS PROCURADAS"
// ==========================================

const showRankingBtn =
  document.getElementById('showRanking');


if(showRankingBtn){

  showRankingBtn.addEventListener('click', () => {

    viewingFavorites = true;

    const ranking = JSON.parse(
      localStorage.getItem('ranking')
    ) || {};


    const top = Object.entries(ranking)

      .sort((a, b) => b[1] - a[1])

      .slice(0, 10);


    musicList.innerHTML = '';


    if(top.length === 0){

      musicList.innerHTML = `

        <div class="card">

          <h2>
            🔥 Nenhuma pesquisa ainda
          </h2>

        </div>

      `;

      return;

    }


    top.forEach((item, index) => {

      musicList.innerHTML += `

        <div class="card">

          <div class="code">
            #${index + 1}
          </div>

          <h2>
            ${item[0]}
          </h2>

          <div class="artist">
            🔥 ${item[1]} pesquisas
          </div>

        </div>

      `;

    });

  });

}
