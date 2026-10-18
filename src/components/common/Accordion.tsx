import { RichTextField, Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import ChevronDown from 'assets/icons/ChevronDown';
import React, { useState, ReactNode } from 'react';
import { CustomRichText } from 'src/common/SitecoreOverrides';

interface AccordionProps {
  title: TextField;
  leadingIcon?: RichTextField;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  collapsible?: boolean;
  children: ReactNode | RichTextField;
  version?: number;
  className?: string;
  /** When true, hide bottom border while collapsed (show only when expanded). */
  isLast?: boolean;
  /** When true, always show bottom border (e.g. move-in landing FAQs). */
  forceBottomBorder?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  leadingIcon,
  defaultOpen = false,
  isOpen,
  onToggle,
  collapsible = true,
  children,
  version = 1,
  className,
  isLast = false,
  forceBottomBorder = false,
}: AccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const open = collapsible ? (isOpen !== undefined ? isOpen : internalOpen) : true;
  const showBottomBorder = forceBottomBorder || open || !isLast;

  const handleToggle = () => {
    if (!collapsible) return;

    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div className={`py-4 ${showBottomBorder ? 'border-b border-b-lilac-200' : ''} ${className}`}>
      <div
        onClick={handleToggle}
        aria-expanded={open}
        className={`flex flex-col w-full items-center justify-between gap-3 text-left ${
          collapsible ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="flex justify-between items-center gap-6 w-full">
          <div className="flex items-center gap-3">
            {leadingIcon && (
              <CustomRichText
                field={leadingIcon}
                className="text-lilac-500 [&_svg]:w-7 [&_svg]:h-7 [&_svg]:shrink-0"
              />
            )}
            <Text tag="h3" field={title} className="text-body text-navy-500 font-medium" />
          </div>

          <div
            className={`${
              version == 1
                ? 'h-11 min-w-11 min-h-11 bg-lilac-500 rounded-lg flex justify-center items-center text-white-pure'
                : 'text-lilac-500'
            }`}
          >
            {collapsible && (
              <span
                className={`inline-block transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown />
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          collapsible
            ? `grid transition-all duration-300 ease-in-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`
            : ''
        }
      >
        <div
          className={`overflow-hidden text-body text-navy-500 font-normal ${open ? 'pt-3' : ''}`}
        >
          {React.isValidElement(children) ? (
            children
          ) : (
            <CustomRichText
              field={children as RichTextField}
              className="[&_ul]:list-disc [&_ul]:ps-4 font-light [&_a]:text-navy-500 [&_a]:hover:text-lilac-300"
            />
          )}
        </div>
      </div>
    </div>
  );
};
