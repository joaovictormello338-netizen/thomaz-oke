const musicList = document.getElementById('music-list');
const search = document.getElementById('search');

let songs = [];

// Carrega o catálogo JSON
fetch('catalogo-thomaz-oke.json')
  .then(response => response.json())
  .then(data => {

    songs = data;

    // Mostra as primeiras 100 músicas
    renderSongs(songs.slice(0, 100));

  })
  .catch(error => {

    console.error('Erro ao carregar catálogo:', error);

    musicList.innerHTML = `
      <div style="
        color:red;
        text-align:center;
        padding:30px;
        font-size:20px;
      ">
        Erro ao carregar catálogo.
      </div>
    `;
  });

// Renderizar músicas
function renderSongs(list){

  musicList.innerHTML = '';

  if(list.length === 0){

    musicList.innerHTML = `
      <div style="
        text-align:center;
        padding:30px;
        opacity:.7;
      ">
        Nenhuma música encontrada.
      </div>
    `;

    return;
  }

  list.forEach(song => {

    musicList.innerHTML += `

      <div class="card">

        <div class="code">
          ${song.codigo}
        </div>

        <h2>
          ${song.musica}
        </h2>

        <div class="artist">
          ${song.artista}
        </div>

      </div>

    `;
  });

}

// Busca inteligente
search.addEventListener('keyup', () => {

  const term = search.value.toLowerCase();

  const filtered = songs.filter(song =>

    song.musica.toLowerCase().includes(term) ||

    song.artista.toLowerCase().includes(term) ||

    song.codigo.includes(term)

  );

  // Limita em 100 resultados
  renderSongs(filtered.slice(0, 100));

});
