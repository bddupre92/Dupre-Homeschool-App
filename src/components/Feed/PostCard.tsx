import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native-web';

interface PostCardProps {
  post: {
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
  };
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onPress, 
  onLike, 
  onComment, 
  onSave 
}) => {
  // Parse JSON strings to arrays
  const grades = JSON.parse(post.grades || '[]');
  const subjects = JSON.parse(post.subjects || '[]');
  const approaches = JSON.parse(post.approaches || '[]');

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderMedia = () => {
    if (post.mediaType === 'image') {
      return (
        <Image 
          source={{ uri: post.mediaUrl }} 
          style={styles.media} 
          resizeMode="cover"
        />
      );
    } else if (post.mediaType === 'video') {
      return (
        <video width="100%" height="300" controls style={styles.videoMedia}>
          <source src={post.mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (post.mediaType === 'pdf') {
      return (
        <View style={styles.pdfContainer}>
          <Text style={styles.pdfText}>PDF Document</Text>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => window.open(post.mediaUrl, '_blank')}
          >
            <Text style={styles.viewButtonText}>View PDF</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} style={styles.cardContent}>
        {renderMedia()}
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          
          {post.description && (
            <Text style={styles.description} numberOfLines={3}>
              {post.description}
            </Text>
          )}
          
          <View style={styles.tagsContainer}>
            {grades.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.tagGroupTitle}>Grades:</Text>
                <View style={styles.tags}>
                  {grades.map((grade: string, index: number) => (
                    <Text key={`grade-${index}`} style={styles.tag}>
                      {grade}
                    </Text>
                  ))}
                </View>
              </View>
            )}
            
            {subjects.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.tagGroupTitle}>Subjects:</Text>
                <View style={styles.tags}>
                  {subjects.map((subject: string, index: number) => (
                    <Text key={`subject-${index}`} style={styles.tag}>
                      {subject}
                    </Text>
                  ))}
                </View>
              </View>
            )}
            
            {approaches.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.tagGroupTitle}>Approaches:</Text>
                <View style={styles.tags}>
                  {approaches.map((approach: string, index: number) => (
                    <Text key={`approach-${index}`} style={styles.tag}>
                      {approach}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 300,
  },
  videoMedia: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  pdfContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfText: {
    fontSize: 18,
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tagGroup: {
    marginBottom: 8,
  },
  tagGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#4f46e5',
    fontWeight: '500',
  },
});

export default PostCard;
