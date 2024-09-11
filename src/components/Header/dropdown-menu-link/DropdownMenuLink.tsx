import { HeaderItem } from "@/types/layoutTypes";

export const DropdownMenuLink = ({ headerItem }: { headerItem: HeaderItem }) => {
  const IconArrowRightDarkBlue = "/assets/icons/icon-arrow-right-dark-blue.svg"

  return (<a key={headerItem.title} className="dropdown-item"
    href={headerItem.link}
    target={headerItem.target}>
    {headerItem.thumbnailImage?.src ? (
      <img
        className="gsi-menu-link-headerItem-image"
        src={headerItem.thumbnailImage.src}
        alt={headerItem.thumbnailImage.alt} />) :
      (<img
        className="gsi-menu-link-headerItem-image"
        src={IconArrowRightDarkBlue}
        alt={headerItem.title} />)}
    <span> {headerItem.title}</span>
  </a>)
}