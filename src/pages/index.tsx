import Image from 'next/image'
import styles from '../app/page.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import { Accordion } from '../components/Accordion/Accordion'
import '../index.scss'
import Select from '../components/Select/select'
import { D365, School } from '../utils/D365';
import rrfOptions from '../utils/rrfOptions'
import { RightsRequestForm } from '@/components/RightsRequestForm/RightsRequestForm'
import { FormattedSchoolListOption } from '@/components/RightsRequestForm/RightsRequestFormUtils'
import { formatHomePageData, formatRRFData } from '@/utils/contentFormat'
import { generateSchoolList } from '@/utils/schoolList'
import ReactMarkdown from 'react-markdown'

export default function Home({ introContent, sections, schoolListOptions, formCopy,
    staticFormOptions }: { introContent: any, sections: any[], schoolListOptions: FormattedSchoolListOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) {

    return (
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
    )
}

export async function getStaticProps() {

    const filesInHomePage = fs.readdirSync('./content/home-page') || [];
    const stateInfoFiles = fs.readdirSync('./content/avaliable-states-and-actions') || [];
    const formCopyFile = fs.readFileSync('./content/rights-request-form/rights-request-form.md', 'utf8') || ''

    const landingPageArr = filesInHomePage.map((fileName) => {
        return fs.readFileSync(`./content/home-page/${fileName}`, 'utf8');
    })

    const stateInfoArr = stateInfoFiles.map((fileName) => fs.readFileSync(`./content/avaliable-states-and-actions/${fileName}`, 'utf8'));

    const schoolListOptions = await generateSchoolList(stateInfoArr);
    const formContent = formatRRFData(formCopyFile, rrfOptions);
    const formattedSections = formatHomePageData(landingPageArr);
    const intro = formattedSections.shift();
    return {
        props: {
            introContent: intro,
            sections: formattedSections,
            formCopy: formContent?.formCopy,
            staticFormOptions: formContent?.staticFormOptions,
            schoolListOptions
        }
    }
}