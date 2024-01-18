import Image from 'next/image'
import styles from '../app/page.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

export default function TermsAndConditions({ termsContent }: any) {
    return (
        <main className={styles.main}>
            <div className={'markdown-content'}>
                <ReactMarkdown>{termsContent}</ReactMarkdown>
            </div>
        </main>
    )
}

export async function getStaticProps() {
    // List of files in blgos folder
    const termsFile = fs.readFileSync('./content/xterms-and-conditions/terms-and-conditions.md', 'utf8')

    const termsContent = matter(termsFile).content

    return {
        props: {
            termsContent
        }
    }

}