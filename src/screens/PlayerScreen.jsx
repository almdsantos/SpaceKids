import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '../theme';
import { getStreamUrl } from '../../modules/youtube-extractor';

function formatTime(secs) {
  const s = Math.floor(secs || 0);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function useScreenDimensions() {
  const [dims, setDims] = useState(Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setDims(window));
    return () => sub?.remove();
  }, []);
  return dims;
}

// ─── VideoCore — só monta quando URL existe ───────────────────────────────────
// Reproduz exatamente o ciclo do Player isolado:
// useVideoPlayer(url) nasce com fonte real desde o primeiro render.
function VideoCore({ videoUrl, screenW, screenH, onReady, onTimeUpdate, onPlayingChange, onEnd }) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.5;
    p.play();
  });

  useEffect(() => {
    const subStatus = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') {
        onReady(player);
      }
    });

    const subTime = player.addListener('timeUpdate', ({ currentTime }) => {
      onTimeUpdate(currentTime, player.duration || 0);
    });

    const subPlaying = player.addListener('playingChange', ({ isPlaying }) => {
      onPlayingChange(isPlaying);
    });

    const subEnd = player.addListener('playToEnd', () => {
      onEnd();
    });

    return () => {
      subStatus.remove();
      subTime.remove();
      subPlaying.remove();
      subEnd.remove();
    };
  }, [player]);

  return (
    <VideoView
      style={{ width: screenW, height: screenH, backgroundColor: '#000' }}
      player={player}
      contentFit="contain"
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
}

// ─── PlayerScreen ─────────────────────────────────────────────────────────────
export default function PlayerScreen({ route, navigation }) {
  const { episodes, initialIndex = 0 } = route.params;

  const [index, setIndex] = useState(initialIndex);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekRatio, setSeekRatio] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [streamError, setStreamError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null); // null = VideoCore não monta

  const playerRef = useRef(null); // referência ao player nativo vinda do VideoCore
  const trackWidth = useRef(200);
  const hideTimer = useRef(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const isSeekingRef = useRef(false);

  const currentEpisode = episodes[index];

  const { width, height } = useScreenDimensions();
  const screenW = Math.max(width, height);
  const screenH = Math.min(width, height);

  const MASK_TOP    = screenH * 0.20;
  const MASK_BOTTOM = screenH * 0.80;

  const BTN_TOP  = screenH * 0.04;
  const BTN_LEFT = screenW * 0.045;
  const BTN_SIZE = 40;

  // ─── Landscape ───────────────────────────────────────────────────────────────
  useEffect(() => {
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      StatusBar.setHidden(false);
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // ─── Extração de URL — VideoCore só monta quando URL estiver pronta ───────────
  useEffect(() => {
    let cancelled = false;

    setReady(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSeekRatio(0);
    setStreamError(null);
    setVideoUrl(null); // desmonta VideoCore anterior

    (async () => {
      try {
        const { url } = await getStreamUrl(currentEpisode.youtubeId);
        if (cancelled) return;
        setVideoUrl(url); // monta VideoCore com URL real desde o primeiro render
      } catch (err) {
        if (!cancelled) setStreamError('Não foi possível carregar o vídeo.');
      }
    })();

    return () => { cancelled = true; };
  }, [index]);

  // ─── Auto-hide ────────────────────────────────────────────────────────────────
  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0, duration: 300, useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 3000);
  }, [controlsOpacity]);

  const showControlsNow = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1, duration: 180, useNativeDriver: true,
    }).start();
    startHideTimer();
  }, [controlsOpacity, startHideTimer]);

  useEffect(() => {
    if (ready && playing) startHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [ready, playing, startHideTimer]);

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  // ─── Navegação ────────────────────────────────────────────────────────────────
  function goNext() {
    if (index < episodes.length - 1) setIndex(index + 1);
    else navigation.goBack();
  }

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  // ─── Callbacks do VideoCore ───────────────────────────────────────────────────
  const handleReady = useCallback((player) => {
    playerRef.current = player;
    setReady(true);
    setPlaying(true);
    if (player.duration) setDuration(player.duration);
    showControlsNow();
  }, [showControlsNow]);

  const handleTimeUpdate = useCallback((t, d) => {
    if (isSeekingRef.current) return;
    setCurrentTime(t);
    if (d > 0) setDuration(d);
  }, []);

  const handlePlayingChange = useCallback((isPlaying) => {
    setPlaying(isPlaying);
  }, []);

  // ─── Skip ─────────────────────────────────────────────────────────────────────
  function skip(seconds) {
    showControlsNow();
    const p = playerRef.current;
    if (!p) return;
    const t = p.currentTime || 0;
    const d = p.duration || 0;
    p.currentTime = Math.max(0, Math.min(t + seconds, d || t + seconds));
    setCurrentTime(p.currentTime);
  }

  // ─── PanResponder da barra ────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        showControlsNow();
        setIsSeeking(true);
        setSeekRatio(Math.max(0, Math.min(evt.nativeEvent.locationX / trackWidth.current, 1)));
      },
      onPanResponderMove: (evt) => {
        setSeekRatio(Math.max(0, Math.min(evt.nativeEvent.locationX / trackWidth.current, 1)));
      },
      onPanResponderRelease: (evt) => {
        const ratio = Math.max(0, Math.min(evt.nativeEvent.locationX / trackWidth.current, 1));
        setIsSeeking(false);
        setSeekRatio(ratio);
        const p = playerRef.current;
        if (p) {
          const target = ratio * (p.duration || 0);
          p.currentTime = target;
          setCurrentTime(target);
        }
        startHideTimer();
      },
    })
  ).current;

  const progress    = isSeeking ? seekRatio : (duration > 0 ? currentTime / duration : 0);
  const progressPct = `${Math.min(progress * 100, 100)}%`;

  return (
    <View style={styles.wrapper}>
      <StatusBar hidden />
      <View style={[styles.container, { width: screenW, height: screenH }]}>

        {/* ── VideoCore — só renderiza quando videoUrl existe ── */}
        <View style={[styles.playerContainer, { width: screenW, height: screenH }]}>
          {videoUrl ? (
            <VideoCore
              videoUrl={videoUrl}
              screenW={screenW}
              screenH={screenH}
              onReady={handleReady}
              onTimeUpdate={handleTimeUpdate}
              onPlayingChange={handlePlayingChange}
              onEnd={goNext}
            />
          ) : null}
        </View>

        {/* MASK TOPO */}
        <View style={[styles.maskTop, { width: screenW, height: MASK_TOP }]}>
          {showControls && (
            <Animated.View style={[styles.topControls, { opacity: controlsOpacity }]}>
              <TouchableOpacity
                style={[styles.backBtn, {
                  top: BTN_TOP, left: BTN_LEFT,
                  width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2,
                }]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>

              {episodes.length > 1 && (
                <Text style={[styles.epCount, {
                  top: BTN_TOP + BTN_SIZE * 0.25,
                  right: screenW * 0.03,
                }]}>
                  {index + 1}/{episodes.length}
                </Text>
              )}
            </Animated.View>
          )}
        </View>

        {/* MASK BASE */}
        <View style={[styles.maskBottom, { width: screenW, height: MASK_BOTTOM }]}>
          <TouchableOpacity style={styles.bottomTouchFill} onPress={showControlsNow} activeOpacity={1} />

          {showControls && (
            <Animated.View style={[styles.bottomControlsWrap, { opacity: controlsOpacity }]}>
              <View style={styles.bottomBar}>

                {index > 0 ? (
                  <TouchableOpacity style={styles.navBtn} onPress={() => { showControlsNow(); goPrev(); }}>
                    <Ionicons name="play-skip-back" size={16} color={colors.neonGreen} />
                    <Text style={styles.navLabel}>Anterior</Text>
                  </TouchableOpacity>
                ) : <View style={styles.navPlaceholder} />}

                <TouchableOpacity style={styles.skipBtn} onPress={() => skip(-10)}>
                  <Ionicons name="play-back" size={18} color="#fff" />
                  <Text style={styles.skipLabel}>10s</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playPauseBtn}
                  onPress={() => {
                    showControlsNow();
                    const p = playerRef.current;
                    if (!p) return;
                    if (playing) {
                      p.pause();
                    } else {
                      p.play();
                    }
                  }}
                >
                  <Ionicons
                    name={playing ? 'pause' : 'play'}
                    size={18}
                    color="#fff"
                    style={{ marginLeft: playing ? 0 : 2 }}
                  />
                </TouchableOpacity>

                <View style={styles.progressWrap}>
                  <Text style={styles.timeText}>
                    {formatTime(isSeeking ? seekRatio * duration : currentTime)}
                  </Text>
                  <View
                    style={styles.track}
                    onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
                    {...panResponder.panHandlers}
                  >
                    <View style={[styles.fill, { width: progressPct }]} />
                    <View style={[styles.thumb, { left: progressPct }]} />
                  </View>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>

                <TouchableOpacity style={styles.skipBtn} onPress={() => skip(10)}>
                  <Ionicons name="play-forward" size={18} color="#fff" />
                  <Text style={styles.skipLabel}>10s</Text>
                </TouchableOpacity>

                {index < episodes.length - 1 ? (
                  <TouchableOpacity style={styles.navBtn} onPress={() => { showControlsNow(); goNext(); }}>
                    <Text style={styles.navLabel}>Próximo</Text>
                    <Ionicons name="play-skip-forward" size={16} color={colors.neonGreen} />
                  </TouchableOpacity>
                ) : <View style={styles.navPlaceholder} />}

              </View>
            </Animated.View>
          )}
        </View>

        {/* LOADING / ERRO */}
        {!ready && (
          <View style={[styles.loadingOverlay, { width: screenW, height: screenH }]}>
            <ActivityIndicator size="large" color={colors.neonGreen} />
            <Text style={styles.loadingText}>
              {streamError ? `⚠️ ${streamError}` : '🚀 Preparando...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
  },
  container: {
    backgroundColor: '#000', overflow: 'hidden', alignSelf: 'center',
  },
  playerContainer: {
    position: 'absolute', top: 0, left: 0,
    overflow: 'hidden', backgroundColor: '#000',
  },
  maskSide: {
    position: 'absolute', top: 0, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  maskTop: {
    position: 'absolute', top: 0, left: 0, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  maskBottom: {
    position: 'absolute', bottom: 0, left: 0, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
    justifyContent: 'flex-end',
  },
  sideTouch: { flex: 1 },
  bottomTouchFill: { ...StyleSheet.absoluteFillObject },
  topControls: { flex: 1 },
  backBtn: {
    position: 'absolute', zIndex: 50,
    backgroundColor: colors.neonGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  epCount: {
    position: 'absolute', zIndex: 50,
    color: colors.neonGreen, fontSize: 13, fontWeight: '700',
  },
  bottomControlsWrap: {
    width: '100%', paddingHorizontal: 12, paddingBottom: 6,
  },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: 1, borderColor: 'rgba(0,255,136,0.18)',
    borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1.2, borderColor: 'rgba(0,255,136,0.45)',
    borderRadius: 18, paddingHorizontal: 10, paddingVertical: 6,
    minWidth: 86, zIndex: 50,
  },
  navPlaceholder: { minWidth: 86 },
  navLabel: { color: colors.neonGreen, fontSize: 11, fontWeight: '700' },
  skipBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4, minWidth: 42, zIndex: 50,
  },
  skipLabel: { color: '#fff', fontSize: 9, fontWeight: '600', marginTop: -2 },
  playPauseBtn: {
    alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,255,136,0.18)',
    borderWidth: 1.2, borderColor: 'rgba(0,255,136,0.45)',
    zIndex: 50,
  },
  progressWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: 6, marginHorizontal: 4, minWidth: 120,
  },
  timeText: {
    color: '#fff', fontSize: 10, fontWeight: '600',
    minWidth: 36, textAlign: 'center',
  },
  track: {
    flex: 1, height: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999, justifyContent: 'center',
  },
  fill: {
    position: 'absolute', left: 0, height: 3,
    backgroundColor: colors.neonGreen, borderRadius: 999,
  },
  thumb: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.neonGreen, marginLeft: -5, top: -3.5,
  },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0,
    backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 30, gap: 12,
  },
  loadingText: { color: '#8fa8bc', fontSize: 13 },
});
