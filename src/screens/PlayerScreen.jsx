import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { colors, spacing } from '../theme';

function buildPlayer(youtubeId) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#000; width:100vw; height:100vh; overflow:hidden; }
  iframe { width:100%; height:100%; border:none; }
</style>
</head>
<body>
<iframe
  src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1"
  allow="autoplay; fullscreen; encrypted-media"
  allowfullscreen>
</iframe>
</body>
</html>
  `;
}

export default function PlayerScreen({ route, navigation }) {
  const { youtubeId, title } = route.params;
  const [ready, setReady] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.neonGreen} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Player */}
        <View style={styles.playerWrap}>
          {!ready && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.neonGreen} />
              <Text style={styles.loadingText}>🚀 Preparando...</Text>
            </View>
          )}
          <WebView
            source={{ html: buildPlayer(youtubeId) }}
            style={styles.webview}
            onLoadEnd={() => setReady(true)}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            mixedContentMode="always"
          />
        </View>

        {/* Fun area */}
        <View style={styles.funArea}>
          <Text style={styles.funEmoji}>🌟</Text>
          <Text style={styles.funText}>Aproveite a aventura espacial!</Text>
          <Text style={styles.funTitle} numberOfLines={2}>{title}</Text>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: 10,
    backgroundColor: colors.bgHeader,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  title: {
    flex: 1, color: colors.white, fontSize: 14,
    fontWeight: '800', textAlign: 'center', paddingHorizontal: 8,
  },
  playerWrap: {
    width: '100%', height: 280,
    backgroundColor: '#000', position: 'relative',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bg, alignItems: 'center',
    justifyContent: 'center', zIndex: 10, gap: 12,
  },
  loadingText: { color: colors.textSecondary, fontSize: 13 },
  funArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg, gap: 8, paddingHorizontal: spacing.lg,
  },
  funEmoji: { fontSize: 40 },
  funText: { color: colors.textMuted, fontSize: 13 },
  funTitle: {
    color: colors.white, fontSize: 16, fontWeight: '900',
    textAlign: 'center',
  },
});