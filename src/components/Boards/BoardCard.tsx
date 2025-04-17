import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native-web';

interface BoardCardProps {
  board: {
    id: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    postCount: number;
    coverImage?: string;
  };
  onPress: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.coverContainer}>
        {board.coverImage ? (
          <Image source={{ uri: board.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>{board.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        {board.isPrivate && (
          <View style={styles.privateBadge}>
            <Text style={styles.privateBadgeText}>Private</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.boardName} numberOfLines={1}>{board.name}</Text>
        {board.description && (
          <Text style={styles.description} numberOfLines={2}>
            {board.description}
          </Text>
        )}
        <Text style={styles.postCount}>
          {board.postCount} {board.postCount === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: '100%',
  },
  coverContainer: {
    position: 'relative',
    height: 160,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  privateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  privateBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  boardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default BoardCard;
