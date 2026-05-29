const musicList = document.getElementById('music-list');
const search = document.getElementById('search');

let songs = [];
let filteredSongs = [];

let currentIndex = 0;
const limit = 50;


// CARREGAR CATÁLOGO
fetch('catalogo-thomaz-oke.json')

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




// RENDERIZAR MÚSICAS
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




// CARREGAR MAIS MÚSICAS
function loadMoreSongs(){

  const nextSongs = filteredSongs.slice(

    currentIndex,

    currentIndex + limit

  );

  renderSongs(nextSongs);

  currentIndex += limit;

}




// SCROLL INFINITO
window.addEventListener('scroll', () => {

  const {

    scrollTop,

    scrollHeight,

    clientHeight

  } = document.documentElement;

  if(

    scrollTop + clientHeight >= scrollHeight - 100

  ){

    loadMoreSongs();

  }

});




// BUSCA
search.addEventListener('keyup', () => {

  const term = search.value

    .toLowerCase()

    .trim();

  currentIndex = 0;

  musicList.innerHTML = '';

  if(term === ''){

    filteredSongs = songs;

    loadMoreSongs();

    return;

  }

  filteredSongs = songs.filter(song => {

    const musica = String(

      song.musica || ''

    ).toLowerCase();

    const artista = String(

      song.artista || ''

    ).toLowerCase();

    const codigo = String(

      song.codigo || ''

    );

    return (

      musica.includes(term) ||

      artista.includes(term) ||

      codigo.includes(term)

    );

  });

  loadMoreSongs();

});
function toggleFavorite(codigo, musica, artista){

  let favorites = JSON.parse(
    localStorage.getItem('favorites')
  ) || [];

  const exists = favorites.find(
    item => item.codigo === codigo
  );

  if(exists){

    favorites = favorites.filter(
      item => item.codigo !== codigo
    );

    alert('❌ Removida das favoritas');

  }else{

    favorites.push({
      codigo,
      musica,
      artista
    });

    alert('❤️ Música adicionada às favoritas');

  }

  localStorage.setItem(
    'favorites',
    JSON.stringify(favorites)
  );

}
