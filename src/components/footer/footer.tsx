import { useEffect, useState } from "react"
import { LegalLinks } from "./legal-links-list/legal-links-list";
import { LinkList } from "./links-list/links-list";
import { SocialIconList } from "./social-links-list.tsx/social-links-list";


export interface FooterLink {
  newTab: boolean;
  link: string;
  linkText: string;
  targetUrl: string;
}

export interface FooterSocialIcon {
  isEnabled: boolean
  targetUrl: string;
  newTab: boolean
  imageReference: string;
  linkText: string;
}

export interface FooterLegalLink {
  targetUrl: string;
  newTab: boolean
  linkText: string;
}

export interface FooterProps {
  hideEmail?: boolean
  getApiBasePath?: string
  apiKey?: string
  footerTitle: string
  emailText?: string
  emailFeedBackText?: string
  emailButtonText?: string
  emailSuccessText?: string
  imageReference: string;
  logoAltText: string;
  links?: FooterLink[]
  socialIconsTitle?: string;
  socialIconList?: FooterSocialIcon[]
  copyright?: string;
  legalLinksList?: FooterLegalLink[]
  footerTopIconText?: string;
}

export const Footer = ({ hideEmail,
  getApiBasePath,
  apiKey,
  footerTitle,
  emailText,
  emailFeedBackText,
  emailButtonText,
  emailSuccessText,
  imageReference,
  logoAltText,
  links,
  socialIconsTitle,
  socialIconList,
  copyright,
  legalLinksList,
  footerTopIconText }: FooterProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    const oneTrustToggle = document.querySelector('a[href="#OneTrustToggle"]');
    if (oneTrustToggle) {
      oneTrustToggle.addEventListener('click', (e) => handleOneTrustClick(e));
    }
  }, []);


  const handleOneTrustClick = (e: Event) => {
    e.preventDefault();
    //OneTrust.ToggleInfoDisplay();
  }


  return (<footer className="gsi-footer" id="gsiFooter">
    <div className="container-xxl position-relative">
      <div className="row mb-50 mb-lg-70 mb-lg-100">
        <div className="col-12 col-lg-3">
          <img className="img-fluid gsi-footer__logo" src={imageReference} alt={logoAltText} />
        </div>
        <div className="col-12 col-lg-6">
          {!!(links && links.length === 0) && (
            <LinkList links={links} />
          )}
        </div>
        <div className="col-12 col-lg-3">
          {socialIconList && <SocialIconList socialIconsTitle={socialIconsTitle ? socialIconsTitle : ''} socialIconList={socialIconList} />}
        </div>
      </div>
      {legalLinksList && legalLinksList.length > 0 && <LegalLinks copyright={copyright ? copyright : ''} legalLinksList={legalLinksList} />}
      <div className="gsi-footer__scrolltop">
        <button onClick={() => window.scrollTo(0, 0)} type="button" className="gsi-btn--blank" id="gsiFooterScrolltopButton">
          <img className="img-fluid mb-10" src="/etc.clientlibs/gsi/clientlibs/clientlib-site/resources/images/icon-up-arrow-white.svg" alt="" />
          <div className="text-uppercase">{footerTopIconText}</div>
        </button>
      </div>
    </div>
  </footer>)
}
