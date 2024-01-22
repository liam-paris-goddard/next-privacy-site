import './header.scss';

export interface HeaderItem {
  title: string;
  isActive: boolean;
  link: string;
  target: string;
  thumbnailImage: {
    src: string;
    alt: string;
  };
  navIcon: string;
  megaNavImage: string;
  megaNavImageAlt: string;
  megaNavDesc: string;
  megaNavLinkUrl: string;
  megaNavLinkText: string;
  children: HeaderItem[];
}

export const mobileLogo: string = "./assets/icons/static/GS_Logo_Condensed_Blue.svg"
export const desktopLogo: string = "./assets/icons/static/GS_Logo_Full_Blue.svg"
export interface HeaderProps {
  showSkipToContent: boolean;
  showMegaNav: boolean;
  skipToContentText: string;
  logoAltText: string;
  logoLink: string;
  headerItems: HeaderItem[];
  buttonText: string;
  isSchoolPage: boolean;
  schoolButtonText: string;
  scheduleTourPagePath: string
}
export const Header = ({ showSkipToContent = true,
  showMegaNav = false,
  skipToContentText = 'Skip to content',
  logoAltText = 'Header Logo',
  logoLink = '#',
  headerItems,
  buttonText = 'Find a School',
  isSchoolPage = false,
  schoolButtonText = 'Schedule a Tour',
  scheduleTourPagePath }: HeaderProps) => {



  /*componentDidLoad() {
    // Add hover and focus events to open nav dropdowns
    document.querySelectorAll('.nav-item.dropdown').forEach((dropdown) => {
      dropdown.addEventListener('mouseover', (e) => _toggleDesktopDropdown(e, 'show'));
      dropdown.addEventListener('mouseout', (e) => _toggleDesktopDropdown(e, 'hide'));
    });

    // Leave dropdowns open when clicked inside
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-item.dropdown > .dropdown-menu')) {
        e.stopPropagation();
      }
    });
  }

  toggleMobileNav(openClose?: string): void {
    const body = document.body;
    const header = document.querySelector('#gsiHeader');

    if (header.classList.contains('gsi-expanded') || openClose === 'close') {
      header.classList.remove('gsi-expanded');
      body.classList.remove('modal-open');
    } else {
      closeNavSearch();

      header.classList.add('gsi-expanded');
      body.classList.add('modal-open');
    }
  }

  toggleDesktopDropdown(event: Event, showHide: 'show' | 'hide') {
    // Only toggle when nav is in desktop layout
    // For mobile, default bootstrap click is used
    if (window.innerWidth < navBreakpoint) {
      return;
    }

    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    const button = dropdown.querySelector('.gsi-mega-dropdown-toggle');
    if (showHide === 'hide' && dropdown.classList.contains('show')) {
      button.setAttribute('data-toggle', showHide);
      button.setAttribute('aria-expanded', 'false');
    } else if (!dropdown.classList.contains('show')) {
      button.setAttribute('data-toggle', showHide);
    }
    // Dropdown forces a focus event
    // which isn't needed for the mouse event
    if (event.type === 'mouseover') button.blur();
  }*/

  return (
    <header className="gsi-header fixed-top" id="gsiHeader">
      {showSkipToContent && <a className="btn btn-secondary gsi-skip-nav-link" href='#skip-nav'>{skipToContentText}</a>} {/* todo: refactor to button? */}
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
            aria-label="Toggle navigation">
          </button> {/* todo: refactor to button? */}
          <button className="gsi-header__nav-search-toggler js-toggle-nav-search"
            type="button"
            id="gsiNavSearchToggler"
            aria-controls="gsiNavSearch"
            aria-label="Toggle School Search">
          </button> {/* todo: refactor to button? */}
          <div className='gsi-navbar-collapse' id="gsiNavbarCollapse">
            {/* todo: consider turning into slots, making functions */}
            {headerItems && <ul className="navbar-nav ml-auto">
              {headerItems.map((level1, index) => {
                if (level1.title) {
                  return (
                    <li key={level1.title} className={`nav-item${showMegaNav ? ' dropdown gsi-mega-dropdown' : ''}${level1.isActive ? ' nav-item--is_active' : ''}`}>
                      <a href={level1.link} className="nav-link" target={`${level1.target}`}> {/* todo: consider refactoring to link */}
                        {level1.thumbnailImage && <img
                          className="nav-link-icon"
                          src={`${level1.thumbnailImage.src}`}
                          alt={`${level1.thumbnailImage.alt}`} />}
                        {level1.navIcon && <img
                          className="nav-link-icon"
                          src="/etc.clientlibs/gsi/clientlibs/clientlib-site/resources/images/icon-arrow-right-dark-blue.svg" // todo: replace with arrow
                          alt="${level1.page.title @ context='attribute'}"></img>} {/* replace with actual alt */}
                        <span>{level1.title}</span>
                        {showMegaNav && <><button type="button"
                          id={`navDropdown-${index}`}
                          className="gsi-mega-dropdown-toggle"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          <span className="sr-only">Toggle dropdown menu</span></button> {/* todo: another button */}

                          <div className="dropdown-menu gsi-mega-dropdown-menu"
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
                                        <div dangerouslySetInnerHTML={{ __html: level1.megaNavLinkText }}></div>
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
                                                {level3.thumbnailImage.src ? (
                                                  <img
                                                    className="gsi-menu-link-level3-image"
                                                    src={level3.thumbnailImage.src}
                                                    alt={level3.thumbnailImage.alt} />) :
                                                  (<img
                                                    className="gsi-menu-link-level3-image"
                                                    src="/etc.clientlibs/gsi/clientlibs/clientlib-site/resources/images/icon-arrow-right-dark-blue.svg"
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
                                    buttonText && !isSchoolPage &&
                                    (<li className="nav-item gsi-nav-item-locator">
                                      <button id="gsiSchoolLocatorBtn"
                                        className="btn gsi-btn-nav-locator js-toggle-nav-search">
                                        <img className="gsi-btn__icon"
                                          src="/etc.clientlibs/gsi/clientlibs/clientlib-site/resources/images/icon-location-marker-white.svg"
                                          aria-hidden="true" />
                                        <span className="gsi-btn__text">{buttonText}</span>
                                      </button>
                                    </li>)
                                  }
                                  {
                                    isSchoolPage && schoolButtonText && scheduleTourPagePath && (<li className="nav-item gsi-nav-item-locator">
                                      <a href={scheduleTourPagePath}
                                        className="btn gsi-btn-nav-locator">
                                        <span className="gsi-btn__text">{schoolButtonText}</span>
                                      </a>
                                    </li>)
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
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
    </header >
  )
}
