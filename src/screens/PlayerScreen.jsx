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
import YoutubeIframe from 'react-native-youtube-iframe';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '../theme';

function useScreenDimensions() {
  const [dims, setDims] = useState(Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setDims(window));
    return () => sub?.remove();
  }, []);

  return dims;
}

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

  const playerRef = useRef(null);
  const trackWidth = useRef(200);
  const hideTimer = useRef(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  const currentEpisode = episodes[index];

  const { width, height } = useScreenDimensions();
  const screenW = Math.max(width, height);
  const screenH = Math.min(width, height);

  // Mantém a área central livre
  const MASK_TOP = screenH * 0.45;
  const MASK_BOTTOM = screenH * 0.35;
  const MASK_LEFT = screenW * 0.45;
  const MASK_RIGHT = screenW * 0.45;

  const BTN_TOP = screenH * 0.03;
  const BTN_LEFT = screenW * 0.035;
  const BTN_SIZE = 40;

  useEffect(() => {
    StatusBar.setHidden(true);

    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      StatusBar.setHidden(false);

      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible');
      }

      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  useEffect(() => {
    setReady(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSeekRatio(0);
  }, [index]);

  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    hideTimer.current = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 3000);
  }, [controlsOpacity]);

  const showControlsNow = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    setShowControls(true);

    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    startHideTimer();
  }, [controlsOpacity, startHideTimer]);

  useEffect(() => {
    if (ready && playing) startHideTimer();

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [ready, playing, startHideTimer]);

  useEffect(() => {
    if (!ready || !playing || isSeeking) return;

    const interval = setInterval(async () => {
      try {
        const t = await playerRef.current?.getCurrentTime();
        const d = await playerRef.current?.getDuration();

        if (t != null) setCurrentTime(t);
        if (d != null && d > 0) setDuration(d);
      } catch (_) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [ready, playing, isSeeking]);

  function onReady() {
    setReady(true);
    setPlaying(true);
    showControlsNow();
  }

  function goNext() {
    if (index < episodes.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.goBack();
    }
  }

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  async function skip(seconds) {
    showControlsNow();

    try {
      const t = await playerRef.current?.getCurrentTime();
      const d = await playerRef.current?.getDuration();
      const next = Math.max(0, Math.min((t || 0) + seconds, d || 99999));

      playerRef.current?.seekTo(next, true);
      setCurrentTime(next);
    } catch (_) {}
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        showControlsNow();
        setIsSeeking(true);

        const ratio = Math.max(
          0,
          Math.min(evt.nativeEvent.locationX / trackWidth.current, 1)
        );

        setSeekRatio(ratio);
      },

      onPanResponderMove: (evt) => {
        const ratio = Math.max(
          0,
          Math.min(evt.nativeEvent.locationX / trackWidth.current, 1)
        );

        setSeekRatio(ratio);
      },

      onPanResponderRelease: async (evt) => {
        const ratio = Math.max(
          0,
          Math.min(evt.nativeEvent.locationX / trackWidth.current, 1)
        );

        setIsSeeking(false);
        setSeekRatio(ratio);

        try {
          const d = await playerRef.current?.getDuration();
          const target = ratio * (d || 0);

          playerRef.current?.seekTo(target, true);
          setCurrentTime(target);
        } catch (_) {}

        startHideTimer();
      },
    })
  ).current;

  const progress = isSeeking
    ? seekRatio
    : duration > 0
      ? currentTime / duration
      : 0;

  const progressPct = `${Math.min(progress * 100, 100)}%`;

  return (
    <View style={styles.wrapper}>
      <StatusBar hidden />

      <View style={[styles.container, { width: screenW, height: screenH }]}>
        {/* PLAYER */}
        <View style={[styles.playerContainer, { width: screenW, height: screenH }]}>
          <YoutubeIframe
            key={currentEpisode.youtubeId}
            ref={playerRef}
            height={screenH}
            width={screenW}
            videoId={currentEpisode.youtubeId}
            play={playing}
            forceAndroidAutoplay={true}
            onReady={onReady}
            onChangeState={(state) => {
              if (state === 'ended') goNext();
              if (state === 'playing') setPlaying(true);
              if (state === 'paused') setPlaying(false);
            }}
            initialPlayerParams={{
              modestbranding: 1,
              rel: 0,
              controls: 1,
              showinfo: 0,
              iv_load_policy: 3,
              cc_load_policy: 0,
              preventFullScreen: false,
              autoplay: 1,
            }}
            webViewStyle={{
              backgroundColor: '#000',
              width: screenW,
              height: screenH,
            }}
            webViewProps={{
              allowsFullscreenVideo: true,
              mediaPlaybackRequiresUserAction: false,
              allowsInlineMediaPlayback: false,
              scrollEnabled: false,
              bounces: false,
              overScrollMode: 'never',
              style: {
                width: screenW,
                height: screenH,
                backgroundColor: '#000',
              },
            }}
          />
        </View>

        {/* MASK ESQUERDA */}
        <View style={[styles.maskSide, { width: MASK_LEFT, height: screenH, left: 0 }]}>
          <TouchableOpacity
            style={styles.sideTouch}
            onPress={showControlsNow}
            activeOpacity={1}
          />
        </View>

        {/* MASK DIREITA */}
        <View style={[styles.maskSide, { width: MASK_RIGHT, height: screenH, right: 0 }]}>
          <TouchableOpacity
            style={styles.sideTouch}
            onPress={showControlsNow}
            activeOpacity={1}
          />
        </View>

        {/* MASK TOPO */}
        <View style={[styles.maskTop, { width: screenW, height: MASK_TOP }]}>
          {showControls && (
            <Animated.View style={[styles.topControls, { opacity: controlsOpacity }]}>
              <TouchableOpacity
                style={[
                  styles.backBtn,
                  {
                    top: BTN_TOP,
                    left: BTN_LEFT,
                    width: BTN_SIZE,
                    height: BTN_SIZE,
                    borderRadius: BTN_SIZE / 2,
                  },
                ]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>

              {episodes.length > 1 && (
                <Text
                  style={[
                    styles.epCount,
                    {
                      top: BTN_TOP + BTN_SIZE * 0.25,
                      right: screenW * 0.03,
                    },
                  ]}
                >
                  {index + 1}/{episodes.length}
                </Text>
              )}
            </Animated.View>
          )}
        </View>

        {/* MASK BASE */}
        <View style={[styles.maskBottom, { width: screenW, height: MASK_BOTTOM }]}>
          <TouchableOpacity
            style={styles.bottomTouchFill}
            onPress={showControlsNow}
            activeOpacity={1}
          />

          {showControls && (
            <Animated.View style={[styles.bottomControlsWrap, { opacity: controlsOpacity }]}>
              <View style={styles.bottomBar}>
                {index > 0 ? (
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => {
                      showControlsNow();
                      goPrev();
                    }}
                  >
                    <Ionicons name="play-skip-back" size={16} color={colors.neonGreen} />
                    <Text style={styles.navLabel}>Anterior</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.navPlaceholder} />
                )}

                <TouchableOpacity style={styles.skipBtn} onPress={() => skip(-10)}>
                  <Ionicons name="play-back" size={18} color="#fff" />
                  <Text style={styles.skipLabel}>10s</Text>
                </TouchableOpacity>

                <View style={styles.progressWrap}>
                  <View
                    style={styles.track}
                    onLayout={(e) => {
                      trackWidth.current = e.nativeEvent.layout.width;
                    }}
                    {...panResponder.panHandlers}
                  >
                    <View style={[styles.fill, { width: progressPct }]} />
                    <View style={[styles.thumb, { left: progressPct }]} />
                  </View>
                </View>

                <TouchableOpacity style={styles.skipBtn} onPress={() => skip(10)}>
                  <Ionicons name="play-forward" size={18} color="#fff" />
                  <Text style={styles.skipLabel}>10s</Text>
                </TouchableOpacity>

                {index < episodes.length - 1 ? (
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => {
                      showControlsNow();
                      goNext();
                    }}
                  >
                    <Text style={styles.navLabel}>Próximo</Text>
                    <Ionicons name="play-skip-forward" size={16} color={colors.neonGreen} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.navPlaceholder} />
                )}
              </View>
            </Animated.View>
          )}
        </View>

        {/* LOADING */}
        {!ready && (
          <View style={[styles.loadingOverlay, { width: screenW, height: screenH }]}>
            <ActivityIndicator size="large" color={colors.neonGreen} />
            <Text style={styles.loadingText}>🚀 Preparando...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
    alignSelf: 'center',
  },

  playerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  maskSide: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },

  maskTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },

  maskBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
    justifyContent: 'flex-end',
  },

  sideTouch: {
    flex: 1,
  },

  bottomTouchFill: {
    ...StyleSheet.absoluteFillObject,
  },

  topControls: {
    flex: 1,
  },

  backBtn: {
    position: 'absolute',
    zIndex: 50,
    backgroundColor: colors.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },

  epCount: {
    position: 'absolute',
    zIndex: 50,
    color: colors.neonGreen,
    fontSize: 13,
    fontWeight: '700',
  },

  bottomControlsWrap: {
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 6,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.18)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1.2,
    borderColor: 'rgba(0,255,136,0.45)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 86,
    zIndex: 50,
  },

  navPlaceholder: {
    minWidth: 86,
  },

  navLabel: {
    color: colors.neonGreen,
    fontSize: 11,
    fontWeight: '700',
  },

  skipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    minWidth: 42,
    zIndex: 50,
  },

  skipLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginTop: -2,
  },

  progressWrap: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },

  track: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    justifyContent: 'center',
  },

  fill: {
    position: 'absolute',
    left: 0,
    height: 3,
    backgroundColor: colors.neonGreen,
    borderRadius: 999,
  },

  thumb: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neonGreen,
    marginLeft: -5,
    top: -3.5,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    gap: 12,
  },

  loadingText: {
    color: '#8fa8bc',
    fontSize: 13,
  },
});