import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native-web';
import PostCard from '../Feed/PostCard';

interface BoardDetailProps {
  boardId: string;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: string;
  userId: string;
  grades: string;
  subjects: string;
  approaches: string;
  createdAt: number;
  boardPostId: string;
  note?: string;
  position: number;
}

interface Board {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  userId: string;
  createdAt: number;
  updatedAt: number;
  postCount: number;
}

const BoardDetail: React.FC<BoardDetailProps> = ({ boardId }) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoardDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch board details from API
      const response = await fetch(`/api/boards/${boardId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch board details');
      }
      
      const data = await response.json();
      setBoard(data);
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching board details:', err);
      setError('Failed to load board details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardDetails();
  }, [boardId]);

  const handlePostPress = (postId: string) => {
    // In a real app, navigate to post detail page
    console.log('Post pressed:', postId);
  };

  const handleLike = (postId: string) => {
    // In a real app, call API to like post
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    // In a real app, navigate to comments or open comment modal
    console.log('Comment on post:', postId);
  };

  const handleRemoveFromBoard = async (boardPostId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/posts/${boardPostId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove post from board');
      }

      // Remove post from state
      setPosts(posts.filter(post => post.boardPostId !== boardPostId));
    } catch (err) {
      console.error('Error removing post from board:', err);
      alert('Failed to remove post from board. Please try again.');
    }
  };

  const renderPostNote = (note?: string) => {
    if (!note) return null;

    return (
      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Your Note:</Text>
        <Text style={styles.noteText}>{note}</Text>
      </View>
    );
  };

  if (loading && !board) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading board details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBoardDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!board) {
    return (
      <View style={styles.centerContainer}>
        <Text>Board not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.boardName}>{board.name}</Text>
        {board.description && (
          <Text style={styles.description}>{board.description}</Text>
        )}
        <View style={styles.boardInfo}>
          <Text style={styles.postCount}>
            {board.postCount} {board.postCount === 1 ? 'item' : 'items'}
          </Text>
          {board.isPrivate && (
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeText}>Private</Text>
            </View>
          )}
        </View>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts in this board yet</Text>
          <Text style={styles.emptySubtext}>
            Save posts to this board while browsing the feed
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.boardPostId}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              {renderPostNote(item.note)}
              <PostCard
                post={item}
                onPress={() => handlePostPress(item.id)}
                onLike={() => handleLike(item.id)}
                onComment={() => handleComment(item.id)}
                onSave={() => handleRemoveFromBoard(item.boardPostId)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  boardName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  boardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  privateBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  privateBadgeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  listContent: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
  },
  noteContainer: {
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#92400e',
  },
  noteText: {
    fontSize: 14,
    color: '#78350f',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BoardDetail;
