import ReactMarkdown from 'react-markdown'
import '../index.scss'
import termsContentFile from '../../formatted-content/terms-and-conditions.json';
import { CustomLayout } from '@/components/CustomLayout/CustomLayout';
const termsContentData: any = termsContentFile;

export default function TermsAndConditions() {
    return (
        <CustomLayout>
            <main className={'main-container'}>
                <h1 className='heading-1'>Terms And Conditions</h1>
                <div className={'markdown-content'}>
                    <ReactMarkdown>{termsContentData.content}</ReactMarkdown>
                </div>
            </main>
        </CustomLayout>
    )
}