import { FooterLegalLink } from "../../../types/layoutTypes";

export const LegalLinks = ({ copyright, legalLinksList }: { copyright: string; legalLinksList: FooterLegalLink[] }) => (
  <ul className="gsi-footer__legal">
    <li>{copyright}</li>
    {legalLinksList.map(item =>
      <li key={item.targetUrl}>
        <a className="gsi-footer__link gsi-footer__link--legal" href={item.targetUrl} target={item.newTab ? '_blank' : ''} rel={item.newTab ? 'noopener noreferrer' : ''}>
          {item.linkText}
        </a>
      </li>
    )}
  </ul>
);
