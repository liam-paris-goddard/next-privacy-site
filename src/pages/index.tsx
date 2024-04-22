import { Accordion } from '../components/Accordion/Accordion'
import '../index.scss'
import { RightsRequestForm } from '@/components/RightsRequestForm/RightsRequestForm'
import { FormattedSchoolListOption, StaticFormData } from '@/components/RightsRequestForm/RightsRequestFormUtils'
import ReactMarkdown from 'react-markdown'
import { CustomLayout } from '@/components/CustomLayout/CustomLayout'
import homePageContentData from '../../formatted-content/home-page.json';
import rrfContentData from '../../formatted-content/rights-request-form.json';
import schoolListData from '../../formatted-content/school-list.json';
import footerContent from '../../formatted-content/footerContent.json';
import headerContent from '../../formatted-content/headerContent.json';


export default function Home() {
    const { intro, sections } = homePageContentData;
    const { formCopy, staticFormOptions } = rrfContentData;
    const formattedHeaderContent = headerContent;
    return (
        <CustomLayout footerContent={footerContent} headerContent={formattedHeaderContent}>
            <main className={'main-container'}>
                <div className='markdown-content'>
                    {intro.heading && <h1 className='heading-1'>{intro.heading}</h1>}
                    {intro.children && <ReactMarkdown>{intro.children}</ReactMarkdown>}
                    <Accordion toggle sectionList={sections} />
                </div>
                <div className="rights-request-form-container">
                    <h2 className='heading-2'>Rights Request Form</h2>
                    <div className='markdown-content'><ReactMarkdown>{formCopy.body}</ReactMarkdown></div>
                    <RightsRequestForm staticFormOptions={staticFormOptions} schoolListOptions={schoolListData}></RightsRequestForm>
                </div>
            </main>
        </CustomLayout>
    )
}