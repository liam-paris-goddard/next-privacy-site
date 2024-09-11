import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { HeaderItem } from "../Header";


export const NavItem = ({ headerItem }: { headerItem: HeaderItem }) => {
    const IconArrowRightDarkBlue = "/assets/icons/icon-arrow-right-dark-blue.svg"

    let { children, navIcon, isActive, title, refId, showMegaNav, link, target, thumbnailImage, megaNavExpanded } = headerItem;
    const handleLinkClick = (sectionId: string) => {
        // Scroll to the section
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
        }

        // Open the section
    };

    const toggleDesktopDropdown = (e: React.MouseEvent, showState: 'show' | 'hide') => {
        setTimeout(() => {
            if (showState === 'hide') {
                megaNavExpanded = false;
            } else {
                megaNavExpanded = true;
            }
            if (e.type === 'mouseover') {
                const button = document.getElementById(`navDropdown-${refId}`);
                button?.blur()
            }
        }
            , 10 * 1000)
    }


    return (<li key={title} id={refId}
        onMouseOver={(e) => toggleDesktopDropdown(e, 'show')} onMouseOut={(e) => toggleDesktopDropdown(e, 'hide')}
        className={`nav-item${showMegaNav ? ' dropdown gsi-mega-dropdown' : ''} ${isActive ? ' nav-item--is_active' : ''}`}>
        <a href={link} className="nav-link" target={`${target}`}>
            {thumbnailImage && <img
                className="nav-link-icon"
                src={`${thumbnailImage.src}`}
                alt={`${thumbnailImage.alt}`} />}
            {navIcon && <img
                className="nav-link-icon"
                src={IconArrowRightDarkBlue}
                alt="${page.title @ context='attribute'}" />}
            <span>{title}</span>
            {/*showMegaNav && <><button type="button"
                id={`navDropdown-${refId}`}
                className={`gsi-mega-dropdown-toggle`}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={megaNavExpanded}>
                <span className="sr-only">Toggle dropdown menu</span></button>

                {megaNavExpanded && children && <DropdownMenu dropdownItems={children} />}
            </>*/}
        </a>
    </li>)



}