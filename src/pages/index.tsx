import { Accordion } from '../components/Accordion/Accordion'
import '../index.scss'
import { RightsRequestForm } from '@/components/RightsRequestForm/RightsRequestForm'
import { FormattedSchoolListOption } from '@/components/RightsRequestForm/RightsRequestFormUtils'
import ReactMarkdown from 'react-markdown'
import { CustomLayout } from '@/components/CustomLayout/CustomLayout'
import * as homePageContentFile from '../../formatted-content/home-page.json';
import * as rrfContentFile from '../../formatted-content/rights-request-form.json';
import * as schoolListFile from '../../formatted-content/school-list.json';
const homePageContentData: any = homePageContentFile;
const rrfContentData: any = rrfContentFile;
const schoolListData: any = schoolListFile;

export default function Home({ introContent, sections, schoolListOptions, formCopy,
    staticFormOptions }: { introContent: any, sections: any[], schoolListOptions: FormattedSchoolListOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) {

    return (
        <CustomLayout>
            <main className={'main-container'}>
                <div className='markdown-content'>
                    {introContent.heading && <h1 className='heading-1'>{introContent.heading}</h1>}
                    {introContent.children && <ReactMarkdown>{introContent.children}</ReactMarkdown>}
                    <Accordion toggle sectionList={sections} />
                </div>
                <div className="rights-request-form-container">
                    <h2 className='heading-2'>Rights Request Form</h2>
                    <div className='markdown-content'><ReactMarkdown>{formCopy.body}</ReactMarkdown></div>
                    <RightsRequestForm staticFormOptions={staticFormOptions} schoolListOptions={schoolListOptions}></RightsRequestForm>
                </div>
            </main>
        </CustomLayout>
    )
}

export async function getStaticProps() {
    console.warn('!!!!')
    return {
        props: {
            introContent: homePageContentData.intro,
            sections: homePageContentData.sections,
            formCopy: rrfContentData?.formCopy,
            staticFormOptions: rrfContentData?.staticFormOptions,
            schoolListOptions: schoolListData
        }
    }
}
