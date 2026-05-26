
const songs = [
{
codigo:'67923',
artista:'112',
musica:'Dance With Me'
},
{
codigo:'13538',
artista:'Alcione',
musica:'Sinuca de Bico'
},
{
codigo:'6549',
artista:'365',
musica:'São Paulo'
}
];

const musicList = document.getElementById('music-list');
const search = document.getElementById('search');

function renderSongs(list){
musicList.innerHTML='';

list.forEach(song=>{
musicList.innerHTML += `
<div class="card">
<div class="code">${song.codigo}</div>
<h2>${song.musica}</h2>
<div class="artist">${song.artista}</div>
</div>
`;
});
}

search.addEventListener('keyup', ()=>{
const term = search.value.toLowerCase();

const filtered = songs.filter(song=>
song.musica.toLowerCase().includes(term) ||
song.artista.toLowerCase().includes(term) ||
song.codigo.includes(term)
);

renderSongs(filtered);
});

renderSongs(songs);
