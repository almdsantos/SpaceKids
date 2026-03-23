import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, radius } from '../theme';
import { useContent } from '../hooks/useContent';
import { useFavorites } from '../context/FavoritesContext';
import StarBackground from '../components/StarBackground';
import ContentCard from '../components/ContentCard';

function Stars({ count = 5 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} style={{ fontSize: 16, opacity: i < count ? 1 : 0.3 }}>⭐</Text>
      ))}
    </View>
  );
}

export default function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;
  const { data } = useContent();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);
  const recommended = (data?.movies || []).filter(m => m.id !== movie.id);

  function handleMoviePress(item) {
    navigation.replace('MovieDetail', { movie: item });
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
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(movie)}>
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={favorited ? colors.gold : colors.neonGreen}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <Image source={{ uri: movie.banner }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(5,13,26,0.2)', 'rgba(5,13,26,0.5)']}
              style={StyleSheet.absoluteFillObject}
            />
            <TouchableOpacity
              style={styles.playCircle}
              onPress={() => navigation.navigate('Player', {
                youtubeId: movie.youtubeId,
                title: movie.title,
              })}
            >
              <Ionicons name="play" size={32} color={colors.bg} />
            </TouchableOpacity>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🎬 FILME</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.title}>{movie.title}</Text>
            <Stars count={movie.rating} />
            <Text style={styles.description}>{movie.description}</Text>
          </View>

          {/* Recomendados */}
          {recommended.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>FILMES RECOMENDADOS</Text>
              </View>
              <FlatList
                data={recommended}
                keyExtractor={i => i.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: spacing.md, paddingRight: 8 }}
                renderItem={({ item }) => (
                  <ContentCard item={item} onPress={handleMoviePress} variant="media" />
                )}
              />
            </View>
          )}

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
    height: 220, borderRadius: 0,
    overflow: 'hidden', borderBottomWidth: 1.5, borderColor: colors.borderBright,
    alignItems: 'center', justifyContent: 'center',
  },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  playCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: colors.neonGreen,
    alignItems: 'center', justifyContent: 'center', paddingLeft: 4,
  },
  heroBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: colors.purple, paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 20,
  },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  info: { paddingHorizontal: spacing.md, paddingBottom: 20, gap: 10 },
  title: { color: colors.white, fontSize: 24, fontWeight: '900' },
  description: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, marginBottom: 10, gap: 8,
  },
  sectionAccent: {
    width: 4, height: 16, backgroundColor: colors.neonGreen,
    borderRadius: 2,
  },
  sectionTitle: { color: colors.neonGreen, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});