import Image from 'next/image'
import styles from '../app/page.module.css'
import fs from 'fs'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import '../index.scss'
import * as termsContentFile from '../../formatted-content/terms-and-conditions.json';
const termsContentData: any = termsContentFile;

export default function TermsAndConditions({ termsContent }: any) {
    return (
        <main className={'main-container'}>
            <h1 className='heading-1'>Terms And Conditions</h1>
            <div className={'markdown-content'}>
                <ReactMarkdown>{termsContent}</ReactMarkdown>
            </div>
        </main>
    )
}

export async function getStaticProps() {
    // List of files in blgos folder
    //const termsFile = fs.readFileSync('./content/terms-and-conditions/terms-and-conditions.md', 'utf8')

    //    const termsContent = matter(termsFile).content

    return {
        props: {
            termsContent: termsContentData.content
        }
    }

}