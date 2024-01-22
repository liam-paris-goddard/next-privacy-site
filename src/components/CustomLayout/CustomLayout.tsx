export const CustomLayout: React.FC<any> = ({ children }: { children: React.ReactNode }) => (
    <><header>
        header
    </header>
        {children}
        <footer>footer</footer></>
);