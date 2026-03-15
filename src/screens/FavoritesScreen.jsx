import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, radius } from '../theme';
import { useFavorites } from '../context/FavoritesContext';
import StarBackground from '../components/StarBackground';
import ContentCard from '../components/ContentCard';

const TABS = [
  { key: 'series', label: '📺 Séries' },
  { key: 'movie',  label: '🎬 Filmes' },
  { key: 'game',   label: '🎮 Jogos' },
];

function EmptyFavorites({ tab }) {
  const msgs = {
    series: { emoji: '📺', text: 'Nenhuma série favoritada ainda!' },
    movie:  { emoji: '🎬', text: 'Nenhum filme favoritado ainda!' },
    game:   { emoji: '🎮', text: 'Nenhum jogo favoritado ainda!' },
  };
  const { emoji, text } = msgs[tab] || msgs.series;
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{text}</Text>
      <Text style={styles.emptySubtitle}>Toque em 🔖 para favoritar conteúdos!</Text>
      <Text style={styles.astronaut}>👨‍🚀</Text>
    </View>
  );
}

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('series');

  const filtered = favorites.filter(item => {
    if (activeTab === 'game') return item.type !== 'movie' && item.type !== 'series';
    return item.type === activeTab;
  });

  function handlePress(item) {
    if (item.type === 'movie') navigation.navigate('MovieDetail', { movie: item });
    else if (item.type === 'series') navigation.navigate('SeriesDetail', { series: item });
    else navigation.navigate('GamePlayer', { game: item });
  }

  return (
    <View style={styles.container}>
      <StarBackground count={40} />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>
            Space<Text style={styles.logoAccent}>Kids</Text>
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {filtered.length === 0 ? (
          <EmptyFavorites tab={activeTab} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <ContentCard
                item={item}
                onPress={handlePress}
                variant={activeTab === 'game' ? 'game' : 'media'}
                style={styles.gridCard}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md, paddingVertical: 10,
    backgroundColor: colors.bgHeader,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    alignItems: 'center',
  },
  logoText: { color: colors.white, fontSize: 22, fontWeight: '900' },
  logoAccent: { color: colors.neonGreen },
  tabsWrap: {
    flexDirection: 'row', paddingHorizontal: spacing.md,
    paddingVertical: 12, gap: 8,
    backgroundColor: colors.bgHeader,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flex: 1, paddingVertical: 8, borderRadius: radius.xl,
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.neonGreenDim, borderColor: colors.borderBright,
  },
  tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.neonGreen },
  grid: { padding: spacing.md },
  row: { gap: 10, marginBottom: 10 },
  gridCard: { flex: 1, width: undefined, marginRight: 0 },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingHorizontal: spacing.lg,
  },
  emptyEmoji: { fontSize: 52 },
  astronaut: { fontSize: 48, marginTop: 8 },
  emptyTitle: { color: colors.white, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  emptySubtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
});