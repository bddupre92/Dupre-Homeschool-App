import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native-web';
import SaveToBoardModal from './SaveToBoardModal';
import BoardCreationModal from './BoardCreationModal';

interface SavePostButtonProps {
  postId: string;
}

const SavePostButton: React.FC<SavePostButtonProps> = ({ postId }) => {
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [isCreateBoardModalVisible, setCreateBoardModalVisible] = useState(false);
  const [boards, setBoards] = useState<Array<{
    id: string;
    name: string;
    postCount: number;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would get the userId from auth context
      // For now, we'll use a placeholder
      const userId = 'temp-user-id';

      // Fetch boards from API
      const response = await fetch(`/api/boards?userId=${userId}`);
      
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

  useEffect(() => {
    if (isSaveModalVisible) {
      fetchBoards();
    }
  }, [isSaveModalVisible]);

  const handleSaveToBoard = async (boardId: string, note: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post to board');
      }

      // Close the modal
      setSaveModalVisible(false);
      
      // Show success message
      alert('Post saved to board successfully!');
    } catch (err) {
      console.error('Error saving post to board:', err);
      alert('Failed to save post to board. Please try again.');
    }
  };

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
      
      // Close the create board modal
      setCreateBoardModalVisible(false);
      
      // Refresh boards list
      fetchBoards();
    } catch (err) {
      console.error('Error creating board:', err);
      alert('Failed to create board. Please try again.');
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={() => setSaveModalVisible(true)}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      
      <SaveToBoardModal
        visible={isSaveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        onSave={handleSaveToBoard}
        boards={boards}
        onCreateNewBoard={() => {
          setSaveModalVisible(false);
          setCreateBoardModalVisible(true);
        }}
      />
      
      <BoardCreationModal
        visible={isCreateBoardModalVisible}
        onClose={() => {
          setCreateBoardModalVisible(false);
          setSaveModalVisible(true);
        }}
        onCreateBoard={handleCreateBoard}
      />
    </>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#4f46e5',
    fontWeight: '500',
  },
});

export default SavePostButton;
