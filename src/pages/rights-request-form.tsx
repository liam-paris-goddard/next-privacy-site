import '../index.scss'
import { RightsRequestForm } from '@/components/RightsRequestForm/RightsRequestForm'
import ReactMarkdown from 'react-markdown'
import rrfContentData from '../../formatted-content/rights-request-form.json';
import schoolListData from '../../formatted-content/school-list.json';
import { CustomLayout } from '@/components/CustomLayout/CustomLayout';

export default function RightsRequestFormPage() {
    const { formCopy, staticFormOptions } = rrfContentData;
    return (
        <CustomLayout>

            <main className={'main-container'}>
                <div className="rights-request-form-container">
                    <h2 className='heading-2'>Rights Request Form</h2>
                    <div className='markdown-content'><ReactMarkdown>{formCopy.body}</ReactMarkdown></div>
                    <RightsRequestForm staticFormOptions={staticFormOptions} schoolListOptions={schoolListData}></RightsRequestForm>
                </div>
            </main>
        </CustomLayout>
    )
}
