import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';

interface SaveToboardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (boardId: string, note: string) => void;
  boards: Array<{
    id: string;
    name: string;
    postCount: number;
  }>;
  onCreateNewBoard: () => void;
}

const SaveToBoardModal: React.FC<SaveToboardModalProps> = ({
  visible,
  onClose,
  onSave,
  boards,
  onCreateNewBoard,
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedBoardId) return;
    onSave(selectedBoardId, note);
    resetForm();
  };

  const resetForm = () => {
    setSelectedBoardId(null);
    setNote('');
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Save to Board</Text>
        
        {boards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any boards yet</Text>
            <TouchableOpacity 
              style={styles.createBoardButton} 
              onPress={onCreateNewBoard}
            >
              <Text style={styles.createBoardButtonText}>Create a Board</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Select a board:</Text>
            <ScrollView style={styles.boardsContainer}>
              {boards.map((board) => (
                <TouchableOpacity
                  key={board.id}
                  style={[
                    styles.boardOption,
                    selectedBoardId === board.id && styles.selectedBoardOption,
                  ]}
                  onPress={() => setSelectedBoardId(board.id)}
                >
                  <Text 
                    style={[
                      styles.boardName,
                      selectedBoardId === board.id && styles.selectedBoardName,
                    ]}
                  >
                    {board.name}
                  </Text>
                  <Text style={styles.postCount}>
                    {board.postCount} {board.postCount === 1 ? 'item' : 'items'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.createNewButton} 
              onPress={onCreateNewBoard}
            >
              <Text style={styles.createNewButtonText}>+ Create New Board</Text>
            </TouchableOpacity>
            
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Add a note (optional):</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add a private note about this post..."
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {boards.length > 0 && (
            <TouchableOpacity 
              style={[styles.saveButton, !selectedBoardId && styles.disabledButton]} 
              onPress={handleSave}
              disabled={!selectedBoardId}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boardsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  boardOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedBoardOption: {
    borderColor: '#4f46e5',
    backgroundColor: '#f5f3ff',
  },
  boardName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedBoardName: {
    color: '#4f46e5',
  },
  postCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  createNewButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  createNewButtonText: {
    color: '#4f46e5',
    fontWeight: '500',
  },
  noteContainer: {
    marginBottom: 16,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#a5a5a5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  createBoardButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  createBoardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SaveToBoardModal;
