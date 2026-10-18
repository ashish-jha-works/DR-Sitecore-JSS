import { FC } from 'react';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';

interface CustomRichTextProps {
  field: any;
  className?: string;
}

const CustomRichText: FC<CustomRichTextProps> = ({ field, className }) => {
  return <RichText field={field} className={className} />;
};

export default CustomRichText;
