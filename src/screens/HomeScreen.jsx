import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Animated, Image,
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

// ─── Badge pulsante 🔴 AO VIVO ────────────────────────────────────────────────
function LiveBadge() {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.liveBadge}>
      <Animated.View style={[styles.liveDot, { opacity: anim }]} />
      <Text style={styles.liveBadgeText}>AO VIVO</Text>
    </View>
  );
}

// ─── Card de live ─────────────────────────────────────────────────────────────
function LiveCard({ live, onPress }) {
  return (
    <TouchableOpacity
      style={styles.liveCard}
      onPress={() => onPress(live)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: live.thumbnail || 'https://picsum.photos/seed/live/400/225' }}
        style={styles.liveThumb}
        resizeMode="cover"
      />
      <View style={styles.liveOverlay} />

      <View style={styles.liveInfo}>
        {/* Texto AO VIVO ou EM BREVE em destaque */}
        {live.isLive && (
          <Text style={styles.liveCardLabel}>🔴 AO VIVO</Text>
        )}
        {live.isUpcoming && !live.isLive && (
          <Text style={[styles.liveCardLabel, { color: '#ff8c00' }]}>⏳ EM BREVE</Text>
        )}
        <Text style={styles.liveTitle} numberOfLines={2}>{live.title}</Text>
        {live.isUpcoming && live.scheduledStart && (
          <Text style={styles.liveSchedule}>
            {new Date(live.scheduledStart).toLocaleString('pt-BR')}
          </Text>
        )}
      </View>

      {/* Badge pulsante no canto superior */}
      {live.isLive && (
        <View style={styles.liveBadgeWrap}>
          <LiveBadge />
        </View>
      )}

      {/* Botão play */}
      {live.isLive && (
        <View style={styles.livePlayBtn}>
          <Ionicons name="play" size={18} color="#000" />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { data, loading, getHeroItems, activeLives, upcomingLives, hasLive } = useContent();

  // ⚠️ IMPORTANTE: o app NUNCA escreve no Firebase sobre status de lives.
  // Quem atualiza isLive é exclusivamente o painel admin (spacekids.html).
  // O app só lê via onSnapshot no useContent.

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

  function handleLivePress(live) {
    // Só abre se estiver ao vivo — agendadas não são clicáveis
    if (!live.isLive) return;
    navigation.navigate('Player', {
      episodes: [{
        youtubeId: live.youtubeId,
        title: live.title,
      }],
      initialIndex: 0,
    });
  }

  // Lives visíveis: ativas primeiro, depois agendadas
  const allVisibleLives = [...activeLives, ...upcomingLives];

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
            {/* Ponto vermelho no header quando há live ativa */}
            {hasLive && (
              <View style={styles.headerLiveDot} />
            )}
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

            {/* ── SEÇÃO AO VIVO — só aparece se houver lives cadastradas ── */}
            {allVisibleLives.length > 0 && (
              <View style={styles.liveSection}>
                <View style={styles.liveSectionHeader}>
                  <View style={styles.liveSectionAccent} />
                  <Text style={styles.liveSectionTitle}>AO VIVO</Text>
                  {hasLive && <LiveBadge />}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.liveList}
                >
                  {allVisibleLives.map(live => (
                    <LiveCard
                      key={live.id}
                      live={live}
                      onPress={handleLivePress}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

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
  headerGlow: { height: 1, backgroundColor: colors.neonGreen, opacity: 0.15 },
  rocketEmoji: { fontSize: 28 },
  logoWrap: { flex: 1, alignItems: 'center' },
  astronaut: { fontSize: 20, marginBottom: -8, zIndex: 1 },
  logoText: {
    color: colors.neonGreen,
    fontSize: 24, fontWeight: '900', letterSpacing: 1,
    textShadowColor: 'rgba(0,255,136,0.9)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  headerLiveDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#ff4455',
    marginRight: 8,
    shadowColor: '#ff4455', shadowOpacity: 1, shadowRadius: 6, elevation: 4,
  },
  userBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgSection,
    borderWidth: 1.5, borderColor: colors.borderCard,
    alignItems: 'center', justifyContent: 'center',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  scroll: { paddingTop: 12 },

  // ── Seção Ao Vivo ──────────────────────────────────────────────────────────
  liveSection: { marginBottom: 8 },
  liveSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: 10,
    gap: 8,
  },
  liveSectionAccent: {
    width: 4, height: 16, backgroundColor: '#ff4455', borderRadius: 2,
  },
  liveSectionTitle: {
    color: '#ff4455', fontSize: 14, fontWeight: '900', letterSpacing: 1,
  },
  liveList: { paddingLeft: spacing.md, paddingRight: 8 },

  // ── Card de live ───────────────────────────────────────────────────────────
  liveCard: {
    width: 280, marginRight: 12,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,68,85,0.5)',
    backgroundColor: colors.bgCard,
  },
  liveThumb: { width: '100%', height: 157 },
  liveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  liveBadgeWrap: {
    position: 'absolute', top: 8, left: 8,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,68,85,0.9)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff',
  },
  liveBadgeText: {
    color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1,
  },
  liveInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  liveCardLabel: {
    color: '#ff4455',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 3,
  },
  liveTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  liveSchedule: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  livePlayBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#ff4455',
    alignItems: 'center', justifyContent: 'center',
  },
});
