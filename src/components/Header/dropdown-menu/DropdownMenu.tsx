import { HeaderItem } from "@/types/layoutTypes";
import { DropdownMenuLink } from "../dropdown-menu-link/DropdownMenuLink";


export const DropdownMenu = ({ buttonText, megaNavDesc, megaNavImage, megaNavImageAlt, megaNavLinkUrl, megaNavLinkText, dropdownItems }: { dropdownItems: HeaderItem[] }) => {
  const IconArrowRightDarkBlue = "/assets/icons/icon-arrow-right-dark-blue.svg"

  return (<div onClick={(e) => e.stopPropagation()} className="dropdown-menu gsi-mega-dropdown-menu" aria-labelledby={`navDropdown-{index}`}>
    <div className="container-xxl gsi-menu-teaser-container">
      <div className="row">
        <div className="gsi-menu-teaser col">
          <div className="card">
            <img className="card-img-top"
              src={megaNavImage}
              alt={megaNavImageAlt} />
            <div className="card-body">
              <p>{megaNavDesc}</p>
              <button href={megaNavLinkUrl}
                className="gsi-link--cta gsi-link--white">
                {megaNavLinkText && <div dangerouslySetInnerHTML={{ __html: megaNavLinkText }}></div>}
              </button>
            </div>
            <div className="gsi-menu-links col">
              <div className="row">
                {dropdownItems && dropdownItems.map((level2) => (
                  <div key={level2.title} className="col">
                    {level2.children ? level2.children.map((level3) => (<>
                      <div className="gsi-menu-link-level2-header">{level2.title}</div>
                      <DropdownMenuLink headerItem={level3} /></>
                    )) : <DropdownMenuLink headerItem={level2} />}
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
  </div>)
}