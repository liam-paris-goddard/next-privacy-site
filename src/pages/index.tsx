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
import { FormattedFormOption } from '@/components/RightsRequestForm/RightsRequestFormTypes'
import { format } from 'path'


const formatLandingSections = (landingMarkDown: string[]) => landingMarkDown.map(filename => {
    const file = fs.readFileSync(`./content/home-page/${filename}`, 'utf8')
    const matterData = matter(file)

    return {
        heading: matterData.data.heading,
        order: matterData.data.order,
        children: matterData.content,
        headingLevel: null
    }
}).sort((a, b) => a.order - b.order).map(({ heading, children, order }) => ({ heading, children }))

export default function Home({ sections, formOptions, }: { sections: any[], formOptions: FormattedFormOption[] }) {
    return (
        <main className={styles.main}>
            {formOptions && (
                <p>
                    {JSON.stringify(formOptions)}
                </p>
            )}
            <Select
                helperText={"helper text"}
                label={"label"}
                required
                name="testOption"
                placeholder={"test"}
                optionList={[{
                    label: 'test group',
                    type: 'optionGroup',
                    options: [{
                        value: 'test1',
                        label: 'test1',
                        selected: true,
                        type: 'option'
                    }, {
                        value: 'test2',
                        label: 'test2',
                        type: 'option'
                    }, {
                        value: 'test3',
                        label: 'test3',
                        type: 'option'
                    }]
                }, {
                    value: 'test4',
                    label: 'test4',
                    type: 'option'
                }, {
                    value: 'test5',
                    label: 'test5',
                    type: 'option'
                },]}>

            </Select>
            <Accordion defaultOpen sectionList={sections} />
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

            <RightsRequestForm formOptions={formOptions}></RightsRequestForm>
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
    const filesInHomePage = fs.readdirSync('./content/home-page')

    let formOptions = [] as FormattedFormOption[]
    if (schoolList) {
        formOptions = formatSchoolList(schoolList)
    }
    return {
        props: {
            sections: formatLandingSections(filesInHomePage),
            formOptions
        }
    }
}