import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, radius } from '../theme';
import { useFavorites } from '../context/FavoritesContext';
import StarBackground from '../components/StarBackground';

function Stars({ count = 5 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} style={{ fontSize: 16, opacity: i < count ? 1 : 0.3 }}>⭐</Text>
      ))}
    </View>
  );
}

function EpisodeCard({ episode, seriesTitle, navigation }) {
  return (
    <TouchableOpacity
      style={styles.epCard}
      onPress={() => navigation.navigate('Player', {
        youtubeId: episode.youtubeId,
        title: `${seriesTitle} — ${episode.title}`,
      })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: episode.thumbnail }} style={styles.epThumb} resizeMode="cover" />
      <View style={styles.epPlayOverlay}>
        <View style={styles.epPlayCircle}>
          <Ionicons name="play" size={12} color={colors.bg} />
        </View>
      </View>
      <Text style={styles.epTitle} numberOfLines={2}>{episode.title}</Text>
    </TouchableOpacity>
  );
}

export default function SeriesDetailScreen({ route, navigation }) {
  const { series } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(series.id);

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
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(series)}>
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={favorited ? colors.gold : colors.neonGreen}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <Image source={{ uri: series.banner }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(5,13,26,0.98)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>📺 SÉRIE</Text>
              </View>
              <Text style={styles.heroTitle}>{series.title}</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Stars count={series.rating} />
            <Text style={styles.description}>{series.description}</Text>
          </View>

          {/* Temporadas */}
          {(series.seasons || []).map(season => (
            <View key={season.id} style={styles.season}>
              <View style={styles.seasonHeader}>
                <View style={styles.seasonAccent} />
                <Text style={styles.seasonTitle}>{season.title.toUpperCase()}</Text>
              </View>
              <FlatList
                data={season.episodes}
                keyExtractor={ep => ep.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: spacing.md, paddingRight: 8 }}
                renderItem={({ item }) => (
                  <EpisodeCard
                    episode={item}
                    seriesTitle={series.title}
                    navigation={navigation}
                  />
                )}
              />
            </View>
          ))}

          <View style={{ height: 30 }} />
        </ScrollView>
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
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bgCard,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { flex: 1, textAlign: 'center', color: colors.white, fontSize: 20, fontWeight: '900' },
  logoAccent: { color: colors.neonGreen },
  favBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bgCard,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  heroCard: {
    height: 200, margin: spacing.md, borderRadius: radius.lg,
    overflow: 'hidden', borderWidth: 1.5, borderColor: colors.borderBright,
  },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroContent: { position: 'absolute', bottom: 14, left: 14, right: 14, gap: 6 },
  badge: {
    backgroundColor: colors.purple, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  heroTitle: { color: colors.gold, fontSize: 22, fontWeight: '900' },
  info: { paddingHorizontal: spacing.md, paddingVertical: 12, gap: 8 },
  description: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  season: { marginBottom: 20 },
  seasonHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, marginBottom: 10, gap: 8,
  },
  seasonAccent: {
    width: 4, height: 16, backgroundColor: colors.neonGreen, borderRadius: 2,
  },
  seasonTitle: { color: colors.neonGreen, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  epCard: {
    width: 150, marginRight: 10, backgroundColor: colors.bgCard,
    borderRadius: radius.md, overflow: 'hidden',
    borderWidth: 1.5, borderColor: colors.border,
  },
  epThumb: { width: '100%', height: 90 },
  epPlayOverlay: { position: 'absolute', top: 4, right: 4 },
  epPlayCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.neonGreen, alignItems: 'center', justifyContent: 'center',
  },
  epTitle: { color: colors.white, fontSize: 11, fontWeight: '700', padding: 8, lineHeight: 15 },
});