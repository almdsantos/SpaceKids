import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius } from '../theme';
import { useContent } from '../hooks/useContent';
import StarBackground from '../components/StarBackground';
import ContentCard from '../components/ContentCard';

export default function SearchScreen({ navigation }) {
  const { data } = useContent();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || !data) return [];
    const q = query.toLowerCase();
    const movies = (data.movies || []).filter(m => m.title.toLowerCase().includes(q));
    const series = (data.series || []).filter(s => s.title.toLowerCase().includes(q));
    const ed = (data.games?.educational || []).filter(g => g.title.toLowerCase().includes(q));
    const pz = (data.games?.puzzle || []).filter(g => g.title.toLowerCase().includes(q));
    const ar = (data.games?.arcade || []).filter(g => g.title.toLowerCase().includes(q));
    const feat = data.games?.featured && data.games.featured.title.toLowerCase().includes(q)
      ? [data.games.featured] : [];
    return [...movies, ...series, ...feat, ...ed, ...pz, ...ar];
  }, [query, data]);

  function handlePress(item) {
    Keyboard.dismiss();
    if (item.type === 'movie') navigation.navigate('MovieDetail', { movie: item });
    else if (item.type === 'series') navigation.navigate('SeriesDetail', { series: item });
    else navigation.navigate('GamePlayer', { game: item });
  }

  const isGame = (item) => item.type !== 'movie' && item.type !== 'series';

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

        {/* Search Input */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.neonGreen} />
            <TextInput
              style={styles.input}
              placeholder="Buscar filmes, séries, jogos..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results */}
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Busque no universo SpaceKids</Text>
            <Text style={styles.emptySubtitle}>Filmes, séries e jogos esperando por você!</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👨‍🚀</Text>
            <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
            <Text style={styles.emptySubtitle}>Tente buscar por outro nome</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <ContentCard
                  item={item}
                  onPress={handlePress}
                  variant={isGame(item) ? 'game' : 'media'}
                  style={styles.gridCard}
                />
              )}
            />
          </>
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
  searchWrap: {
    padding: spacing.md, backgroundColor: colors.bgHeader,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: colors.borderBright,
    paddingHorizontal: 14, paddingVertical: 10, gap: 10,
  },
  input: { flex: 1, color: colors.white, fontSize: 14, fontWeight: '600' },
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingHorizontal: spacing.lg,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { color: colors.white, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  emptySubtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  resultsCount: {
    color: colors.textMuted, fontSize: 12, fontWeight: '700',
    paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 4,
  },
  grid: { padding: spacing.md, paddingTop: 8 },
  row: { gap: 10, marginBottom: 10 },
  gridCard: { flex: 1, width: undefined, marginRight: 0 },
});