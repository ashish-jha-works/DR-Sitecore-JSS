// Re-export all Sitecore JSS components, with custom overrides
export {
  Text,
  RichText,
  Link,
  Placeholder,
  DateField,
  File,
} from '@sitecore-jss/sitecore-jss-nextjs';

// Export our custom Image component as "Image" so it can be used as a drop-in replacement
export { default as Image } from './CustomImage';

// Also export the custom implementations with their original names
export { default as CustomImage } from './CustomImage';
export { default as CustomLink } from './CustomLink';
export { default as CustomRichText } from './CustomRichText';
export { default as CustomVideo } from './CustomVideo';
export { default as LinkNoPrefetch } from './LinkNoPrefetch';
