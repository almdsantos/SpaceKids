export const DATA_URL = 'https://yoursite.com/spacekids/data.json';

export const MOCK_DATA = {
  series: [
    {
      id: 's1',
      type: 'series',
      title: 'Galactic Guardians',
      description: 'Um grupo de jovens heróis defende a galáxia de robôs malvados e vilões cósmicos!',
      thumbnail: 'https://picsum.photos/seed/galactic/300/450',
      banner: 'https://picsum.photos/seed/galactic_b/800/400',
      rating: 5,
      seasons: [
        {
          id: 'ss1s1', title: 'Temporada 1',
          episodes: [
            { id: 'e101', title: 'O Início', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e101/200/120' },
            { id: 'e102', title: 'A Invasão dos Robôs', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e102/200/120' },
            { id: 'e103', title: 'A Batalha Espacial', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e103/200/120' },
          ]
        },
        {
          id: 'ss1s2', title: 'Temporada 2',
          episodes: [
            { id: 'e201', title: 'Novos Mundos', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e201/200/120' },
            { id: 'e202', title: 'Amigos Alienígenas', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e202/200/120' },
          ]
        },
      ]
    },
    {
      id: 's2',
      type: 'series',
      title: 'Robot Team',
      description: 'Conheça a equipe de robôs mais incrível do universo explorando planetas desconhecidos!',
      thumbnail: 'https://picsum.photos/seed/robotteam/300/180',
      banner: 'https://picsum.photos/seed/robotteam_b/800/400',
      rating: 4,
      seasons: [
        {
          id: 'ss2s1', title: 'Temporada 1',
          episodes: [
            { id: 'e111', title: 'Power Up!', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e111/200/120' },
            { id: 'e112', title: 'Missão Marte', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e112/200/120' },
          ]
        }
      ]
    },
    {
      id: 's3',
      type: 'series',
      title: 'Alien Academy',
      description: 'Jovens alienígenas aprendem os segredos do universo na escola mais extraordinária da galáxia!',
      thumbnail: 'https://picsum.photos/seed/alienac/300/180',
      banner: 'https://picsum.photos/seed/alienac_b/800/400',
      rating: 5,
      seasons: [
        {
          id: 'ss3s1', title: 'Temporada 1',
          episodes: [
            { id: 'e121', title: 'Primeiro Dia', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e121/200/120' },
            { id: 'e122', title: 'Aula de Ciências', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e122/200/120' },
          ]
        }
      ]
    },
    {
      id: 's4',
      type: 'series',
      title: 'Star Racers',
      description: 'As crianças mais rápidas da galáxia competem em corridas épicas por campos de asteroides!',
      thumbnail: 'https://picsum.photos/seed/starrac/300/180',
      banner: 'https://picsum.photos/seed/starrac_b/800/400',
      rating: 4,
      seasons: [
        {
          id: 'ss4s1', title: 'Temporada 1',
          episodes: [
            { id: 'e131', title: 'A Corrida Começa', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e131/200/120' },
            { id: 'e132', title: 'O Rival', youtubeId: 'dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/e132/200/120' },
          ]
        }
      ]
    },
  ],

  movies: [
    {
      id: 'm1',
      type: 'movie',
      title: 'Cosmic Journey',
      description: 'Três jovens astronautas embarcam na maior aventura que o universo já viu!',
      thumbnail: 'https://picsum.photos/seed/cosmicj/300/180',
      banner: 'https://picsum.photos/seed/cosmicj_b/800/400',
      rating: 5,
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'm2',
      type: 'movie',
      title: 'The Moon Monsters',
      description: 'Criaturas engraçadas da lua visitam a Terra e causam um caos hilário!',
      thumbnail: 'https://picsum.photos/seed/moonm/300/180',
      banner: 'https://picsum.photos/seed/moonm_b/800/400',
      rating: 4,
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'm3',
      type: 'movie',
      title: 'Planet Zork',
      description: 'Descubra o planeta mais estranho da galáxia onde nada é o que parece!',
      thumbnail: 'https://picsum.photos/seed/planetz/300/180',
      banner: 'https://picsum.photos/seed/planetz_b/800/400',
      rating: 5,
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'm4',
      type: 'movie',
      title: 'Star-Dash Adventurers',
      description: 'Junte-se a Maya, Leo e seu amigo alienígena Sparky em uma missão cósmica!',
      thumbnail: 'https://picsum.photos/seed/stardash/300/180',
      banner: 'https://picsum.photos/seed/stardash_b/800/400',
      rating: 5,
      youtubeId: 'dQw4w9WgXcQ',
    },
  ],

  games: {
    featured: {
      id: 'g0',
      title: 'Green Yard',
      description: 'Defenda seu jardim dos robôs invasores! Coloque plantas estrategicamente e vença as batalhas!',
      thumbnail: 'https://picsum.photos/seed/greenyard/400/220',
      banner: 'https://picsum.photos/seed/greenyard_b/800/400',
      category: 'Arcade',
      type: 'local',
      file: 'greenyard.html',
      icon: 'https://picsum.photos/seed/gyicon/80/80',
      plays: 1520,
    },
    educational: [
      { id: 'g1', title: 'Space Math Hero', description: 'Resolva problemas de matemática para abastecer sua nave!', thumbnail: 'https://picsum.photos/seed/smath/200/200', category: 'Educacional', type: 'url', url: 'https://yoursite.com/games/spacemathero.html', plays: 840 },
      { id: 'g2', title: 'Star Spelling', description: 'Soletre palavras para coletar estrelas pela galáxia!', thumbnail: 'https://picsum.photos/seed/sspell/200/200', category: 'Educacional', type: 'url', url: 'https://yoursite.com/games/starspelling.html', plays: 620 },
      { id: 'g3', title: 'Planet Facts', description: 'Aprenda fatos incríveis sobre todos os planetas!', thumbnail: 'https://picsum.photos/seed/pfacts/200/200', category: 'Educacional', type: 'url', url: 'https://yoursite.com/games/planetfacts.html', plays: 510 },
    ],
    puzzle: [
      { id: 'g5', title: 'Galaxy Match-3', description: 'Combine gemas cósmicas para salvar a galáxia!', thumbnail: 'https://picsum.photos/seed/gmatch/200/200', category: 'Puzzle', type: 'url', url: 'https://yoursite.com/games/galaxymatch.html', plays: 1200 },
      { id: 'g6', title: 'Rocket Maze', description: 'Navegue sua nave pelos labirintos do espaço!', thumbnail: 'https://picsum.photos/seed/rmaze/200/200', category: 'Puzzle', type: 'url', url: 'https://yoursite.com/games/rocketmaze.html', plays: 890 },
      { id: 'g7', title: 'Nebula Puzzle', description: 'Resolva lindos quebra-cabeças de nebulosas!', thumbnail: 'https://picsum.photos/seed/npuzz/200/200', category: 'Puzzle', type: 'url', url: 'https://yoursite.com/games/nebulapuzzle.html', plays: 670 },
    ],
    arcade: [
      { id: 'g9', title: 'Spaceship Shooter', description: 'Destrua ondas de invasores alienígenas!', thumbnail: 'https://picsum.photos/seed/sshoote/200/200', category: 'Arcade', type: 'url', url: 'https://yoursite.com/games/spaceshooter.html', plays: 2100 },
      { id: 'g10', title: 'Asteroid Dodge', description: 'Desvie de asteroides em velocidade warp!', thumbnail: 'https://picsum.photos/seed/adodge/200/200', category: 'Arcade', type: 'url', url: 'https://yoursite.com/games/asteroiddodge.html', plays: 1800 },
      { id: 'g11', title: 'Alien Runner', description: 'Corra, pule e voe com seu amigo alienígena!', thumbnail: 'https://picsum.photos/seed/arun/200/200', category: 'Arcade', type: 'url', url: 'https://yoursite.com/games/alienrunner.html', plays: 1500 },
    ],
  },
};