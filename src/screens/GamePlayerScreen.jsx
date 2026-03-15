import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import { colors, spacing } from '../theme';

export default function GamePlayerScreen({ route, navigation }) {
  const { game } = route.params;
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.neonGreen} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>🎮 {game.title}</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Game */}
        {!game.url && game.type === 'local' ? (
          <View style={styles.error}>
            <Text style={styles.errorEmoji}>🚧</Text>
            <Text style={styles.errorTitle}>Em breve!</Text>
            <Text style={styles.errorMsg}>
              Este jogo será integrado em breve.
            </Text>
            <TouchableOpacity style={styles.backBtnLarge} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.neonGreen} />
                <Text style={styles.loadingText}>🎮 Carregando jogo...</Text>
              </View>
            )}
            <WebView
              source={{ uri: game.url }}
              style={styles.webview}
              onLoadEnd={() => setLoading(false)}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
    flex: 1, color: colors.white, fontSize: 15,
    fontWeight: '800', textAlign: 'center',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    position: 'absolute', top: 60, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg, zIndex: 10, gap: 12,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  error: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg, padding: spacing.lg, gap: 12,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: { color: colors.white, fontSize: 18, fontWeight: '900' },
  errorMsg: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  backBtnLarge: {
    marginTop: 8, backgroundColor: colors.neonGreen,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  backBtnText: { color: colors.bg, fontWeight: '900', fontSize: 15 },
});