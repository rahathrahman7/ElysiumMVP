// Client-side validation utilities for bespoke form

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  // Optional field, so empty is valid
  if (!phone || phone.trim().length === 0) return true;
  // Basic check for reasonable length
  return phone.trim().length >= 10;
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  return allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
