import Image from 'next/image';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

interface LogoutActionProps {
  logoutIcon: ImageField;
  label?: string;
  className?: string;
}

const LogoutAction = ({ logoutIcon, label, className }: LogoutActionProps) => {
  const src = logoutIcon?.value?.src;
  if (!src) return null;

  return (
    <div className={`flex items-center cursor-pointer ${className ?? ''}`}>
      <Image src={src} alt="Logout" width={24} height={24} />
      {label && <span className="ml-3">{label}</span>}
    </div>
  );
};

export default LogoutAction;
