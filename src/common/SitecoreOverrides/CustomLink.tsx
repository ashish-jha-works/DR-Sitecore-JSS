import { Link } from '@sitecore-jss/sitecore-jss-nextjs';
import LinkNoPrefetch from './LinkNoPrefetch';
import useExperienceEditor from 'src/hooks/useExperienceEditor';

/** Support both `{ value: { href, querystring } }` and flat SIT link fields. */
const getLinkValue = (field: any) => {
  if (!field || typeof field === 'string') return null;
  if (field.value && typeof field.value === 'object') return field.value;
  if (field.href || field.querystring || field.text) return field;
  return null;
};

const CustomLink = (props: any) => {
  const { field, children, className, ...rest } = props;
  const inExperienceEditor = useExperienceEditor();

  const buildHref = (field: any) => {
    const link = getLinkValue(field);
    if (!link) return '';

    const base = link.href || '';
    const query = link.querystring;

    if (!base) return '';
    if (!query) return base;

    const formattedQuery = query.startsWith('?') ? query : `?${query}`;

    // Avoid duplicating query if href already includes it
    if (base.includes('?')) {
      const [path, existingQuery = ''] = base.split('?');
      const params = new URLSearchParams(existingQuery);
      new URLSearchParams(query.startsWith('?') ? query.slice(1) : query).forEach((value, key) => {
        params.set(key, value);
      });
      const merged = params.toString();
      return merged ? `${path}?${merged}` : path;
    }

    return `${base}${formattedQuery}`;
  };

  if (typeof field === 'string') {
    return (
      <LinkNoPrefetch href={field} className={className} {...rest}>
        {children}
      </LinkNoPrefetch>
    );
  }

  const linkValue = getLinkValue(field);
  const sitecoreField = field?.value ? field : linkValue ? { value: linkValue } : field;

  if (linkValue?.target === '_blank') {
    return (
      <Link field={sitecoreField} rel="nofollow" target="_blank" {...rest} className={className}>
        {children}
      </Link>
    );
  }

  const href = buildHref(field);

  return (
    <>
      {inExperienceEditor ? (
        <Link field={sitecoreField} {...rest} prefetch={false} className={className}>
          {children}
        </Link>
      ) : href ? (
        <LinkNoPrefetch href={href} className={className}>
          {children ? children : linkValue?.text}
        </LinkNoPrefetch>
      ) : (
        <Link field={sitecoreField} {...rest} prefetch={false} className={className}>
          {children}
        </Link>
      )}
    </>
  );
};
export default CustomLink;
