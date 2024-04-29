/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import './header.scss';
import { generatUuid } from '@/utils/formatUtils';
import { NavItem } from './nav-item/NavItem';


//TODO: mobile nav will not close

export interface HeaderItem {
  title: string;
  refId?: string;
  isActive: boolean;
  link: string;
  target: string;
  thumbnailImage?: {
    src: string;
    alt: string;
  };
  navIcon?: string;
  megaNavImage?: string;
  megaNavImageAlt?: string;
  megaNavDesc?: string;
  megaNavLinkUrl?: string;
  megaNavLinkText?: string;
  megaNavExpanded?: boolean;
  showMegaNav?: boolean;
  children?: HeaderItem[];
}

export interface HeaderProps {
  inputHeaderItems: HeaderItem[];
}



export const Header = ({
  inputHeaderItems = [],
}: HeaderProps) => {

  const logoLink = '/';
  const skipToContentText = 'Skip to content';
  const logoAltText = 'Header Logo';
  const buttonText = 'Find a School';
  const showSkipToContent = true;
  const mobileLogo = '/assets/icons/GS_Logo_Condensed_Blue.svg';
  const desktopLogo = '/assets/icons/GS_Logo_Full_Blue.svg';
  const IconArrowRightDarkBlue = "/assets/icons/icon-arrow-right-dark-blue.svg"
  const IconLocationMarkerWhite = "/assets/icons/icon-location-marker-white.svg"
  const navBreakpoint = 800;
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState('open');
  const [headerItems, setHeaderItems] = useState<HeaderItem[]>(inputHeaderItems);


  useEffect(() => {
    setMobileNav(navSearchOpen ? 'close' : 'open')
  }, [navSearchOpen])

  useEffect(() => {
    console.warn(mobileNav)
    setHeaderItems(headerItems.map(
      (item: HeaderItem, index: number) => ({
        ...item,
        refId: `${item.title.split(' ').join('-').toLowerCase()}-${generatUuid()}`
      })
    ));
  }, []);

  const handleResize = (e: UIEvent) => {
    const target = e.target as Window & typeof globalThis;
    if (target.innerWidth >= navBreakpoint && mobileNav === 'open') {
      setMobileNav('close');
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return window.removeEventListener('resize', handleResize)
  }, [])

  return (<>
    <div className="header aem-GridColumn aem-GridColumn--default--12">
      <header className={`${mobileNav === 'open' ? 'gsi-expanded' : ''} gsi-header fixed-top`} id="gsiHeader">
        {showSkipToContent && <a className="btn btn-secondary gsi-skip-nav-link" href='#skip-nav'>{skipToContentText}</a>}
        <div className="container-xxl h-100">
          <nav className="navbar h-100">
            <a className="navbar-brand" href={logoLink}>
              <img className="d-lg-none" src={mobileLogo} alt={logoAltText} />
              <img className="d-none d-lg-block" src={desktopLogo} alt={logoAltText} />
            </a>
            <button className="navbar-toggler js-toggle-navbar"
              type="button"
              id="gsiNavbarToggler"
              aria-controls="gsiNavbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => {

                console.warn(mobileNav);
                setMobileNav(mobileNav !== 'close' ? 'close' : 'open')
              }}>
            </button>

            <div className='gsi-navbar-collapse' id="gsiNavbarCollapse">
              {headerItems && <ul className="navbar-nav ml-auto">
                {headerItems.map((level1, index) => {
                  if (level1.title && level1.link) {
                    return (
                      <NavItem headerItem={level1}></NavItem>
                    )
                  }
                })}
              </ul>}
            </div>
          </nav>
        </div >
      </header ></div ></>
  )
}
