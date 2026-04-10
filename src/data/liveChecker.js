// ─────────────────────────────────────────────────────────────────────────────
// liveChecker.js
// Verifica status das lives no YouTube e atualiza o Firebase automaticamente.
// Arquitetura: YouTube API → verifica live → Firebase atualiza isLive → App lê
//
// Uso: importe e chame checkAllLives() onde quiser (ex: AppState, intervalo)
// ─────────────────────────────────────────────────────────────────────────────

import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const YT_API_KEY = 'AIzaSyDHH_wmLowcERBLQbkkIpoy-kMNy3kkwD8';

// ─── Status possíveis de uma live ────────────────────────────────────────────
export const LIVE_STATUS = {
  LIVE:      'live',       // 🔴 ao vivo agora
  UPCOMING:  'upcoming',  // ⏳ agendada
  NONE:      'none',       // ❌ offline / não existe
};

// ─── Verifica um único youtubeId via YouTube Data API v3 ──────────────────────
export async function checkYouTubeLiveStatus(youtubeId) {
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,liveStreamingDetails` +
      `&id=${youtubeId}` +
      `&key=${YT_API_KEY}`;

    const res  = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return { status: LIVE_STATUS.NONE, title: null, thumbnail: null };
    }

    const item     = data.items[0];
    const liveBcast = item.snippet?.liveBroadcastContent; // 'live' | 'upcoming' | 'none'
    const title     = item.snippet?.title || null;
    const thumbnail =
      item.snippet?.thumbnails?.maxres?.url ||
      item.snippet?.thumbnails?.high?.url   ||
      item.snippet?.thumbnails?.medium?.url || null;

    const scheduledStart =
      item.liveStreamingDetails?.scheduledStartTime || null;

    let status = LIVE_STATUS.NONE;
    if (liveBcast === 'live')     status = LIVE_STATUS.LIVE;
    if (liveBcast === 'upcoming') status = LIVE_STATUS.UPCOMING;

    return { status, title, thumbnail, scheduledStart };
  } catch (err) {
    console.warn(`[liveChecker] Erro ao verificar ${youtubeId}:`, err.message);
    return { status: LIVE_STATUS.NONE, title: null, thumbnail: null };
  }
}

// ─── Verifica todas as lives cadastradas no Firebase e atualiza isLive ────────
export async function checkAllLives() {
  try {
    const snap  = await getDocs(collection(db, 'lives'));
    const lives = snap.docs.map(d => ({ _docId: d.id, ...d.data() }));

    if (!lives.length) {
      console.log('[liveChecker] Nenhuma live cadastrada.');
      return [];
    }

    const results = [];

    for (const live of lives) {
      const { status, title, thumbnail, scheduledStart } =
        await checkYouTubeLiveStatus(live.youtubeId);

      const isLive     = status === LIVE_STATUS.LIVE;
      const isUpcoming = status === LIVE_STATUS.UPCOMING;

      // Atualiza o documento no Firebase
      const ref = doc(db, 'lives', live._docId);
      await updateDoc(ref, {
        isLive,
        isUpcoming,
        liveStatus: status,
        lastChecked: new Date().toISOString(),
        // Atualiza título/thumbnail automaticamente se mudou
        ...(title     && { title }),
        ...(thumbnail && { thumbnail }),
        ...(scheduledStart && { scheduledStart }),
      });

      console.log(`[liveChecker] ${live.youtubeId} → ${status}`);
      results.push({ ...live, isLive, isUpcoming, liveStatus: status });
    }

    return results;
  } catch (err) {
    console.error('[liveChecker] Erro geral:', err.message);
    return [];
  }
}

// ─── Inicia verificação periódica (intervalo em minutos) ──────────────────────
// Retorna função para parar o intervalo
export function startLiveWatcher(intervalMinutes = 2) {
  console.log(`[liveChecker] Iniciando watcher (a cada ${intervalMinutes} min)`);

  // Roda imediatamente
  checkAllLives();

  const ms = intervalMinutes * 60 * 1000;
  const id = setInterval(checkAllLives, ms);

  return () => {
    clearInterval(id);
    console.log('[liveChecker] Watcher parado.');
  };
}
