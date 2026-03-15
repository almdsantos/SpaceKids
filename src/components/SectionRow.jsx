import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import ContentCard from './ContentCard';

export default function SectionRow({ title, data = [], onPress, variant = 'media' }) {
  if (!data.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View style={styles.titleAccentWrap}>
          <View style={styles.titleAccent} />
          <View style={styles.titleAccentGlow} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ContentCard item={item} onPress={onPress} variant={variant} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: 12,
    gap: 10,
  },
  titleAccentWrap: {
    position: 'relative',
    width: 4,
    height: 20,
  },
  titleAccent: {
    width: 4,
    height: 20,
    backgroundColor: colors.neonGreen,
    borderRadius: 2,
  },
  titleAccentGlow: {
    position: 'absolute',
    top: 0, left: -3,
    width: 10,
    height: 20,
    backgroundColor: colors.neonGreen,
    borderRadius: 5,
    opacity: 0.25,
  },
  title: {
    color: colors.neonGreen,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,255,136,0.5)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  list: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
});