import { FooterProps, HeaderProps } from "@/types/layoutTypes";
import { Footer } from "../footer/footer";
import { Header } from "../header/Header";

export const CustomLayout: React.FC<any> = ({ footerContent, headerContent, children }: { footerContent: FooterProps, headerContent: HeaderProps, children: React.ReactNode }) => {
    return (
        <>
            <Header {...headerContent}></Header>
            {children}
            <Footer {...footerContent}></Footer>
        </>
    )
};