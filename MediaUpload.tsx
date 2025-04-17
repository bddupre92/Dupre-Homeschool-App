import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native-web';
import { uploadToS3, generateS3Key } from '../../lib/s3';

interface MediaUploadProps {
  onMediaSelected: (mediaUrl: string, mediaType: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaSelected }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.split('/')[0]; // image, video, application
    
    // Validate file type
    if (!['image', 'video', 'application'].includes(fileType)) {
      alert('Please upload an image, video, or PDF file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set media type
    if (fileType === 'application' && file.type === 'application/pdf') {
      setMediaType('pdf');
    } else {
      setMediaType(fileType);
    }

    try {
      setIsUploading(true);
      
      // In a real app, we would get the userId from auth context
      // For now, we'll use a placeholder
      const userId = 'temp-user-id';
      
      // Generate a unique key for S3
      const key = generateS3Key(file.name, userId);
      
      // Upload to S3
      const mediaUrl = await uploadToS3(file, key);
      
      // Pass the media URL and type to parent component
      onMediaSelected(mediaUrl, mediaType);
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (mediaType === 'image') {
      return <Image source={{ uri: preview }} style={styles.previewImage} />;
    } else if (mediaType === 'video') {
      return (
        <video width="100%" height="200" controls>
          <source src={preview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaType === 'pdf') {
      return (
        <View style={styles.pdfPreview}>
          <Text style={styles.pdfText}>PDF Document</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,application/pdf"
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <View style={styles.previewContainer}>
          {renderPreview()}
          <TouchableOpacity 
            style={styles.changeButton} 
            onPress={triggerFileInput}
            disabled={isUploading}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={triggerFileInput}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : '+ Add Photo, Video, or PDF'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  previewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  pdfPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pdfText: {
    fontSize: 18,
    color: '#666',
  },
});

export default MediaUpload;
