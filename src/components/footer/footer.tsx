import { useEffect, useState } from "react"
import { LegalLinks } from "./legal-links-list/legal-links-list";
import { LinkList } from "./links-list/links-list";
import { SocialIconList } from "./social-links-list.tsx/social-links-list";
import './footer.scss'
import { FooterProps } from "@/types/layoutTypes";


export const Footer = ({
  imageReference,
  logoAltText,
  links,
  socialIconsTitle,
  socialIconList,
  copyright,
  legalLinksList,
  footerTopIconText }: FooterProps) => {

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


  return (<div className="experiencefragment aem-GridColumn aem-GridColumn--default--12">
    <div id="experiencefragment-8d053c257a" className="cmp-experiencefragment cmp-experiencefragment--footer">
      <div className="xf-content-height">



        <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">

          <div className="responsivegrid aem-GridColumn aem-GridColumn--default--12">


            <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">

              <div className="school-breadcrumb aem-GridColumn aem-GridColumn--default--12"><nav id="school-breadcrumb-bd1ff8ad54" className="cmp-breadcrumb" aria-label="Breadcrumb">

              </nav>


              </div>
              <div className="footer aem-GridColumn aem-GridColumn--default--12"><footer className="gsi-footer" id="gsiFooter">
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
              </footer></div >


            </div >
          </div >


        </div >

      </div ></div >


  </div >)
}
