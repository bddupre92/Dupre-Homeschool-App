"use client";
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native-web';
import BoardCard from './BoardCard';
import BoardCreationModal from './BoardCreationModal';
import Link from 'next/link';

interface Board {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  postCount: number;
  coverImage?: string;
}

const BoardsGrid: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch boards from API
      const response = await fetch('/api/boards');
      
      if (!response.ok) {
        throw new Error('Failed to fetch boards');
      }
      
      const data = await response.json();
      setBoards(data);
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError('Failed to load boards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (name: string, description: string, isPrivate: boolean) => {
    try {
      // In a real app, we would get the userId from auth context
      // For now, we'll use a placeholder
      const userId = 'temp-user-id';

      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          description,
          isPrivate: isPrivate ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create board');
      }

      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
      setIsModalVisible(false);
    } catch (err) {
      console.error('Error creating board:', err);
      alert('Failed to create board. Please try again.');
    }
  };

  const handleBoardPress = (boardId: string) => {
    // In a real app, navigate to board detail page
    console.log('Board pressed:', boardId);
    window.location.href = `/boards/${boardId}`;
  };

  if (loading && boards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading boards...</Text>
      </View>
    );
  }

  if (error && boards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBoards}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Boards</Text>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {boards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any boards yet</Text>
          <Text style={styles.emptySubtext}>
            Create a board to save and organize your favorite posts
          </Text>
          <TouchableOpacity 
            style={styles.createFirstButton} 
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.createFirstButtonText}>Create Your First Board</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px' 
        }}>
          {boards.map(board => (
            <Link href={`/boards/${board.id}`} key={board.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                padding: '16px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{board.name}</h3>
                <p style={{ color: '#666', marginBottom: '16px', flexGrow: 1 }}>{board.description}</p>
                <div style={{ fontSize: '14px', color: '#888' }}>{board.postCount} pins</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BoardCreationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreateBoard={handleCreateBoard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  gridContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  boardCardContainer: {
    width: '48%',
    marginBottom: 16,
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
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BoardsGrid;
