import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { SNowTicketResponse, SNowTicketRequest, FormattedFormOption, FormattedCityOption, FormattedActionsOption, SNowTicketVariables, SNowTicketPerson, FormValues, testSubmit, rightsRequestFormValidationSchema, represenativeInfoSchema } from './RightsRequestFormUtils';
import ReactMarkdown from 'react-markdown'
import './RightsRequestForm.scss';
import { useFormik } from 'formik';
import RadioGroup from '../radio/RadioGroup'


export const RightsRequestForm = ({ formOptions, formCopy, staticFormOptions }: { formOptions: FormattedFormOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) => {

    const [selectedStateData, setSelectedStateData] = useState<FormattedFormOption>({} as FormattedFormOption)
    const [selectedCityData, setSelectedCityData] = useState<FormattedCityOption>({} as FormattedCityOption)
    const [submitState, setSubmitState] = useState<'unset' | 'success' | 'error'>('unset')
    const [ticketNumber, setTicketNumber] = useState<string>('')
    const [showSchoolSelect, setShowSchoolSelect] = useState<boolean>(false);
    const [showActions, setShowActions] = useState<boolean>(false);
    const formik = useFormik<FormValues>({
        initialValues: {
            schoolState: '',
            schoolCity: '',
            schoolMarketingName: '',
            selectedActions: [],
            selectedOptions: [],
            deletionOption: '',
            partialDeletionDetails: '',
            isRequestFor: 'self',
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
                    error.inner?.forEach((error: any) => {
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
        setShowSchoolSelect(handleShowSchoolSelect())
        setShowActions(handleShowActions())
    }, [formik.values, formik.errors, formik.touched]);

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

    const handleShowActions = () => {
        if (!showActions) {
            if (!formik.errors.schoolState && !formik.errors.schoolCity && !formik.errors.schoolMarketingName && formik.touched.schoolState && formik.touched.schoolCity && formik.touched.schoolMarketingName) {
                return true;
            }

            return false;
        }
        return true;
    }

    const handleShowSchoolSelect = () => {
        if (!showSchoolSelect) {
            if (!formik.errors.requestorInfo && formik.touched.requestorInfo) {
                if (formik.values.isRequestFor === 'other') {
                    return (!(!!formik.errors.representativeInfo) && !!(formik.touched.representativeInfo));
                }
                return true;
            }

            return false;
        }
        return true;
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



    return (
        <div>
            <button onClick={testSubmit}>okokok</button>
            <ReactMarkdown>{formCopy.body}</ReactMarkdown>
            <form onSubmit={formik.handleSubmit}>
                <p>Fields marked with a red asterisk (<span className="required">*</span>) are required to submit.</p>
                <div>
                    <h3>Are you making this request for yourself or on behalf
                        of someone else?</h3>
                    <RadioGroup name="isRequestFor"
                        label=""
                        helperText={formik.errors.isRequestFor && formik.touched.isRequestFor ? formik.errors.isRequestFor : ''}
                        inline={true}
                        required={true}
                        buttons={[
                            {
                                label: 'Myself',
                                value: 'self',
                                checked: formik.values.isRequestFor === 'self',
                            },
                            {
                                label: 'Someone Else',
                                value: 'other',
                                checked: formik.values.isRequestFor === 'other',
                            },
                        ]}
                        onChangeFunction={formik.handleChange}
                        onBlurFunction={formik.handleBlur}
                    />
                </div>
                {
                    formik.values.isRequestFor && <div><fieldset>
                        {generatePersonalInfoForm('requestor')}

                        {formik.values.isRequestFor !== 'self' && generatePersonalInfoForm('representative')}
                    </fieldset>
                        {

                            <RadioGroup name="deliveryType"
                                label=""
                                helperText={formik.errors.deliveryType && formik.touched.deliveryType ? formik.errors.deliveryType : ''}
                                inline={true}
                                required={true}
                                buttons={[
                                    {
                                        label: 'Email',
                                        value: 'email',
                                        checked: formik.values.deliveryType === 'email',
                                    },
                                    {
                                        label: 'Mail',
                                        value: 'mail',
                                        checked: formik.values.deliveryType === 'mail',
                                    },
                                ]}
                                onChangeFunction={formik.handleChange}
                                onBlurFunction={formik.handleBlur}
                            />}</div>
                }
                {
                    showSchoolSelect && <fieldset>
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
                }
                {
                    showActions && <>
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
                                    <div>{
                                        formik.values.selectedActions.includes(action.name) && action.name === 'Right to Deletion' && <>
                                            <RadioGroup name="deletionOption"
                                                label=""
                                                helperText={formik.errors.deletionOption && formik.touched.deletionOption ? formik.errors.deletionOption : ''}
                                                required={formik.values.selectedActions.includes('Right to Deletion')}
                                                buttons={[
                                                    {
                                                        label: action.options[0],
                                                        value: 'full',
                                                        checked: formik.values.deletionOption === 'full',
                                                    },
                                                    {
                                                        label: action.options[1],
                                                        value: 'partial',
                                                        checked: formik.values.deletionOption === 'partial',
                                                    },
                                                ]}
                                                onChangeFunction={formik.handleChange}
                                                onBlurFunction={formik.handleBlur}
                                            />

                                            {
                                                formik.values.deletionOption === 'partial' &&
                                                <textarea
                                                    name="partialDeletionDetails"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.partialDeletionDetails}
                                                />
                                            }</>}
                                    </div>
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
                    </>
                }

                {displayErrorMessages()}
                <button type="submit" >Submit</button>
            </form >

            <h3>{ticketNumber}</h3>
            {submitState === 'success' && <div>Success</div>}
            {submitState === 'error' && <div>Error</div>}
            {submitState === 'unset' && <div>unset</div>}
        </div >

    )






}




