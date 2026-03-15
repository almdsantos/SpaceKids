import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../data/firebase';
import { MOCK_DATA, DATA_URL } from '../data/mock';

// ─────────────────────────────────────────────────────────────────────────────
// Fonte de dados:
// 1. Firebase Firestore (principal)
// 2. JSON remoto (fallback)
// 3. Mock local (fallback final)
// ─────────────────────────────────────────────────────────────────────────────

const USE_REMOTE_JSON = false; // true = usa JSON remoto ao invés do Firebase

export function useContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    setLoading(true);
    setError(null);
    try {
      if (USE_REMOTE_JSON) {
        // Fonte 2: JSON remoto
        const response = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        setData(json);
      } else {
        // Fonte 1: Firebase Firestore
        const result = await loadFromFirebase();
        if (result) {
          setData(result);
        } else {
          // Fonte 3: Mock local como fallback
          console.warn('Firebase vazio — usando dados mockados');
          setData(MOCK_DATA);
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar dados:', err.message, '— usando mock local');
      setError(err.message);
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  }

  async function loadFromFirebase() {
    try {
      const [seriesSnap, moviesSnap, gamesSnap] = await Promise.all([
        getDocs(collection(db, 'series')),
        getDocs(collection(db, 'movies')),
        getDocs(collection(db, 'games')),
      ]);

      const series = seriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const movies = moviesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const gamesDocs = gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Se todas as coleções estiverem vazias, retorna null para usar o mock
      if (!series.length && !movies.length && !gamesDocs.length) return null;

      // Organiza os jogos por categoria
      const featured = gamesDocs.find(g => g.featured) || null;
      const educational = gamesDocs.filter(g => g.category === 'Educacional');
      const puzzle = gamesDocs.filter(g => g.category === 'Puzzle');
      const arcade = gamesDocs.filter(g => g.category === 'Arcade');

      return {
        series,
        movies,
        games: { featured, educational, puzzle, arcade },
      };
    } catch (err) {
      console.warn('Erro no Firebase:', err.message);
      return null;
    }
  }

  function getHeroItems(count = 3) {
    if (!data) return [];
    const all = [...(data.movies || []), ...(data.series || [])];
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  return { data, loading, error, reload: loadContent, getHeroItems };
}