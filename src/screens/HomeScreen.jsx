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

export default function HomeScreen({ navigation }) {
  const { data, loading, getHeroItems } = useContent();

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
        <View style={styles.header}>
          <RocketEasterEgg>
            <View style={styles.rocketBtn}>
              <Text style={styles.rocketEmoji}>🚀</Text>
            </View>
          </RocketEasterEgg>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>
              Space<Text style={styles.logoAccent}>Kids</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <Ionicons name="search" size={22} color={colors.neonGreen} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.neonGreen} />
            <Text style={styles.loadingText}>Carregando o universo... 🌌</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            <HeroBanner items={getHeroItems(3)} onPress={handleItemPress} />

            <SectionRow
              title="Séries"
              data={data?.series || []}
              onPress={handleItemPress}
              variant="media"
            />

            <SectionRow
              title="Filmes"
              data={data?.movies || []}
              onPress={handleItemPress}
              variant="media"
            />

            <TouchableOpacity
              style={styles.gamesBtn}
              onPress={() => navigation.navigate('GamesScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.gamesBtnEmoji}>🎮</Text>
              <Text style={styles.gamesBtnText}>Ver todos os Jogos</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.neonGreen} />
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        )}
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
  rocketBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  rocketEmoji: { fontSize: 20 },
  logoWrap: { flex: 1, alignItems: 'center' },
  logoText: { color: colors.white, fontSize: 22, fontWeight: '900' },
  logoAccent: {
    color: colors.neonGreen,
    textShadowColor: 'rgba(0,255,136,0.5)',
    textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 },
  },
  searchBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  scroll: { paddingTop: 8 },
  gamesBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.md, marginTop: 8,
    padding: 14, backgroundColor: colors.bgCard,
    borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, gap: 10,
  },
  gamesBtnEmoji: { fontSize: 22 },
  gamesBtnText: { flex: 1, color: colors.white, fontSize: 15, fontWeight: '800' },
});