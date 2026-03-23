import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { colors } from '../theme';

export default function GameCircles({ games = [], onPress, onPressMore }) {
  // Pega os 8 mais jogados
  const top8 = [...games]
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 8);

  if (!top8.length) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {top8.map(game => (
          <TouchableOpacity
            key={game.id}
            style={styles.item}
            onPress={() => onPress(game)}
            activeOpacity={0.8}
          >
            <View style={styles.circle}>
              <Image
                source={{ uri: game.icon || game.thumbnail }}
                style={styles.icon}
                resizeMode="cover"
            />
            </View>
            <Text style={styles.label} numberOfLines={1}>{game.title}</Text>
          </TouchableOpacity>
        ))}

        {/* Botão + mais jogos */}
        <TouchableOpacity
          style={styles.item}
          onPress={onPressMore}
          activeOpacity={0.8}
        >
          <View style={[styles.circle, styles.moreCircle]}>
            <Text style={styles.moreIcon}>🎮</Text>
          </View>
          <Text style={styles.label}>Ver mais</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    gap: 5,
    width: 62,
  },
  circle: {
    width: 56, height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.borderBright,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    shadowColor: colors.neonGreen,
    shadowRadius: 8,
    shadowOpacity: 0.4,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  moreCircle: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleDim,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purple,
  },
  moreIcon: {
    fontSize: 24,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    width: '100%',
  },
});