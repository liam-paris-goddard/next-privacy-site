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
    id?: string;
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