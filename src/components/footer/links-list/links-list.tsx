import { FooterLink } from "../footer";

export const LinkList = ({ links }: { links: FooterLink[] }) => (
  <ul className="row gsi-footer__links">
    {links.map((link) => (
      <li key={link.targetUrl} className="col-6 col-sm-4">
        <a className="gsi-footer__link" href={link.targetUrl} target={`${link.newTab ? '_blank' : ''}`} rel={`${link.newTab ? 'noopener noreferrer' : ''}`}>
          {link.linkText}
        </a>
      </li>
    ))}
  </ul>);