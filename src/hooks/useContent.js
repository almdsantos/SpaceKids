import { useState, useEffect } from 'react';
import { MOCK_DATA, DATA_URL } from '../data/mock';

const USE_REMOTE = false; // Mude para true quando tiver o JSON hospedado

export function useContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    setLoading(true);
    setError(null);
    try {
      if (USE_REMOTE) {
        const response = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        setData(json);
      } else {
        await new Promise(r => setTimeout(r, 400));
        setData(MOCK_DATA);
      }
    } catch (err) {
      console.warn('Erro:', err.message);
      setError(err.message);
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
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