import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';

interface Board {
  id: string;
  name: string;
  postCount: number;
}

interface SaveToBoardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (boardId: string, note: string) => void;
  boards: Board[];
  onCreateNewBoard: () => void;
}

const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({
  visible,
  onClose,
  onSave,
  boards,
  onCreateNewBoard,
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ board?: string }>({});

  if (!visible) return null;

  const handleSave = () => {
    if (!selectedBoardId) {
      setErrors({ board: 'Please select a board' });
      return;
    }

    onSave(selectedBoardId, note);
    
    // Reset state
    setSelectedBoardId('');
    setNote('');
    setErrors({});
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Save to Board</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Board</Text>
          
          {boards.length > 0 ? (
            <ScrollView style={styles.boardsContainer} contentContainerStyle={styles.boardsList}>
              {boards.map(board => (
                <TouchableOpacity
                  key={board.id}
                  style={[
                    styles.boardItem,
                    selectedBoardId === board.id && styles.boardItemSelected
                  ]}
                  onPress={() => {
                    setSelectedBoardId(board.id);
                    setErrors({});
                  }}
                >
                  <Text style={[
                    styles.boardItemText,
                    selectedBoardId === board.id && styles.boardItemTextSelected
                  ]}>
                    {board.name} ({board.postCount})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyBoardsMessage}>
              <Text>You don't have any boards yet</Text>
            </View>
          )}
          
          {errors.board && <Text style={styles.errorText}>{errors.board}</Text>}
          
          <TouchableOpacity 
            style={styles.createNewBoardButton}
            onPress={onCreateNewBoard}
          >
            <Text style={styles.createNewBoardText}>+ Create New Board</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Add Note (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note about this post..."
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!boards.length || !selectedBoardId) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!boards.length || !selectedBoardId}
          >
            <Text style={[
              styles.saveButtonText,
              (!boards.length || !selectedBoardId) && styles.saveButtonTextDisabled
            ]}>
              Save
            </Text>
          </TouchableOpacity>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boardsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  boardsList: {
    padding: 8,
  },
  boardItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  boardItemSelected: {
    backgroundColor: '#4f46e5',
  },
  boardItemText: {
    fontSize: 16,
  },
  boardItemTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyBoardsMessage: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  createNewBoardButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  createNewBoardText: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
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
  saveButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    color: '#f5f5f5',
  },
});

export default SaveToBoardModal; 