import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, glow } from '../theme';

export default function ContentCard({ item, onPress, variant = 'media', style }) {
  if (variant === 'game') {
    return (
      <TouchableOpacity
        style={[styles.gameCard, style]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.gameThumbnail} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(3,11,24,0.95)']}
          style={styles.gameGradient}
        />
        <View style={styles.playOverlay}>
          <View style={styles.playCircle}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle} numberOfLines={2}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.mediaCard, style]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.mediaThumbnail} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(3,11,24,0.9)']}
        style={styles.mediaGradient}
      />
      <View style={styles.playOverlay}>
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaTitle} numberOfLines={2}>{item.title}</Text>
        {item.type && (
          <Text style={styles.mediaType}>
            {item.type === 'movie' ? '🎬' : '📺'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mediaCard: {
    width: 130,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.borderCard,
    marginRight: 10,
    ...glow.green,
  },
  mediaThumbnail: { width: '100%', height: 190 },
  mediaGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
  },
  mediaInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 8, flexDirection: 'row',
    alignItems: 'flex-end', justifyContent: 'space-between',
  },
  mediaTitle: {
    color: colors.white, fontSize: 11,
    fontWeight: '800', flex: 1, letterSpacing: 0.2,
    textShadowColor: '#000', textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  mediaType: { fontSize: 12, marginLeft: 4 },

  gameCard: {
    width: 130,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.borderCard,
    marginRight: 10,
    ...glow.green,
  },
  gameThumbnail: { width: '100%', height: 100 },
  gameGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
  },
  gameInfo: { padding: 7 },
  gameTitle: {
    color: colors.white, fontSize: 10,
    fontWeight: '800', letterSpacing: 0.2,
  },

  playOverlay: { position: 'absolute', top: 6, right: 6 },
  playCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.neonGreen,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.neonGreen,
    shadowRadius: 8, shadowOpacity: 0.9,
  },
  playIcon: {
    color: '#030b18', fontSize: 9,
    fontWeight: '900', marginLeft: 2,
  },
});