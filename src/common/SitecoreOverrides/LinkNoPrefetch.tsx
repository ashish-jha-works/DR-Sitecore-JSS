import React from 'react';
import { Router, withRouter } from 'next/router';

type Props = {
  href: string;
  children: React.ReactNode;
  router: Router;
  className?: string;
};

class LinkNoPrefetch extends React.PureComponent<Props> {
  normalizeHref = (href: string) => {
    return href.startsWith('/en') ? href.replace(/^\/en/, '') || '/' : href;
  };

  onClick = async (event: React.MouseEvent) => {
    const { router, href } = this.props;
    event.preventDefault();
    const normalizedHref = this.normalizeHref(href);
    await router.push(normalizedHref);
  };

  render() {
    const { href, children, className = '' } = this.props;
    const normalizedHref = this.normalizeHref(href);
    return (
      <a href={normalizedHref} onClick={this.onClick} className={`${className} LinkNoPrefetch`}>
        {children}
      </a>
    );
  }
}

export default withRouter(LinkNoPrefetch);
