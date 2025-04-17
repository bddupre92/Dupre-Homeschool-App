import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';

interface FilterBarProps {
  grades: string[];
  subjects: string[];
  approaches: string[];
  onFiltersChange: (filters: {
    grades: string[];
    subjects: string[];
    approaches: string[];
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  grades,
  subjects,
  approaches,
  onFiltersChange,
}) => {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'grades' | 'subjects' | 'approaches' | null>(null);

  const toggleFilter = (type: 'grades' | 'subjects' | 'approaches') => {
    setActiveFilter(activeFilter === type ? null : type);
  };

  const toggleItem = (type: 'grades' | 'subjects' | 'approaches', item: string) => {
    let updatedSelection: string[] = [];
    
    if (type === 'grades') {
      updatedSelection = selectedGrades.includes(item)
        ? selectedGrades.filter(i => i !== item)
        : [...selectedGrades, item];
      setSelectedGrades(updatedSelection);
    } else if (type === 'subjects') {
      updatedSelection = selectedSubjects.includes(item)
        ? selectedSubjects.filter(i => i !== item)
        : [...selectedSubjects, item];
      setSelectedSubjects(updatedSelection);
    } else if (type === 'approaches') {
      updatedSelection = selectedApproaches.includes(item)
        ? selectedApproaches.filter(i => i !== item)
        : [...selectedApproaches, item];
      setSelectedApproaches(updatedSelection);
    }

    onFiltersChange({
      grades: type === 'grades' ? updatedSelection : selectedGrades,
      subjects: type === 'subjects' ? updatedSelection : selectedSubjects,
      approaches: type === 'approaches' ? updatedSelection : selectedApproaches,
    });
  };

  const renderFilterItems = (type: 'grades' | 'subjects' | 'approaches') => {
    const items = type === 'grades' ? grades : type === 'subjects' ? subjects : approaches;
    const selectedItems = type === 'grades' ? selectedGrades : type === 'subjects' ? selectedSubjects : selectedApproaches;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterItemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterItem,
              selectedItems.includes(item) && styles.selectedFilterItem,
            ]}
            onPress={() => toggleItem(type, item)}
          >
            <Text
              style={[
                styles.filterItemText,
                selectedItems.includes(item) && styles.selectedFilterItemText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'grades' && styles.activeFilterButton]}
          onPress={() => toggleFilter('grades')}
        >
          <Text style={styles.filterButtonText}>
            Grades {selectedGrades.length > 0 && `(${selectedGrades.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'subjects' && styles.activeFilterButton]}
          onPress={() => toggleFilter('subjects')}
        >
          <Text style={styles.filterButtonText}>
            Subjects {selectedSubjects.length > 0 && `(${selectedSubjects.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'approaches' && styles.activeFilterButton]}
          onPress={() => toggleFilter('approaches')}
        >
          <Text style={styles.filterButtonText}>
            Approaches {selectedApproaches.length > 0 && `(${selectedApproaches.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {activeFilter && (
        <View style={styles.filterItemsWrapper}>
          {renderFilterItems(activeFilter)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  filterButtons: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  filterButtonText: {
    fontWeight: '500',
  },
  filterItemsWrapper: {
    paddingVertical: 12,
  },
  filterItemsContainer: {
    paddingHorizontal: 12,
  },
  filterItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedFilterItem: {
    backgroundColor: '#4f46e5',
  },
  filterItemText: {
    fontSize: 14,
  },
  selectedFilterItemText: {
    color: 'white',
  },
});

export default FilterBar;
