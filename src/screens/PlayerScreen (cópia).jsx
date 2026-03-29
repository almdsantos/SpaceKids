import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, StatusBar, Dimensions, Platform,
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
  const playerRef = useRef(null);

  const currentEpisode = episodes[index];

  const { width, height } = useScreenDimensions();
  const screenW = Math.max(width, height);
  const screenH = Math.min(width, height);

  // ─── Ajuste os masks em % da tela (0.0 a 1.0) ───────────────────────────────
  const MASK_TOP    = screenH * 0.45;  // % da altura
  const MASK_BOTTOM = screenH * 0.35;  // % da altura
  const MASK_LEFT   = screenW * 0.45;  // % da largura
  const MASK_RIGHT  = screenW * 0.45;  // % da largura
  // ─────────────────────────────────────────────────────────────────────────────

  // Posição do botão voltar + header bar
  const BTN_TOP  = screenH * 0.04;
  const BTN_LEFT = screenW * 0.03;
  const BTN_SIZE = 48;

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
  }, [index]);

  function onReady() {
    setReady(true);
    setPlaying(true);
  }

  function goNext() {
    if (index < episodes.length - 1) setIndex(index + 1);
    else navigation.goBack();
  }

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar hidden />
      <View style={[styles.container, { width: screenW, height: screenH }]}>

        {/* Player */}
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
            webViewStyle={{ backgroundColor: '#000', width: screenW, height: screenH }}
            webViewProps={{
              allowsFullscreenVideo: true,
              mediaPlaybackRequiresUserAction: false,
              allowsInlineMediaPlayback: false,
              scrollEnabled: false,
              bounces: false,
              overScrollMode: 'never',
              style: { width: screenW, height: screenH, backgroundColor: '#000' },
            }}
          />
        </View>

        {/* ── MASK ESQUERDA ── */}
        <View style={[styles.maskSide, { width: MASK_LEFT, height: screenH, left: 0 }]} />

        {/* ── MASK DIREITA ── */}
        <View style={[styles.maskSide, { width: MASK_RIGHT, height: screenH, right: 0 }]} />

        {/* ── MASK TOPO ── */}
        <View style={[styles.maskTop, { width: screenW, height: MASK_TOP }]} />

        {/* ── MASK BASE ── */}
        <View style={[styles.maskBottom, { width: screenW, height: MASK_BOTTOM }]}>
          {index > 0 && (
            <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
              <Ionicons name="play-skip-back" size={18} color={colors.neonGreen} />
              <Text style={styles.navLabel}>Anterior</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {index < episodes.length - 1 && (
            <TouchableOpacity style={styles.navBtn} onPress={goNext}>
              <Text style={styles.navLabel}>Próximo</Text>
              <Ionicons name="play-skip-forward" size={18} color={colors.neonGreen} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── BOTÃO VOLTAR — flutua sobre tudo ── */}
        <TouchableOpacity
          style={[styles.backBtn, { top: BTN_TOP, left: BTN_LEFT, width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* ── TÍTULO ao lado do botão voltar ── */}
        <Text
          style={[styles.epTitle, {
            top: BTN_TOP + BTN_SIZE * 0.2,           // alinha verticalmente com o botão
            left: BTN_LEFT + BTN_SIZE + 12,           // logo à direita do botão
            right: screenW * 0.12,                    // não encostar no contador
          }]}
          numberOfLines={1}
        >
          {currentEpisode.title}
        </Text>

        {/* ── CONTADOR — canto superior direito ── */}
        {episodes.length > 1 && (
          <Text style={[styles.epCount, { top: BTN_TOP + BTN_SIZE * 0.25, right: screenW * 0.03 }]}>
            {index + 1}/{episodes.length}
          </Text>
        )}

        {/* Loading */}
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
    top: 0, left: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  // ── Masks ─────────────────────────────────────────────────────────────────────
  maskSide: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  maskTop: {
    position: 'absolute',
    top: 0, left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0, left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.001)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },

  // ── Botão voltar ──────────────────────────────────────────────────────────────
  backBtn: {
    position: 'absolute',
    zIndex: 50,
    backgroundColor: colors.neonGreen,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Título e contador — flutuam sobre o mask topo ─────────────────────────────
  epTitle: {
    position: 'absolute',
    zIndex: 50,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  epCount: {
    position: 'absolute',
    zIndex: 50,
    color: colors.neonGreen,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Nav buttons ───────────────────────────────────────────────────────────────
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.5, borderColor: 'rgba(0,255,136,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    zIndex: 50,
  },
  navLabel: {
    color: colors.neonGreen,
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Loading ───────────────────────────────────────────────────────────────────
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0,
    backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 30, gap: 12,
  },
  loadingText: { color: '#8fa8bc', fontSize: 13 },
});