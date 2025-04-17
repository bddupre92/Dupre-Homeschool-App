import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native-web';
import PostCard from './PostCard';
import FilterBar from './FilterBar';

// Sample data for filters
const GRADES = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'High School'];
const SUBJECTS = ['Math', 'Science', 'Language Arts', 'Reading', 'Writing', 'History', 'Social Studies', 'Art', 'Music', 'Physical Education', 'Foreign Language'];
const APPROACHES = ['Classical', 'Charlotte Mason', 'Montessori', 'Waldorf', 'Unschooling', 'Eclectic', 'Traditional', 'Unit Studies', 'Special Needs'];

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
}

const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    grades: [] as string[],
    subjects: [] as string[],
    approaches: [] as string[],
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      
      if (filters.grades.length > 0) {
        queryParams.append('grades', JSON.stringify(filters.grades));
      }
      
      if (filters.subjects.length > 0) {
        queryParams.append('subjects', JSON.stringify(filters.subjects));
      }
      
      if (filters.approaches.length > 0) {
        queryParams.append('approaches', JSON.stringify(filters.approaches));
      }

      // Fetch posts from API
      const response = await fetch(`/api/posts?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleFiltersChange = (newFilters: {
    grades: string[];
    subjects: string[];
    approaches: string[];
  }) => {
    setFilters(newFilters);
  };

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

  const handleSave = (postId: string) => {
    // In a real app, call API to save post to board
    console.log('Save post:', postId);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterBar
        grades={GRADES}
        subjects={SUBJECTS}
        approaches={APPROACHES}
        onFiltersChange={handleFiltersChange}
      />

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters or check back later for new content
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.id)}
              onLike={() => handleLike(item.id)}
              onComment={() => handleComment(item.id)}
              onSave={() => handleSave(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
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
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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

export default HomeFeed;
