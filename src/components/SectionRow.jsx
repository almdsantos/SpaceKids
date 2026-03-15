import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import ContentCard from './ContentCard';

export default function SectionRow({ title, data = [], onPress, variant = 'media' }) {
  if (!data.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View style={styles.titleAccent} />
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
  section: { marginBottom: 20 },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, marginBottom: 10, gap: 8,
  },
  titleAccent: {
    width: 4, height: 18, backgroundColor: colors.neonGreen,
    borderRadius: 2, shadowColor: colors.neonGreen,
    shadowRadius: 6, shadowOpacity: 0.9,
  },
  title: {
    color: colors.neonGreen, fontSize: 16, fontWeight: '900',
    letterSpacing: 1, textTransform: 'uppercase',
    textShadowColor: 'rgba(0,255,136,0.4)',
    textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 },
  },
  list: { paddingLeft: spacing.md, paddingRight: spacing.sm },
});