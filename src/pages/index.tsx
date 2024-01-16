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
import { formatSchoolList } from '@/utils/formatUtils'
import { FormattedSchoolListOption } from '@/components/RightsRequestForm/RightsRequestFormUtils'
import { formatHomePageData, formatRRFData } from '@/utils/contentFormat'
import { generateSchoolList } from '@/utils/schoolList'

export default function Home({ sections, schoolListOptions, formCopy,
    staticFormOptions }: { sections: any[], schoolListOptions: FormattedSchoolListOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) {
    return (
        <main className={styles.main}>
            <Accordion defaultOpen sectionList={sections} />
            {/*}
            <h1>index baby</h1>
            <div className={styles.description}>
                <p>
                    Get started by editing&nbsp;
                    <code className={styles.code}>src/app/page.tsx</code>
                </p>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div className={styles.center}>
                <Image
                    className={styles.logo}
                    src="/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
            </div>

            <div className={styles.grid}>
                <a
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Docs <span>-&gt;</span>
                    </h2>
                    <p>Find in-depth information about Next.js features and API.</p>
                </a>

                <a
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Learn <span>-&gt;</span>
                    </h2>
                    <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
                </a>

                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Templates <span>-&gt;</span>
                    </h2>
                    <p>Explore starter templates for Next.js.</p>
                </a>

                <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Deploy <span>-&gt;</span>
                    </h2>
                    <p>
                        Instantly deploy your Next.js site to a shareable URL with Vercel.
                    </p>
                </a>
            </div>
*/}
            <RightsRequestForm staticFormOptions={staticFormOptions} formCopy={formCopy} schoolListOptions={schoolListOptions}></RightsRequestForm>
        </main >
    )
}

export async function getStaticProps() {

    const filesInHomePage = fs.readdirSync('./content/home-page');
    const stateInfoFiles = fs.readdirSync('./content/avaliable-states-and-actions');
    const formCopyFile = fs.readFileSync('./content/rights-request-form/rights-request-form.md', 'utf8')

    const landingPageArr = filesInHomePage.map((fileName) => {
        return fs.readFileSync(`./content/home-page/${fileName}`, 'utf8');
    })

    const stateInfoArr = stateInfoFiles.map((fileName) => fs.readFileSync(`./content/avaliable-states-and-actions/${fileName}`, 'utf8'));

    const schoolListOptions = await generateSchoolList(stateInfoArr);
    const formContent = formatRRFData(formCopyFile, rrfOptions);
    return {
        props: {
            sections: formatHomePageData(landingPageArr),
            formCopy: formContent.formCopy,
            staticFormOptions: formContent.staticFormOptions,
            schoolListOptions
        }
    }
}