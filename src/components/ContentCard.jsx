import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

export default function ContentCard({ item, onPress, variant = 'media', style }) {
  if (variant === 'game') {
    return (
      <TouchableOpacity
        style={[styles.gameCard, style]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.gameThumbnail} resizeMode="cover" />
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
    width: 130, borderRadius: radius.md, overflow: 'hidden',
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, marginRight: 10,
  },
  mediaThumbnail: { width: '100%', height: 190 },
  mediaInfo: {
    padding: 8, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  mediaTitle: { color: colors.white, fontSize: 11, fontWeight: '800', flex: 1 },
  mediaType: { fontSize: 12, marginLeft: 4 },

  gameCard: {
    width: 130, borderRadius: radius.md, overflow: 'hidden',
    backgroundColor: colors.bgCard, borderWidth: 1.5,
    borderColor: colors.border, marginRight: 10,
  },
  gameThumbnail: { width: '100%', height: 100 },
  gameInfo: { padding: 7 },
  gameTitle: { color: colors.white, fontSize: 10, fontWeight: '800' },

  playOverlay: { position: 'absolute', top: 4, right: 4 },
  playCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,255,136,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { color: '#050d1a', fontSize: 9, fontWeight: '900', marginLeft: 1 },
});