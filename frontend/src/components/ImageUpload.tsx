import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { IPFSService } from '../services/ipfs';
import { ImageProcessor } from '../utils/imageProcessor';
import { DuplicateDetectionService } from '../services/duplicateDetection';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface ImageUploadProps {
  onImageUpload: (imageUri: string, file: File, metadata: { hash: string; compressed: boolean }) => void;
  onError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onError }) => {
  const { account } = useWallet();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageMetadata, setImageMetadata] = useState<any>(null);
  const [compressionSavings, setCompressionSavings] = useState<number>(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Clear previous state
    setDuplicateWarning(null);
    setCompressionSavings(0);
    
    // Validate image
    const validation = ImageProcessor.validateImage(file);
    if (!validation.valid) {
      onError(validation.error!);
      return;
    }

    setProcessing(true);
    try {
      // Get image metadata
      const metadata = await ImageProcessor.getImageMetadata(file);
      setImageMetadata(metadata);

      // Generate hash for duplicate detection
      const imageHash = await ImageProcessor.generateImageHash(file);
      
      // Check for duplicates
      const isDuplicate = await DuplicateDetectionService.isDuplicate(imageHash);
      if (isDuplicate) {
        const duplicateInfo = DuplicateDetectionService.getDuplicateInfo(imageHash);
        if (duplicateInfo) {
          setDuplicateWarning(
            `This image was already uploaded on ${new Date(duplicateInfo.uploadedAt).toLocaleDateString()} by ${duplicateInfo.userAddress === account?.address ? 'you' : 'another user'}`
          );
        } else {
          setDuplicateWarning('This image has already been uploaded to the platform');
        }
        setProcessing(false);
        return;
      }

      // Compress image if needed
      let processedFile = file;
      let compressed = false;
      
      if (file.size > 500000 || metadata.width > 1024 || metadata.height > 1024) {
        processedFile = await ImageProcessor.compressImage(file);
        compressed = true;
        const savings = ((file.size - processedFile.size) / file.size) * 100;
        setCompressionSavings(savings);
      }

      // Create preview
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview(previewUrl);
      setUploadedFile(processedFile);

      setProcessing(false);
      setUploading(true);

      // Upload to IPFS
      const imageUri = await IPFSService.uploadImage(processedFile);
      
      // Store hash for future duplicate detection
      DuplicateDetectionService.addImageHash(imageHash, {
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        userAddress: account?.address || 'unknown'
      });

      onImageUpload(imageUri, processedFile, { hash: imageHash, compressed });
    } catch (error) {
      console.error('Upload error:', error);
      onError('Failed to process and upload image');
      setPreview(null);
      setUploadedFile(null);
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  }, [onImageUpload, onError, account?.address]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setUploadedFile(null);
    setDuplicateWarning(null);
    setCompressionSavings(0);
    setImageMetadata(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Meme Image
        </h3>
        {preview && (
          <button
            onClick={removeImage}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove image"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">Duplicate Image Detected</p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">{duplicateWarning}</p>
            </div>
          </div>
        </div>
      )}

      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-full flex items-center justify-center">
              {processing || uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              ) : (
                <CloudArrowUpIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {processing ? 'Processing image...' : 
                 uploading ? 'Uploading to IPFS...' : 
                 'Drop your meme here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {processing ? 'Compressing and checking for duplicates...' :
                 uploading ? 'Please wait...' : 
                 'or click to browse'}
              </p>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500">
              PNG, JPG, GIF, WEBP up to 10MB • Auto-compression enabled
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={preview}
              alt="Meme preview"
              className="w-full h-64 object-cover"
            />
            {(processing || uploading) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {processing ? 'Processing...' : 'Uploading to IPFS...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Image Info */}
          {imageMetadata && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {imageMetadata.width}x{imageMetadata.height}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {(uploadedFile!.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {compressionSavings > 0 && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="font-medium">
                        {compressionSavings.toFixed(1)}% smaller
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
