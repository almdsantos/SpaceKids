import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage/src/AsyncStorage.native';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => { loadFavorites(); }, []);

  async function loadFavorites() {
    try {
      const stored = await AsyncStorage.getItem('@spacekids_favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) { console.warn('Erro ao carregar favoritos:', e); }
  }

  async function toggleFavorite(item) {
    const exists = favorites.find(f => f.id === item.id);
    const next = exists
      ? favorites.filter(f => f.id !== item.id)
      : [...favorites, item];
    setFavorites(next);
    try {
      await AsyncStorage.setItem('@spacekids_favorites', JSON.stringify(next));
    } catch (e) { console.warn('Erro ao salvar favorito:', e); }
  }

  function isFavorite(id) {
    return favorites.some(f => f.id === id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);