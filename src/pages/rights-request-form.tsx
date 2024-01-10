import Image from 'next/image'
import styles from '../app/page.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import { Accordion } from '../components/Accordion/Accordion'
import '../index.scss'
import Select from '../components/Select/select'
import { D365, School } from '../utils/D365';
import rrfOptions from '../../public/rrfOptions.json'
import { RightsRequestForm } from '@/components/RightsRequestForm/RightsRequestForm'
import { formatSchoolList } from '@/utils/formatUtils'
import { FormattedFormOption } from '@/components/RightsRequestForm/RightsRequestFormUtils'

export default function RightsRequestFormPage({ formOptions, formCopy,
    staticFormOptions }: { formOptions: FormattedFormOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) {
    return (
        <main className={styles.main}>
            <RightsRequestForm staticFormOptions={staticFormOptions} formCopy={formCopy} formOptions={formOptions}></RightsRequestForm>
        </main >
    )
}

export async function getStaticProps() {

    const d365 = new D365(
        process.env.D365_AUTH_URL,
        process.env.D365_CLIENT_ID,
        process.env.D365_CLIENT_SECRET,
        process.env.D365_BASE_URL
    );

    await d365.init();

    // Call the getSchools method
    const schoolList = await d365.getSchools(rrfOptions.AvailableState)
        .catch(error => {
            // Handle any errors
            console.error(error);
        });

    // List of files in blgos folder
    const formCopyFile = fs.readFileSync('./content/rights-request-form/rights-request-form.md', 'utf8')

    const formCopyMatterData = matter(formCopyFile)

    //TODO: put form copy into mark down page and pass to rrform component
    let formOptions = [] as FormattedFormOption[]
    if (schoolList) {
        formOptions = formatSchoolList(schoolList)
    }
    const staticFormOptions = {
        relationshipList: rrfOptions.Relationships,
        stateList: rrfOptions.StatesAndTerritories,
    }
    return {
        props: {
            formCopy: { heading: formCopyMatterData.data.heading, body: formCopyMatterData.content },
            formOptions,
            staticFormOptions
        }
    }
}