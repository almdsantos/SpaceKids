import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../theme';
import { useContent } from '../hooks/useContent';
import StarBackground from '../components/StarBackground';
import HeroBanner from '../components/HeroBanner';
import SectionRow from '../components/SectionRow';
import RocketEasterEgg from '../components/RocketEasterEgg';
import GameCircles from '../components/GameCircles';

export default function HomeScreen({ navigation }) {
  const { data, loading, getHeroItems } = useContent();

  const allGames = [
    ...(data?.games?.featured ? [data.games.featured] : []),
    ...(data?.games?.arcade || []),
    ...(data?.games?.educational || []),
    ...(data?.games?.puzzle || []),
  ].filter((game, index, self) => 
    index === self.findIndex(g => g.id === game.id)
  );

  function handleItemPress(item) {
    if (item.type === 'movie') {
      navigation.navigate('MovieDetail', { movie: item });
    } else {
      navigation.navigate('SeriesDetail', { series: item });
    }
  }

  return (
    <View style={styles.container}>
      <StarBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.headerWrap}>
          <View style={styles.header}>
            <RocketEasterEgg>
              <Text style={styles.rocketEmoji}>🚀</Text>
            </RocketEasterEgg>
            <View style={styles.logoWrap}>
              <Text style={styles.astronaut}>👨‍🚀</Text>
              <Text style={styles.logoText}>SpaceKids</Text>
            </View>
            <TouchableOpacity style={styles.userBtn}>
              <Ionicons name="person" size={20} color={colors.neonGreen} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerGlow} />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.neonGreen} />
            <Text style={styles.loadingText}>Carregando o universo... 🌌</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {/* Hero Banner */}
            <HeroBanner items={getHeroItems(3)} onPress={handleItemPress} />

            {/* Game Circles */}
            <GameCircles
              games={allGames}
              onPress={(game) => navigation.navigate('GamePlayer', { game })}
              onPressMore={() => navigation.navigate('GamesScreen')}
            />

            {/* Séries */}
            <SectionRow
              title="Séries"
              data={data?.series || []}
              onPress={handleItemPress}
              variant="media"
            />

            {/* Filmes */}
            <SectionRow
              title="Filmes"
              data={data?.movies || []}
              onPress={handleItemPress}
              variant="media"
            />

            <View style={{ height: 24 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  headerWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.bgHeader,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.borderBright,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.neonGreen,
    shadowRadius: 16,
    shadowOpacity: 0.5,
    elevation: 10,
  },
  headerGlow: {
    height: 1,
    backgroundColor: colors.neonGreen,
    opacity: 0.15,
  },
  rocketEmoji: { fontSize: 28 },
  logoWrap: { flex: 1, alignItems: 'center' },
  astronaut: { fontSize: 20, marginBottom: -8, zIndex: 1 },
  logoText: {
    color: colors.neonGreen,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,255,136,0.9)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  userBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgSection,
    borderWidth: 1.5, borderColor: colors.borderCard,
    alignItems: 'center', justifyContent: 'center',
  },
  loading: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  scroll: { paddingTop: 12 },
});