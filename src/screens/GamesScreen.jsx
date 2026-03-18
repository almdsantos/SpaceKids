import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, radius } from '../theme';
import { useContent } from '../hooks/useContent';
import { useFavorites } from '../context/FavoritesContext';
import StarBackground from '../components/StarBackground';
import SectionRow from '../components/SectionRow';

export default function GamesScreen({ navigation }) {
  const { data, loading } = useContent();
  const { toggleFavorite, isFavorite } = useFavorites();
  const games = data?.games;

  function handleGamePress(game) {
    navigation.navigate('GamePlayer', { game });
  }

  return (
    <View style={styles.container}>
      <StarBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.neonGreen} />
          </TouchableOpacity>
          <Text style={styles.logoText}>
            Space<Text style={styles.logoAccent}>Kids</Text>
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.neonGreen} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Hero Game */}
            {games?.featured && (
              <TouchableOpacity
                style={styles.heroCard}
                onPress={() => handleGamePress(games.featured)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: games.featured.banner }} style={styles.heroImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(5,13,26,0.7)', 'rgba(5,13,26,0.98)']}
                  style={styles.heroGradient}
                />
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>🔥 MAIS JOGADO</Text>
                </View>

                {/* Botão favoritar */}
                <TouchableOpacity
                  style={styles.heroFavBtn}
                  onPress={() => toggleFavorite({ ...games.featured, type: 'game' })}
                >
                  <Ionicons
                    name={isFavorite(games.featured.id) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={isFavorite(games.featured.id) ? colors.gold : colors.neonGreen}
                  />
                </TouchableOpacity>

                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle}>{games.featured.title}</Text>
                  <Text style={styles.heroDesc} numberOfLines={2}>{games.featured.description}</Text>
                  <View style={styles.heroPlayBtn}>
                    <Text style={styles.heroPlayText}>▶  Jogar Agora</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <SectionRow title="Jogos Educativos" data={games?.educational || []} onPress={handleGamePress} variant="game" />
            <SectionRow title="Puzzle Challenges" data={games?.puzzle || []} onPress={handleGamePress} variant="game" />
            <SectionRow title="Arcade Action" data={games?.arcade || []} onPress={handleGamePress} variant="game" />

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
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingTop: 8 },
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
  logoText: { flex: 1, textAlign: 'center', color: colors.white, fontSize: 22, fontWeight: '900' },
  logoAccent: { color: colors.neonGreen },
  heroCard: {
    marginHorizontal: spacing.md, marginBottom: 20,
    borderRadius: radius.lg, overflow: 'hidden', height: 200,
    borderWidth: 1.5, borderColor: colors.borderBright,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' },
  heroBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: '#ff6b00', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 20,
  },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  heroFavBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1.5, borderColor: colors.borderCard,
    alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  heroTitle: { color: colors.gold, fontSize: 20, fontWeight: '900', marginBottom: 4 },
  heroDesc: { color: colors.textSecondary, fontSize: 11, marginBottom: 10 },
  heroPlayBtn: {
    backgroundColor: colors.neonGreen, paddingHorizontal: 18,
    paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start',
  },
  heroPlayText: { color: '#050d1a', fontWeight: '900', fontSize: 13 },
});