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

// CSS injetado para esconder elementos do YouTube
function getHideElementsJS() {
  return `
    (function() {
      var style = document.createElement('style');
      style.innerHTML = \`
        .ytp-chrome-top,
        .ytp-show-cards-title,
        .ytp-cards-button,
        .ytp-cards-teaser,
        .ytp-ce-element,
        .ytp-endscreen-element,
        .ytp-pause-overlay,
        .ytp-watermark,
        .ytp-youtube-button,
        .ytp-fullscreen-button,
        .ytp-share-button,
        .branding-img,
        .ytp-impression-link,
        .iv-branding,
        .ytp-cards-button-arrow,
        .annotation { 
          display: none !important; 
          opacity: 0 !important;
          pointer-events: none !important;
        }
      \`;
      document.head.appendChild(style);

      var iframe = document.querySelector('iframe');
      if (iframe) {
        var requestFS = iframe.requestFullscreen 
          || iframe.webkitRequestFullscreen 
          || iframe.mozRequestFullScreen;
        if (requestFS) requestFS.call(iframe);
      }
    })();
    true;
  `;
}

export default function PlayerScreen({ route, navigation }) {
  const { youtubeId, title } = route.params;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const { width, height } = useScreenDimensions();
  const screenW = Math.max(width, height);
  const screenH = Math.min(width, height);

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

  function onReady() {
    setReady(true);
    setPlaying(true);
    setTimeout(() => {
      playerRef.current?.injectJavaScript(getHideElementsJS());
    }, 800);
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar hidden />

      <View style={[styles.container, { width: screenW, height: screenH }]}>

        {/* Player */}
        <View
          style={[styles.playerContainer, { width: screenW, height: screenH }]}
          pointerEvents="box-none"
        >
          <YoutubeIframe
            ref={playerRef}
            height={screenH}
            width={screenW}
            videoId={youtubeId}
            play={playing}
            forceAndroidAutoplay={true}
            onReady={onReady}
            onChangeState={(state) => {
              if (state === 'ended') setPlaying(false);
            }}
            initialPlayerParams={{
              modestbranding: 1,
              rel: 0,
              controls: 1,
              showinfo: 0,
              iv_load_policy: 3,  // esconde anotações
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

        {/* Botão voltar */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.neonGreen} />
        </TouchableOpacity>

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
  backBtn: {
    position: 'absolute',
    top: 12, left: 12,
    zIndex: 999,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1.5, borderColor: 'rgba(0,255,136,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0,
    backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10, gap: 12,
  },
  loadingText: { color: '#8fa8bc', fontSize: 13 },
});