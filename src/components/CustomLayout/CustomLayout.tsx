import { FooterProps, HeaderProps } from "@/types/layoutTypes";
import { Footer } from "../footer/footer";
import { Header, HeaderItem } from "../header/header";

export const CustomLayout: React.FC<any> = ({ footerContent, headerContent, children }: { footerContent: FooterProps, headerContent: HeaderProps, children: React.ReactNode }) => {
    //TODO: create function to format headerContent
    //TODO: pass through on each page component

    const headerItems: HeaderItem[] = [{
        title: 'Privacy Policy',
        isActive: true,
        link: '/',
        target: '_self',
    },
    {
        title: 'Rights Request Form',
        isActive: false,
        link: '/rights-request-form',
        target: '_self',
    },
    {
        title: 'Terms & Conditions',
        isActive: false,
        link: '/terms-and-conditions',
        target: '_self',
    },
    {
        title: 'Real link 1',
        isActive: false,
        link: '/terms-and-conditions',
        target: '_self',
    },
    {
        title: 'Real link 2',
        isActive: false,
        link: '/terms-and-conditions',
        target: '_self',
    },
    {
        title: 'real link 3',
        isActive: false,
        link: '/terms-and-conditions',
        target: '_self',
    }]

    return (
        <>
            <Header {...headerContent}></Header>
            {children}
            <Footer {...footerContent}></Footer>
        </>
    )
};