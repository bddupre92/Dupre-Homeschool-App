import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native-web';
import MediaUpload from './MediaUpload';
import TagSelector from './TagSelector';

// Sample data for dropdowns
const GRADES = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'High School'];
const SUBJECTS = ['Math', 'Science', 'Language Arts', 'Reading', 'Writing', 'History', 'Social Studies', 'Art', 'Music', 'Physical Education', 'Foreign Language'];
const APPROACHES = ['Classical', 'Charlotte Mason', 'Montessori', 'Waldorf', 'Unschooling', 'Eclectic', 'Traditional', 'Unit Studies', 'Special Needs'];

interface PostCreationFormProps {
  onSubmit: (postData: any) => void;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMediaSelected = (url: string, type: string) => {
    setMediaUrl(url);
    setMediaType(type);
    // Clear media error if it exists
    if (errors.media) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.media;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!mediaUrl) {
      newErrors.media = 'Please upload a photo, video, or PDF';
    }

    if (selectedGrades.length === 0) {
      newErrors.grades = 'Please select at least one grade level';
    }

    if (selectedSubjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // In a real app, we would get the userId from auth context
      // For now, we'll use a placeholder
      const userId = 'temp-user-id';

      const postData = {
        userId,
        title,
        description,
        mediaType,
        mediaUrl,
        grades: JSON.stringify(selectedGrades),
        subjects: JSON.stringify(selectedSubjects),
        approaches: JSON.stringify(selectedApproaches),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Call the onSubmit prop with the post data
      await onSubmit(postData);

      // Reset form
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setMediaType('');
      setSelectedGrades([]);
      setSelectedSubjects([]);
      setSelectedApproaches([]);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a Post</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title for your post"
          maxLength={100}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your post or add instructions..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Media</Text>
        <MediaUpload onMediaSelected={handleMediaSelected} />
        {errors.media && <Text style={styles.errorText}>{errors.media}</Text>}
      </View>

      <TagSelector
        title="Grade Level"
        options={GRADES}
        selectedTags={selectedGrades}
        onTagsChange={setSelectedGrades}
      />
      {errors.grades && <Text style={styles.errorText}>{errors.grades}</Text>}

      <TagSelector
        title="Subject"
        options={SUBJECTS}
        selectedTags={selectedSubjects}
        onTagsChange={setSelectedSubjects}
      />
      {errors.subjects && <Text style={styles.errorText}>{errors.subjects}</Text>}

      <TagSelector
        title="Approach (Optional)"
        options={APPROACHES}
        selectedTags={selectedApproaches}
        onTagsChange={setSelectedApproaches}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostCreationForm;
