import { FooterSocialIcon } from "@/types/layoutTypes";


export const SocialIconList = ({ socialIconsTitle, socialIconList }: { socialIconsTitle: string; socialIconList: FooterSocialIcon[] }) => (
  <>
    <h3 className="gsi-font-size-large text-uppercase text-center">{socialIconsTitle}</h3>

    <div className="text-center">
      {socialIconList.map(item =>
        item.isEnabled && (
          <a key={item.targetUrl} className="gsi-footer__link gsi-footer__link--social" href={item.targetUrl} target={item.newTab ? '_blank' : ''} rel={item.newTab ? 'noopener noreferrer' : ''}>
            <img className="img-fluid" src={item.imageReference} alt={item.linkText} />
          </a>
        )
      )}
    </div></>
);

