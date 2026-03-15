// ─────────────────────────────────────────────────────────────────────────────
// Script para popular o Firebase com os dados iniciais
// Execute no console do navegador ou como script Node
// ─────────────────────────────────────────────────────────────────────────────

import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_DATA } from './mock';

export async function seedFirebase() {
  try {
    console.log('🚀 Iniciando seed do Firebase...');
    const batch = writeBatch(db);

    // ── Séries ────────────────────────────────────────────────────────────────
    MOCK_DATA.series.forEach(item => {
      const ref = doc(collection(db, 'series'), item.id);
      batch.set(ref, item);
    });
    console.log(`✅ ${MOCK_DATA.series.length} séries adicionadas`);

    // ── Filmes ────────────────────────────────────────────────────────────────
    MOCK_DATA.movies.forEach(item => {
      const ref = doc(collection(db, 'movies'), item.id);
      batch.set(ref, item);
    });
    console.log(`✅ ${MOCK_DATA.movies.length} filmes adicionados`);

    // ── Jogos ─────────────────────────────────────────────────────────────────
    const allGames = [
      { ...MOCK_DATA.games.featured, featured: true },
      ...MOCK_DATA.games.educational,
      ...MOCK_DATA.games.puzzle,
      ...MOCK_DATA.games.arcade,
    ];
    allGames.forEach(item => {
      const ref = doc(collection(db, 'games'), item.id);
      batch.set(ref, item);
    });
    console.log(`✅ ${allGames.length} jogos adicionados`);

    await batch.commit();
    console.log('🎉 Firebase populado com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    return false;
  }
}