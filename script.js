const musicList = document.getElementById('music-list');
const search = document.getElementById('search');

let songs = [];

// Carregar catálogo JSON
fetch('catalogo-thomaz-oke.json')

  .then(response => response.json())

  .then(data => {

    songs = data;

    // Exibir primeiras músicas
    renderSongs(songs.slice(0, 100));

  })

  .catch(error => {

    console.error('Erro ao carregar catálogo:', error);

    musicList.innerHTML = `
      <div style="
        text-align:center;
        padding:40px;
        color:red;
        font-size:20px;
      ">
        Erro ao carregar catálogo.
      </div>
    `;

  });


// Renderizar músicas
function renderSongs(list){

  musicList.innerHTML = '';

  // Nenhum resultado
  if(list.length === 0){

    musicList.innerHTML = `
      <div style="
        text-align:center;
        padding:40px;
        opacity:.7;
        font-size:20px;
      ">
        Nenhuma música encontrada.
      </div>
    `;

    return;
  }

  list.forEach(song => {

    const codigo = song.codigo || '---';

    const artista = song.artista || 'Artista desconhecido';

    const musica = song.musica || 'Música sem nome';

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

      </div>

    `;

  });

}


// Busca inteligente
search.addEventListener('keyup', () => {

  const term = search.value.toLowerCase().trim();

  // Se vazio
  if(term === ''){

    renderSongs(songs.slice(0, 100));

    return;
  }

  const filtered = songs.filter(song => {

    const musica = String(song.musica || '')
      .toLowerCase();

    const artista = String(song.artista || '')
      .toLowerCase();

    const codigo = String(song.codigo || '');

    return (

      musica.includes(term) ||

      artista.includes(term) ||

      codigo.includes(term)

    );

  });

  // Limitar resultados
  renderSongs(filtered.slice(0, 100));

});
