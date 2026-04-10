// src/hooks/useContent.js
import { useState, useEffect } from 'react';
import {
  collection, getDocs, onSnapshot,
  query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../data/firebase';
import { MOCK_DATA } from '../data/mock';

const USE_FIREBASE = true; // false → usa mock local

export function useContent() {
  const [data, setData]       = useState(null);
  const [lives, setLives]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ─── Carrega séries, filmes e jogos (uma vez) ─────────────────────────────
  useEffect(() => {
    if (!USE_FIREBASE) {
      setData(MOCK_DATA);
      setLoading(false);
      return;
    }
    loadContent();
  }, []);

  // ─── Listener em tempo real para lives ───────────────────────────────────
  // Usa onSnapshot → app atualiza sozinho quando Firebase muda isLive
  useEffect(() => {
    if (!USE_FIREBASE) return;

    const q = query(collection(db, 'lives'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const livesList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLives(livesList);
      },
      (err) => {
        console.warn('[useContent] Erro ao ouvir lives:', err.message);
      }
    );

    return () => unsub();
  }, []);

  async function loadContent() {
    setLoading(true);
    setError(null);
    try {
      const [seriesSnap, moviesSnap, gamesSnap] = await Promise.all([
        getDocs(collection(db, 'series')),
        getDocs(collection(db, 'movies')),
        getDocs(collection(db, 'games')),
      ]);

      const series = seriesSnap.docs.map(d => d.data());
      const movies = moviesSnap.docs.map(d => d.data());
      const gamesAll = gamesSnap.docs.map(d => d.data());

      // Reconstrói estrutura de jogos igual ao mock
      const games = {
        featured:    gamesAll.find(g => g.featured) || null,
        arcade:      gamesAll.filter(g => g.category === 'Arcade'      && !g.featured),
        educational: gamesAll.filter(g => g.category === 'Educacional' && !g.featured),
        puzzle:      gamesAll.filter(g => g.category === 'Puzzle'      && !g.featured),
      };

      setData({ series, movies, games });
    } catch (err) {
      console.error('[useContent] Erro:', err.message);
      setError(err.message);
      // Fallback para mock
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  }

  // ─── Itens para o Hero Banner ─────────────────────────────────────────────
  function getHeroItems(count = 3) {
    if (!data) return [];
    const all = [
      ...(data.series || []),
      ...(data.movies || []),
    ];
    return all.slice(0, count);
  }

  // ─── Lives ativas (isLive = true) ─────────────────────────────────────────
  const activeLives    = lives.filter(l => l.isLive);
  const upcomingLives  = lives.filter(l => l.isUpcoming && !l.isLive);
  const hasLive        = activeLives.length > 0;

  return {
    data,
    lives,
    activeLives,
    upcomingLives,
    hasLive,
    loading,
    error,
    reload: loadContent,
    getHeroItems,
  };
}
