import { Footer } from "../footer/footer";

export const CustomLayout: React.FC<any> = ({ children }: { children: React.ReactNode }) => {
    const footerCopyright = "© 2024 Goddard Franchisor LLC";
    const footerLegalLinksList = [{
        targetUrl: 'privacy.goddardsystems.com',
        newTab: true,
        linkText: 'Privacy Policy'
    }, {
        targetUrl: 'privacy.goddardsystems.com/home/TermsAndConditions',
        newTab: true,
        linkText: 'Terms & Conditions'
    }, {
        targetUrl: 'privacy.goddardsystems.com/#OneTrustToggle',
        newTab: true,
        linkText: 'Cookie Management'
    }, {
        targetUrl: 'https://privacy.goddardsystems.com/Form',
        newTab: true,
        linkText: 'Do Not Sell or Share My Personal Information'
    }]



    const footerTitle = ""; //TODO
    const footerImageReference = ''//TODO
    const footerLogoAltText = ''//TODO
    const footerLinks = [{
        newTab: true,
        link: '/test',
        linkText: 'About Us',
        targetUrl: '/test'
    }, {
        newTab: true,
        link: '/test',
        linkText: 'School Locations',
        targetUrl: '/test'
    }, {
        newTab: true,
        link: '/test',
        linkText: 'FAQs',
        targetUrl: '/test'
    }]//TODO
    const footerSocialIconsTitle = 'CONNECT WITH US!'//TODO
    const footerSocialIconList = [{
        isEnabled: true,
        targetUrl: '/social-test',
        newTab: true,
        imageReference: '/',
        linkText: '/social-test'
    }, {
        isEnabled: true,
        targetUrl: '/social-test',
        newTab: true,
        imageReference: '/',
        linkText: '/social-test'
    }, {
        isEnabled: true,
        targetUrl: '/social-test-2',
        newTab: true,
        imageReference: '/',
        linkText: '/social-test-3'
    }]//TODO
    const footerTopIconText = ''//TODO
    return (
        <><header>
            header
        </header>
            {children}
            <Footer
                footerTitle={footerTitle}
                copyright={footerCopyright}
                imageReference={footerImageReference}
                logoAltText={footerLogoAltText}
                links={footerLinks}
                socialIconsTitle={footerSocialIconsTitle}
                socialIconList={footerSocialIconList}
                legalLinksList={footerLegalLinksList}
                footerTopIconText={footerTopIconText}></Footer>
        </>
    )
};