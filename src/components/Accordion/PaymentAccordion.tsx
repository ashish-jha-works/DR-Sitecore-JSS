import ChevronDown from 'assets/icons/ChevronDown';
import DownloadIcon from 'assets/icons/DownloadIcon';
import React, { useState, ReactNode } from 'react';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  collapsible?: boolean;
  isDownloadEnable?: boolean;
  handleDownloadAction?: () => void;
  totalAmount?: string | null;
  children: ReactNode;
}

export const PaymentAccordion: React.FC<AccordionProps> = ({
  title,
  icon,
  defaultOpen = false,
  isOpen,
  onToggle,
  collapsible = true,
  isDownloadEnable = false,
  handleDownloadAction,
  totalAmount,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const open = collapsible ? (isOpen !== undefined ? isOpen : internalOpen) : true;

  const handleToggle = () => {
    if (!collapsible) return;

    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div className="container-sm rounded-lg border border-lilac-300 bg-white-pure shadow-sm mx-4 my-4 lg:mx-auto p-4 lg:p-8">
      <div
        onClick={handleToggle}
        aria-expanded={open}
        className={`flex flex-col ${
          isDownloadEnable ? 'lg:flex-row' : 'flex-row'
        } w-full items-center justify-between gap-3 lg:gap-4 text-left
          ${collapsible ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        <div className="flex items-center gap-3 lg:gap-4">
          {icon && <div className="shrink-0 text-lilac-500">{icon}</div>}
          <h3 className="text-4 lg:text-heading-3 text-navy-500">{title}</h3>
        </div>

        <div className={`flex items-center ${isDownloadEnable ? 'w-full lg:w-57' : ''}`}>
          {isDownloadEnable && (
            <a className="btn btn-secondary" onClick={handleDownloadAction}>
              <DownloadIcon /> Download
            </a>
          )}
          {totalAmount && <p className="hidden lg:block text-heading-3 mr-7">{totalAmount}</p>}
          {collapsible && (
            <span
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''} ${
                isDownloadEnable ? 'ml-2' : ''
              }`}
            >
              <ChevronDown className="text-lilac-500" />
            </span>
          )}
        </div>
      </div>
      {totalAmount && <p className="block lg:hidden text-4 text-right">{totalAmount}</p>}

      <div
        className={
          collapsible
            ? `grid transition-all duration-300 ease-in-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`
            : ''
        }
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
