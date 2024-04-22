/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import './header.scss';
import { generatUuid } from '@/utils/formatUtils';


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
  children?: HeaderItem[];
}

export interface HeaderProps {
  showMegaNav: boolean;
  inputHeaderItems: HeaderItem[];
}



export const Header = ({
  showMegaNav = false,
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
    setHeaderItems(headerItems.map(
      (item: HeaderItem, index: number) => ({
        ...item,
        refId: `${item.title.split(' ').join('-').toLowerCase()}-${generatUuid()}`
      })
    ));
  }, []);


  const toggleDesktopDropdown = (e: React.MouseEvent, showState: 'show' | 'hide') => {
    setTimeout(() => {
      if (window.innerWidth < navBreakpoint) return
      const tempHeaderItems = [...headerItems];
      const selectedHeaderItem = tempHeaderItems.find(item => item.refId === (e.target as HTMLElement).id);
      if (selectedHeaderItem) {
        if (showState === 'hide') {
          selectedHeaderItem.megaNavExpanded = false;
        } else {
          selectedHeaderItem.megaNavExpanded = true;
        }
        if (e.type === 'mouseover') {
          const button = document.getElementById(`navDropdown-${selectedHeaderItem.refId}`);
          button?.blur()
        }
        setHeaderItems(tempHeaderItems);
      }
    }, 100 * 1000)
  }


  // a function that runs e.stopPropogation() if there is a click inside of .nav-item.dropdown > .dropdown-menu


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
              onClick={() => setMobileNav(!mobileNav ? 'close' : 'open')}>
            </button>

            <div className='gsi-navbar-collapse' id="gsiNavbarCollapse">
              {headerItems && <ul className="navbar-nav ml-auto">
                {headerItems.map((level1, index) => {
                  if (level1.title) {
                    return (
                      <li key={level1.title} id={level1.refId}
                        onMouseOver={(e) => toggleDesktopDropdown(e, 'show')} onMouseOut={(e) => toggleDesktopDropdown(e, 'hide')}
                        className={`nav-item${showMegaNav ? ' dropdown gsi-mega-dropdown' : ''} ${level1.isActive ? ' nav-item--is_active' : ''}`}>
                        <a href={level1.link} className="nav-link" target={`${level1.target}`}>
                          {level1.thumbnailImage && <img
                            className="nav-link-icon"
                            src={`${level1.thumbnailImage.src}`}
                            alt={`${level1.thumbnailImage.alt}`} />}
                          {level1.navIcon && <img
                            className="nav-link-icon"
                            src={IconArrowRightDarkBlue}
                            alt="${level1.page.title @ context='attribute'}" />}
                          <span>{level1.title}</span>
                          {showMegaNav && <><button type="button"
                            id={`navDropdown-${level1.refId}`}
                            className={`gsi-mega-dropdown-toggle`}
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded={level1.megaNavExpanded}>
                            <span className="sr-only">Toggle dropdown menu</span></button>

                            {level1.megaNavExpanded && <div onClick={(e) => e.stopPropagation()} className="dropdown-menu gsi-mega-dropdown-menu"
                              aria-labelledby={`navDropdown-${index}`}>
                              <div className="container-xxl gsi-menu-teaser-container">
                                <div className="row">
                                  <div className="gsi-menu-teaser col">
                                    <div className="card">
                                      <img className="card-img-top"
                                        src={level1.megaNavImage}
                                        alt={level1.megaNavImageAlt} />
                                      <div className="card-body">
                                        <p>{level1.megaNavDesc}</p>
                                        <a href={level1.megaNavLinkUrl}
                                          className="gsi-link--cta gsi-link--white">
                                          {level1.megaNavLinkText && <div dangerouslySetInnerHTML={{ __html: level1.megaNavLinkText }}></div>}
                                        </a>
                                      </div>
                                      <div className="gsi-menu-links col">
                                        <div className="row">
                                          {level1.children && level1.children.map((level2) => (
                                            <div key={level2.title} className="col">
                                              <div className="gsi-menu-link-level2-header">{level2.title}</div>
                                              {level2.children && level2.children.map((level3) => (
                                                <a key={level3.title} className="dropdown-item"
                                                  href={level3.link}
                                                  target={level3.target}>
                                                  {level3.thumbnailImage?.src ? (
                                                    <img
                                                      className="gsi-menu-link-level3-image"
                                                      src={level3.thumbnailImage.src}
                                                      alt={level3.thumbnailImage.alt} />) :
                                                    (<img
                                                      className="gsi-menu-link-level3-image"
                                                      src={IconArrowRightDarkBlue}
                                                      alt={level3.title} />)}
                                                  <span> {level3.title}</span>
                                                </a>
                                              ))}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    {
                                      buttonText &&
                                      (<li className="nav-item gsi-nav-item-locator">
                                        <button id="gsiSchoolLocatorBtn"
                                          className="btn gsi-btn-nav-locator js-toggle-nav-search">
                                          <img className="gsi-btn__icon"
                                            alt="find a school button"
                                            src={IconLocationMarkerWhite}
                                            aria-hidden="true" />
                                          <span className="gsi-btn__text">{buttonText}</span>
                                        </button>
                                      </li>)
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>}
                          </>}
                        </a>
                      </li>
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
