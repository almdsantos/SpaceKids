# 🛸 SpaceKids

> Uma galáxia de diversão para crianças! SpaceKids reúne filmes, séries e jogos num app espacial incrível. React Native + Expo com conteúdo 100% dinâmico via JSON.

<br/>

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Sobre o Projeto

**SpaceKids** é um app de entretenimento infantil temático espacial. Com visual neon estilo galáxia, ele reúne num só lugar:

- 🎬 **Filmes** — aventuras espaciais incríveis
- 📺 **Séries** — com temporadas e episódios
- 🎮 **Jogos** — educativos, puzzles e arcade
- 🔍 **Busca** — encontre qualquer conteúdo rapidinho
- 🔖 **Favoritos** — salve o que mais gosta

---

## ✨ Funcionalidades

- 🌌 Visual neon temático espacial com estrelas animadas
- 🎠 Hero Banner com carrossel automático
- 📡 Conteúdo 100% dinâmico via JSON remoto — sem rebuild!
- 🎮 Jogos em HTML rodando via WebView
- ▶️ Player de vídeo integrado
- 🔖 Favoritos salvos localmente no dispositivo
- 🚀 Easter egg secreto — clique no foguete!

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native + Expo SDK 54 | Base do app |
| React Navigation | Navegação entre telas |
| Expo Linear Gradient | Gradientes |
| React Native WebView | Jogos HTML e player |
| AsyncStorage | Favoritos locais |
| React Native Reanimated | Animações |

---

## 📁 Estrutura do Projeto

```
spacekids/
├── App.js                          ← Navegação principal
├── assets/
│   └── games/                      ← Jogos HTML
└── src/
    ├── theme/index.js              ← Cores e espaçamentos
    ├── data/mock.js                ← Dados mockados + DATA_URL
    ├── context/
    │   └── FavoritesContext.js     ← Favoritos com AsyncStorage
    ├── hooks/
    │   └── useContent.js           ← Hook de dados local/remoto
    ├── components/
    │   ├── StarBackground.jsx      ← Estrelas decorativas
    │   ├── HeroBanner.jsx          ← Carrossel hero
    │   ├── ContentCard.jsx         ← Card de filme/série/jogo
    │   ├── SectionRow.jsx          ← Seção horizontal
    │   └── RocketEasterEgg.jsx     ← 🚀 Easter egg do foguete!
    └── screens/
        ├── HomeScreen.jsx          ← Tela inicial
        ├── GamesScreen.jsx         ← Tela de jogos
        ├── SearchScreen.jsx        ← Busca
        ├── FavoritesScreen.jsx     ← Favoritos com tabs
        ├── MovieDetailScreen.jsx   ← Detalhe do filme
        ├── SeriesDetailScreen.jsx  ← Detalhe da série
        ├── PlayerScreen.jsx        ← Player de vídeo
        └── GamePlayerScreen.jsx    ← WebView para jogos
```

---

## ⚙️ Como Rodar

### Pré-requisitos
- Node.js 18+
- Expo Go instalado no celular

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/spacekids.git

# Entre na pasta
cd spacekids

# Instale as dependências
npm install

# Rode o projeto
npx expo start
```

Escaneie o QR Code com o **Expo Go** no celular! 📱

---

## 📡 Conteúdo Dinâmico via JSON

O SpaceKids foi pensado para que **todo o conteúdo seja gerenciado remotamente** — sem precisar de um novo build!

### Como funciona

1. Hospede um `data.json` em qualquer servidor
2. Atualize `DATA_URL` em `src/data/mock.js`
3. Mude `USE_REMOTE = true` em `src/hooks/useContent.js`
4. ✅ O app busca o conteúdo automaticamente!

### Estrutura do JSON

```json
{
  "series": [...],
  "movies": [...],
  "games": {
    "featured": { ... },
    "educational": [...],
    "puzzle": [...],
    "arcade": [...]
  }
}
```

### Tipos de jogo

| `type` | Descrição |
|--------|-----------|
| `local` | HTML bundled no app |
| `url` | HTML hospedado remotamente |

---

## 🎮 Integrando Jogos

Para adicionar um novo jogo:

```json
{
  "id": "g99",
  "title": "Meu Jogo",
  "description": "Descrição do jogo",
  "thumbnail": "https://seusite.com/thumb.jpg",
  "category": "Arcade",
  "type": "url",
  "url": "https://seusite.com/jogos/meujogo.html"
}
```

Atualize o JSON hospedado e o jogo aparece automaticamente! 🎮

---

## 🚀 Easter Egg

Clique no foguete 🚀 no header para uma surpresa espacial!

---

## 📱 Build para Produção

```bash
npx eas build --platform android
npx eas build --platform ios
```

---

## 👨‍💻 Desenvolvido por

**Aliston** — com muito ☕ e 🚀

---

<p align="center">Feito com 💚 e muitas estrelas 🌟</p>
