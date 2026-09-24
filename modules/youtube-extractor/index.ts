import { requireNativeModule } from 'expo-modules-core';

export interface StreamVariant {
  url: string;
  mimeType: string;
  resolution: string;
  isProgressive: boolean;
}

export interface AudioStreamVariant {
  url: string;
  mimeType: string;
  averageBitrate: number;
}

export interface StreamsResult {
  id: string;
  name: string;
  durationSeconds: number;
  /** Streams progressivos: já contêm áudio + vídeo juntos (ideais para o expo-video). */
  progressiveStreams: StreamVariant[];
  /** Streams somente vídeo (qualidade maior, mas exigem mux com áudio separado). */
  videoOnlyStreams: StreamVariant[];
  audioStreams: AudioStreamVariant[];
}

export interface BestStreamResult {
  url: string;
  mimeType: string;
  quality: string;
  isProgressive: boolean;
}

const NativeYoutubeExtractor = requireNativeModule('YoutubeExtractor');

/**
 * Retorna todos os streams disponíveis (progressivos, somente vídeo e somente áudio)
 * para um videoId do YouTube. Útil para depuração/testes (ver seção 18 do contexto).
 */
export async function getStreams(videoId: string): Promise<StreamsResult> {
  return NativeYoutubeExtractor.getStreams(videoId);
}

/**
 * Retorna a melhor URL de stream progressivo (áudio + vídeo) já pronta para
 * ser usada em useVideoPlayer(url) do expo-video.
 */
export async function getStreamUrl(videoId: string): Promise<BestStreamResult> {
  return NativeYoutubeExtractor.getStreamUrl(videoId);
}

export default { getStreams, getStreamUrl };
