import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { SNowTicketResponse, SNowTicketRequest, FormattedFormOption, FormattedCityOption, FormattedActionsOption, SNowTicketVariables, SNowTicketPerson } from './RightsRequestFormTypes';
import ReactMarkdown from 'react-markdown'
import './RightsRequestForm.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export const phoneRegex = /\+?(\d{1,4}?)?[-. (]*(\d{1,3})[-. )]*(\d{1,3})[-. ]*(\d{1,9})/g;
export const requestorInfoSchema = Yup.object({
    firstName: Yup.string().required(' request firstName Required'),
    lastName: Yup.string().required(' request lastName Required'),
    phone: Yup.string().required(' request phone Required').matches(phoneRegex, ' request Phone number is not valid'),
    email: Yup.string().required(' request email Required').email(' request Invalid email'),
    addressLine1: Yup.string().required(' request addressLine1 Required'),
    addressLine2: Yup.string(),
    city: Yup.string().required(' request city Required'),
    state: Yup.string().required(' request state Required'),
    zip: Yup.string().required(' request zipRequired'),
});

export const represenativeInfoSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required(' rep lastName Required'),
    phone: Yup.string().required('rep phone Required').matches(phoneRegex, 'rep Phone number is not valid'),
    email: Yup.string().required('rep email Required').email('rep Invalid email'),
    addressLine1: Yup.string().required('rep addressLine1 Required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('rep city Required'),
    state: Yup.string().required('rep state Required'),
    zip: Yup.string().required('rep zipRequired'),
});

export const rightsRequestFormValidationSchema = Yup.object({
    schoolState: Yup.string().required('schoolState Required'),
    schoolCity: Yup.string().required('schoolCity Required'),
    schoolMarketingName: Yup.string().required('schoolMarketingName Required'),
    selectedActions: Yup.array().of(Yup.string()).min(1, 'At least one action is required'),
    selectedOptions: Yup.array().of(Yup.string()).when('selectedActions', (selectedActions, schema) => {
        const flattenedSelectedActions = [].concat(...selectedActions) as string[];
        return flattenedSelectedActions.includes('Right to Access') ? schema.min(1, 'At least one option is required for right to access') : schema;
    }),
    deletionOption: Yup.string().oneOf(['full', 'partial']).when('selectedActions', (selectedActions, schema) => (selectedActions.includes('Right to Deletion') ? schema.required('an option is required for right to deletion') : schema)),
    partialDeletionDetails: Yup.string(),
    isRequestFor: Yup.string().oneOf(['self', 'other']).required('is request for required'),
    selectedRelationship: Yup.string().required('selectedRelationship Required'),
    requestorInfo: requestorInfoSchema.required('Requestor Info Required'),
    deliveryType: Yup.string().oneOf(['email', 'mail']).required(' deliveryType Required'),
});

interface FormValues {
    schoolState: string;
    schoolCity: string;
    schoolMarketingName: string;
    selectedActions: string[];
    selectedOptions: string[];
    deletionOption: string;
    partialDeletionDetails: string;
    isRequestFor: string;
    selectedRelationship: string;
    requestorInfo: SNowTicketPerson
    representativeInfo: SNowTicketPerson;
    deliveryType: 'email' | 'mail';
}

export const RightsRequestForm = ({ formOptions, formCopy, staticFormOptions }: { formOptions: FormattedFormOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) => {


    const [selectedStateData, setSelectedStateData] = useState<FormattedFormOption>({} as FormattedFormOption)
    const [selectedCityData, setSelectedCityData] = useState<FormattedCityOption>({} as FormattedCityOption)
    const [submitState, setSubmitState] = useState<'unset' | 'success' | 'error'>('unset')
    const [ticketNumber, setTicketNumber] = useState<string>('')
    const formik = useFormik<FormValues>({
        initialValues: {
            schoolState: '',
            schoolCity: '',
            schoolMarketingName: '',
            selectedActions: [],
            selectedOptions: [],
            deletionOption: '',
            partialDeletionDetails: '',
            isRequestFor: '',
            selectedRelationship: '',
            requestorInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zip: '',
            },
            representativeInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zip: '',
            },
            deliveryType: 'email',
        },
        validate: (values: FormValues) => {
            const errors: { [key: string]: any } = {}
            if (values.isRequestFor === 'other') {
                try {
                    represenativeInfoSchema.validateSync(values.representativeInfo, { abortEarly: false });
                } catch (error: any) {
                    errors.representativeInfo = {};
                    error.inner.forEach((error: any) => {
                        const field = error.path;
                        const message = error.message;
                        errors.representativeInfo[field] = message;
                    });
                }
            }
            return errors;
        },
        validationSchema: rightsRequestFormValidationSchema,
        onSubmit: async (values) => {
            console.warn('submit called')
            const ticketNumber = await submitRequest(values);
            setTicketNumber(ticketNumber)
        },
    });
    useEffect(() => {
        if (!ticketNumber) {
            setSubmitState('unset')
        }
        else if (ticketNumber === '-1') {
            setSubmitState('error')
        } else {
            setSubmitState('success')
        }
    }, [ticketNumber])

    useEffect(() => {
        setSelectedStateData(formOptions.find((option: FormattedFormOption) => option.state === formik.values.schoolState) || {} as FormattedFormOption);
        formik.setFieldValue('schoolCity', '');
        formik.setFieldValue('schoolMarketingName', '');
    }, [formik.values.schoolState]);

    useEffect(() => {
        setSelectedCityData(selectedStateData?.cities?.find((option: FormattedCityOption) => option.city === formik.values.schoolCity) || {} as FormattedCityOption)
        formik.setFieldValue('schoolMarketingName', '');
    }, [formik.values.schoolCity]);


    useEffect(() => {
        formik.setFieldTouched('selectedActions')
        formik.validateField('selectedActions');
        formik.validateField('selectedOptions');
    }, [formik.values.selectedActions])

    useEffect(() => {
        formik.setFieldTouched('selectedOptions')
        formik.validateField('selectedOptions');
    }, [formik.values.selectedOptions])

    useEffect(() => {
        console.warn(formik.errors)
    }, [formik.errors])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name } = e.target;
        formik.setFieldTouched(name, true);
        formik.handleChange(e);
    }

    const submitButtonIsValid = () => {
        // Check if errors is an empty object
        if (Object.keys(formik.errors).length === 0) {
            return false;
        }

        // Check if errors has only one key 'representativeInfo' and it is an empty object
        if (Object.keys(formik.errors).length === 1 && formik.errors.hasOwnProperty('representativeInfo')) {
            if (formik.errors.representativeInfo && Object.keys(formik.errors.representativeInfo).length === 0) {
                return false;
            }
        }

        // If none of the above conditions are met, return false
        return true;
    }

    async function submitRequest(formValues: FormValues): Promise<string> {
        // format variables 
        let variables: SNowTicketVariables = {
            school_state: formValues.schoolState || '',
            school_city: formValues.schoolCity || '',
            school: formValues.schoolMarketingName || '',
            right_to_access: formValues.selectedActions.includes('Right to Access') ? 'true' : 'false',
            right_to_correction: formValues.selectedActions.includes('Right to Correction') ? 'true' : 'false',
            right_to_deletion: formValues.selectedActions.includes('Right to Deletion') ? 'true' : 'false',
            right_to_opt_out: formValues.selectedActions.includes("Right to opt-out (sale, share, targeted ads, profiling)") ? "true" : "false",
            right_to_limit_use: formValues.selectedActions.includes("Right to limit use") ? "true" : "false",
            right_to_data_portability: formValues.selectedActions.includes("Right to data portability") ? "true" : "false",
            right_to_appeal: formValues.selectedActions.includes("Right to Appeal") ? "true" : "false",
            yourself_or_someone: formValues.isRequestFor === 'self' ? "Myself" : "Someone Else",
            external_record: formValues.selectedRelationship || '',
            rf_first_name: formValues.requestorInfo.firstName || '',
            rf_last_name: formValues.requestorInfo.lastName || '',
            rf_phone: formValues.requestorInfo.phone || '',
            rf_email: formValues.requestorInfo.email || '',
            rf_address_one: formValues.requestorInfo.addressLine1 || '',
            rf_address_two: formValues.requestorInfo.addressLine2 || '',
            rf_city: formValues.requestorInfo.city || '',
            rf_state: formValues.requestorInfo.state || '',
            rf_zip: formValues.requestorInfo.zip || '',
            request_delivered: formValues.deliveryType ? "Email" : "Mail",
        };

        formValues.representativeInfo

        if (formValues.isRequestFor !== 'self' && formValues.representativeInfo) {
            variables = {
                ...variables,
                ar_first_name: formValues.representativeInfo.firstName,
                ar_last_name: formValues.representativeInfo.lastName,
                ar_phone: formValues.representativeInfo.phone,
                ar_email: formValues.representativeInfo.email,
                ar_address_one: formValues.representativeInfo.addressLine1,
                ar_address_two: formValues.representativeInfo.addressLine2,
                ar_city: formValues.representativeInfo.city,
                ar_state: formValues.representativeInfo.state,
                ar_zip: formValues.representativeInfo.zip
            }

        }
        if (variables.right_to_access === 'true') {
            variables = {
                ...variables,
                access_of_personal_information: formValues.selectedOptions.includes("I request access to specific pieces of personal information.") ? "true" : "false",
                access_of_categories_collected: formValues.selectedOptions.includes("I request access to categories of personal information you have collected.") ? "true" : "false",
                access_of_sources_collected: formValues.selectedOptions.includes("I request access to categories of sources from which my personal information was collected.") ? "true" : "false",
                access_of_categories_disclosed: formValues.selectedOptions.includes("I request access to categories of personal information that you have sold or disclosed.") ? "true" : "false",
                access_of_categories_third_parties: formValues.selectedOptions.includes("I request access to categories of third parties to whom my personal information was sold or disclosed for a business purpose.") ? "true" : "false",
            }
        }


        if (variables.right_to_deletion === 'true') {
            variables = {
                ...variables,
                request_type: formValues.deletionOption ? "Partial Deletion Request" : "FULL DELETION REQUEST",
            }

            if (variables.request_type === "Partial Deletion Request") {
                variables = {
                    ...variables,
                    information_to_be_deleted: formValues.partialDeletionDetails,
                    information_deleted: formValues.partialDeletionDetails,
                }
            }
        }

        const req: SNowTicketRequest = {
            sysparm_quantity: "1",
            variables: variables
        };

        console.warn(req);

        // API call to ServiceNow (SNow)
        try {
            const response = await axios.post<SNowTicketResponse>('/api/CreateSNowTicketRoute', req);

            return response.data.Result.request_number || '-1'
        } catch (error) {
            console.error(error);
            return '-1';
        }
    }

    const generatePersonalInfoForm = (type: 'requestor' | 'representative') => {
        const titleText = type === 'requestor' && formik.values.isRequestFor === 'self' ? "Please enter your information." :
            type === 'requestor' && formik.values.isRequestFor === 'other' ? "Please enter the information for whom you are requesting" : "Please enter your information."
        return <fieldset>
            <h3>{titleText}</h3>
            {type === 'requestor' && <select name="selectedRelationship" onBlur={formik.handleBlur} value={formik.values.selectedRelationship} onChange={formik.handleChange}>
                <option value="" disabled>Select Your Relationship</option>
                {
                    staticFormOptions.relationshipList.map((relationship: string) => (
                        <option value={relationship}>{relationship}</option>
                    ))
                }
            </select>}

            <input type="text" name={`${type}Info.firstName`} placeholder="firstName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.firstName || ''} />
            <input type="text" name={`${type}Info.lastName`} placeholder="lastName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.lastName || ''} />
            <input type="tel" name={`${type}Info.phone`} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.phone || ''} />
            <input type="email" name={`${type}Info.email`} placeholder="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.email || ''} />
            <input type="text" name={`${type}Info.addressLine1`} placeholder="addressLine1" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.addressLine1 || ''} />
            <input type="text" name={`${type}Info.addressLine2`} placeholder="addressLine2" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.addressLine2 || ''} />
            <input type="text" name={`${type}Info.city`} placeholder="city" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.city || ''} />
            <select name={`${type}Info.state`} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.state || ''}>
                <option value="" disabled>Select a State</option>
                {Object.entries(staticFormOptions.stateList).map(([value, label]) => (
                    <option value={value}>{label}</option>
                ))}
            </select>
            <input type="text" name={`${type}Info.zip`} placeholder="zip" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[`${type}Info`]?.zip || ''} />
        </fieldset>
    }

    const displayErrorMessages = () => {
        return (<>{

            Object.entries(formik.errors).filter(([key, value]) => value === 'Required').map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={key}>
                            {Object.values(value).filter((value) => value === 'Required').map((val, i) => (
                                <p key={`${key}-${val}`}>{val}</p>
                            ))}
                        </div >
                    );
                } else {
                    return <p key={key}>{value}</p>;
                }
            })}
            {
                Object.entries(formik.errors).find(([key, value]) => value === 'Required')
                && <p>Required fields are missing</p>
            }</>)
    }

    async function testSubmit() {
        const testReq = { "sysparm_quantity": "1", "variables": { "school_state": "California", "school_city": "Carlsbad", "school": "Carlsbad", "right_to_access": "false", "access_of_personal_information": "false", "access_of_categories_collected": "false", "access_of_sources_collected": "false", "access_of_categories_disclosed": "false", "access_of_categories_third_parties": "false", "right_to_correction": "false", "right_to_deletion": "false", "request_type": "Access", "information_to_be_deleted": "test", "information_deleted": "", "right_to_opt_out": "false", "right_to_limit_use": "false", "right_to_data_portability": "false", "right_to_appeal": "false", "yourself_or_someone": "Yourself", "external_record": "false", "rf_first_name": "test", "rf_last_name": "test", "rf_phone": "test", "rf_email": "test@test.com", "rf_address_one": "test", "rf_address_two": "test", "rf_city": "test", "rf_state": "test", "rf_zip": "test", "ar_first_name": "test", "ar_last_name": "test", "ar_phone": "test", "ar_email": "test@test.com", "ar_address_one": "test", "ar_address_two": "test", "ar_city": "test", "ar_state": "NJ", "ar_zip": "test", "request_delivered": "Email" } }
        try {
            const response = await axios.post<SNowTicketResponse>('/api/CreateSNowTicketRoute', testReq);

            return response.data.Result.request_number || '-1'
        } catch (error) {
            console.error(error);
            return '-1';
        }
    }

    return (
        <div>
            <button onClick={testSubmit}>okokok</button>
            <ReactMarkdown>{formCopy.body}</ReactMarkdown>
            <form onSubmit={formik.handleSubmit}>
                <p>Fields marked with a red asterisk (<span className="required">*</span>) are required to submit.</p>
                <fieldset>
                    <select name="schoolState" value={formik.values.schoolState} onChange={handleSelectChange} onBlur={formik.handleBlur}>
                        <option value="" disabled selected>Select your State</option>
                        {formOptions &&
                            formOptions.map((option: FormattedFormOption) => {
                                return <option value={option.state}>{option.state}</option>
                            })
                        }
                    </select>
                    {formik.touched.schoolState && formik.errors.schoolState ? <div>{formik.errors.schoolState}</div> : null}
                    <select name="schoolCity" value={formik.values.schoolCity} onChange={handleSelectChange} onBlur={formik.handleBlur}>
                        <option value="" disabled selected>Select your City</option>
                        {
                            selectedStateData?.cities && <>{selectedStateData.cities?.map((city: FormattedCityOption) => <option value={city.city}>{city.city}</option>)}

                            </>
                        }
                        {formik.values.schoolState !== '' && <option value={'other'}>other</option>}
                    </select>
                    {formik.touched.schoolCity && formik.errors.schoolCity ? <div>{formik.errors.schoolCity}</div> : null}

                    <select name="schoolMarketingName" value={formik.values.schoolMarketingName} onChange={handleSelectChange} onBlur={formik.handleBlur}>
                        <option value="" disabled selected>Select your School</option>
                        {
                            selectedCityData?.marketingNames && <>{selectedCityData.marketingNames?.map((schoolName: string) => <option value={schoolName}>{schoolName}</option>)}</>
                        }
                        {formik.values.schoolCity !== '' && <option value={'other'}>other</option>}
                    </select>
                    {formik.touched.schoolMarketingName && formik.errors.schoolMarketingName ? <div>{formik.errors.schoolMarketingName}</div> : null}
                </fieldset>

                {formik.values.schoolState && formik.touched.schoolMarketingName && <>
                    <fieldset>
                        {formik.values.schoolState && selectedStateData.availableActions?.map((action: FormattedActionsOption) =>
                            <>

                                <label>
                                    <input type="checkbox" name={`selectedActions`}
                                        value={formik.values.selectedActions.find(selectedAction => action.name === selectedAction)}
                                        onBlur={() => formik.handleBlur}
                                        onChange={(e) => {
                                            formik.setFieldTouched('selectedActions', true, false);
                                            if (e.target.checked) {
                                                formik.setFieldValue('selectedActions', [...formik.values.selectedActions, action.name]);
                                            } else {
                                                formik.setFieldValue('selectedActions', formik.values.selectedActions.filter(item => item !== action.name));
                                            }
                                            formik.validateField('selectedActions');

                                        }
                                        }
                                    /> {action.name}
                                </label>
                                {
                                    formik.values.selectedActions.includes(action.name) && action.name === 'Right to Deletion' &&
                                    <fieldset>
                                        <label>
                                            <input
                                                name="deletionOption"
                                                type="radio"
                                                value="full"
                                                checked={formik.values.deletionOption === 'full'}
                                                onChange={formik.handleChange}
                                            />
                                            {action.options[0]}
                                        </label>
                                        <label>
                                            <input
                                                name="deletionOption"
                                                type="radio"
                                                value='partial'
                                                checked={formik.values.deletionOption === 'partial'}
                                                onChange={formik.handleChange}
                                            />
                                            {action.options[1]}
                                        </label>
                                        {
                                            formik.values.deletionOption === 'partial' &&
                                            <textarea
                                                name="partialDeletionDetails"
                                                onChange={formik.handleChange}
                                                value={formik.values.partialDeletionDetails}
                                            />
                                        }
                                    </fieldset>
                                }
                                {
                                    formik.values.selectedActions.includes(action.name) && action.name !== 'Right to Deletion' && action.options.length >= 1 &&
                                    <fieldset>
                                        {
                                            action.options.map(option => (<>
                                                <input
                                                    type="checkbox"
                                                    name="selectedOptions"
                                                    value={option}
                                                    checked={formik.values.selectedOptions.includes(option)}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(e) => {
                                                        formik.setFieldTouched('selectedOptions', true, false);
                                                        if (e.target.checked) {
                                                            formik.setFieldValue('selectedOptions', [...formik.values.selectedOptions, option]);
                                                        } else {
                                                            formik.setFieldValue('selectedOptions', formik.values.selectedOptions.filter(item => item !== option));
                                                        }
                                                        formik.validateField('selectedOptions');
                                                    }}

                                                />
                                                {option}</>))
                                        }

                                    </fieldset>
                                }
                            </>)
                        }
                    </fieldset>
                    <fieldset>
                        {formik.errors.selectedActions && <div>{formik.errors.selectedActions}</div>}
                        {formik.errors.selectedOptions && <div>{formik.errors.selectedOptions}</div>}
                        <label>
                            <input
                                disabled={!!(formik.errors.selectedActions) || !!(formik.errors.selectedOptions)}
                                name="isRequestFor"
                                type="radio"
                                value="self"
                                checked={formik.values.isRequestFor === 'self'}
                                onChange={formik.handleChange}
                            />
                            Myself
                        </label>
                        <label>
                            <input
                                disabled={!!(formik.errors.selectedActions) || !!(formik.errors.selectedOptions)}
                                name="isRequestFor"
                                type="radio"
                                value="other"
                                checked={formik.values.isRequestFor === 'other'}
                                onChange={formik.handleChange}
                            />
                            Someone Else
                        </label>
                    </fieldset>
                </>}
                {formik.values.isRequestFor && <fieldset>
                    {generatePersonalInfoForm('requestor')}

                    {formik.values.isRequestFor !== 'self' && generatePersonalInfoForm('representative')}
                    <input type="radio" name="deliveryType" value="email" checked={formik.values.deliveryType === 'email'} onChange={formik.handleChange} /> Email
                    <input type="radio" name="deliveryType" value="mail" checked={formik.values.deliveryType === 'mail'} onChange={formik.handleChange} /> Mail
                </fieldset>
                }
                {displayErrorMessages()}
                <button type="submit" >Submit</button>
            </form>

            <h3>{ticketNumber}</h3>
            {submitState === 'success' && <div>Success</div>}
            {submitState === 'error' && <div>Error</div>}
            {submitState === 'unset' && <div>unset</div>}
        </div >

    )






}




