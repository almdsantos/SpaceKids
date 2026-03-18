import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function GamePlayerScreen({ route, navigation }) {
  const { game } = route.params;
  const [loading, setLoading] = useState(true);
  const isLandscape = game.orientation === 'landscape';

  useEffect(() => {
    // Esconde a status bar
    StatusBar.setHidden(true);

    if (isLandscape) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }

    return () => {
      StatusBar.setHidden(false);
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  return (
    <View style={styles.container}>

      {/* Botão voltar flutuante */}
      <TouchableOpacity
        style={styles.floatingBack}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={colors.neonGreen} />
      </TouchableOpacity>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.neonGreen} />
          <Text style={styles.loadingText}>🎮 Carregando jogo...</Text>
        </View>
      )}

      {/* Game — ocupa tela toda */}
      <WebView
        source={{ uri: game.url }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  floatingBack: {
    position: 'absolute',
    top: 10, left: 10,
    zIndex: 999,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1.5, borderColor: 'rgba(0,255,136,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg, zIndex: 10, gap: 12,
  },
  loadingText: { color: '#8fa8bc', fontSize: 14 },
});