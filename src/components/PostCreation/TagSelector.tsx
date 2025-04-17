import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native-web';

interface TagSelectorProps {
  title: string;
  options: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  title, 
  options, 
  selectedTags, 
  onTagsChange 
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tagsContainer}>
        {options.map((tag) => (
          <Text
            key={tag}
            style={[
              styles.tag,
              selectedTags.includes(tag) && styles.selectedTag
            ]}
            onPress={() => toggleTag(tag)}
          >
            {tag}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  selectedTag: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
});

export default TagSelector;
