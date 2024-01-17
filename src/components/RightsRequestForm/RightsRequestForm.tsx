import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { SNowTicketResponse, SNowTicketRequest, FormattedSchoolListOption, FormattedCityOption, FormattedActionsOption, SNowTicketVariables, SNowTicketPerson, FormValues, testSubmit, rightsRequestFormValidationSchema, represenativeInfoSchema, submitRequest } from './RightsRequestFormUtils';
import ReactMarkdown from 'react-markdown'
import './RightsRequestForm.scss';
import { useFormik } from 'formik';
import RadioGroup from '../radio/RadioGroup'
import Select, { OptionProps } from '../Select/select';
import { Input } from '../Input/input';
import CheckboxGroup from '../checkbox/CheckboxGroup';
import Checkbox from '../checkbox/Checkbox';
import '../../index.scss';

export const RightsRequestForm = ({ schoolListOptions, formCopy, staticFormOptions }: { schoolListOptions: FormattedSchoolListOption[], formCopy: { heading: string, body: string }, staticFormOptions: { relationshipList: string[], stateList: { [key: string]: string } } }) => {

    const [selectedStateData, setSelectedStateData] = useState<FormattedSchoolListOption>({} as FormattedSchoolListOption)
    const [schoolSelectStateOptions, setSchoolSelectStateOptions] = useState<OptionProps[]>([])
    const [selectedCityData, setSelectedCityData] = useState<FormattedCityOption>({} as FormattedCityOption)
    const [schoolSelectCityOptions, setSchoolSelectCityOptions] = useState<OptionProps[]>([])
    const [schoolSelectMarketingNameOptions, setSchoolSelectMarketingNameOptions] = useState<OptionProps[]>([])

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
            const ticketNumber = await submitRequest(values);
            setTicketNumber(ticketNumber)
        },
    });

    useEffect(() => {
        let tempSchoolStateSelectOptions: OptionProps[] = [{ value: '', label: 'Select your School State', disabled: true, selected: true, type: 'option' }]
        if (schoolListOptions) {
            tempSchoolStateSelectOptions = [...tempSchoolStateSelectOptions, ...schoolListOptions.map((option: FormattedSchoolListOption) => ({ value: option.state, label: option.state, type: 'option' }))];
        }
        setSchoolSelectStateOptions(tempSchoolStateSelectOptions)
    }, [])

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
        setSelectedStateData(schoolListOptions.find((option: FormattedSchoolListOption) => option.state === formik.values.schoolState) || {} as FormattedSchoolListOption);
        formik.setFieldValue('selectedActions', []);
    }, [formik.values.schoolState]);

    useEffect(() => {
        let tempSchoolCityOptions: OptionProps[] = [{ value: '', label: 'Select your School City', disabled: true, selected: true, type: 'option' }]
        if (selectedStateData?.cities) {
            tempSchoolCityOptions = [...tempSchoolCityOptions, ...selectedStateData.cities.map((city: FormattedCityOption) => ({ value: city.city, label: city.city, type: 'option' }))]
            if (formik.values.schoolState !== '') {
                tempSchoolCityOptions = [...tempSchoolCityOptions, { value: 'other', label: 'other', type: 'option' }]
            }
        }
        setSchoolSelectCityOptions(tempSchoolCityOptions)
        formik.setFieldValue('schoolCity', '');
    }, [selectedStateData])

    useEffect(() => {
        setSelectedCityData(selectedStateData?.cities?.find((option: FormattedCityOption) => option.city === formik.values.schoolCity) || {} as FormattedCityOption)
        console.warn(formik.values.schoolCity)
    }, [formik.values.schoolCity]);

    useEffect(() => {
        let tempSchoolMarketingNameOptions: OptionProps[] = [{ value: '', label: 'Select your School Name', disabled: true, selected: true, type: 'option' }]
        if (selectedCityData?.marketingNames) {
            tempSchoolMarketingNameOptions = [...tempSchoolMarketingNameOptions, ...selectedCityData.marketingNames.map((schoolName: string) => ({ value: schoolName, label: schoolName, type: 'option' }))]
        }
        if (formik.values.schoolCity !== '') {
            tempSchoolMarketingNameOptions = [...tempSchoolMarketingNameOptions, { value: 'other', label: 'other', type: 'option' }]
        }

        setSchoolSelectMarketingNameOptions(tempSchoolMarketingNameOptions)
        formik.setFieldValue('schoolMarketingName', '');
    }, [selectedCityData]);

    useEffect(() => {
    }, [schoolSelectMarketingNameOptions])

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


    const generateSchoolSelect = () => {
        return <fieldset>
            <Select helperText={formik.errors.schoolState && formik.touched.schoolState ? formik.errors.schoolState : ''} invalid={formik.touched.schoolState && !!(formik.errors.schoolState)} label="" name="schoolState" placeholder='Select a State' value={formik.values.schoolState} onChangeFunction={handleSelectChange} onBlurFunction={formik.handleBlur} optionList={schoolSelectStateOptions} />
            <Select helperText={formik.errors.schoolCity && formik.touched.schoolCity ? formik.errors.schoolCity : ''} invalid={formik.touched.schoolCity && !!(formik.errors.schoolCity)} label="" name="schoolCity" placeholder='Select a City' value={formik.values.schoolCity} onChangeFunction={handleSelectChange} onBlurFunction={formik.handleBlur} optionList={schoolSelectCityOptions} />
            <Select helperText={formik.errors.schoolMarketingName && formik.touched.schoolMarketingName ? formik.errors.schoolMarketingName : ''} invalid={formik.touched.schoolMarketingName && !!(formik.errors.schoolMarketingName)} label="" name="schoolMarketingName" placeholder='Select a School Name' value={formik.values.schoolMarketingName} onChangeFunction={handleSelectChange} onBlurFunction={formik.handleBlur} optionList={schoolSelectMarketingNameOptions} />
        </fieldset>


    }

    const generatePersonalInfoForm = (type: 'requestor' | 'representative') => {
        const titleText = type === 'requestor' && formik.values.isRequestFor === 'self' ? "Please enter your information." :
            type === 'requestor' && formik.values.isRequestFor === 'other' ? "Please enter the information for whom you are requesting" : "Please enter your information."
        const relationshipOptions = [{
            value: "",
            label: "Select Your Relationship",
            disabled: true,
            selected: true,
            type: 'option'
        }, ...staticFormOptions.relationshipList.map((relationship: string) => (
            {
                value: relationship,
                label: relationship,
                type: 'option'
            }
        ))]

        const stateOptions = [{
            value: "",
            label: "Select a State",
            disabled: true,
            selected: true,
            type: 'option'
        },
        ...Object.entries(staticFormOptions.stateList).map(([value, label]) => (
            {
                value: value,
                label: label,
                disabled: false,
                selected: false,
                type: 'option'
            }
        ))]
        return <fieldset className='personal-info-group'>
            <h3 className="heading-4" style={{ 'width': "100%" }}>{titleText}</h3>
            {type === 'requestor' && (
                <Select
                    label=""
                    name="selectedRelationship"
                    onBlurFunction={formik.handleBlur}
                    value={formik.values.selectedRelationship}
                    onChangeFunction={formik.handleChange}
                    optionList={relationshipOptions}
                    helperText={formik.errors.selectedRelationship && formik.touched.selectedRelationship ? formik.errors.selectedRelationship : ''}
                    invalid={formik.touched.selectedRelationship && !!(formik.errors.selectedRelationship)}
                />
            )}
            <Input helperText={formik.errors[`${type}Info`]?.firstName && formik.touched[`${type}Info`]?.firstName ? formik.errors[`${type}Info`]?.firstName : ''}
                invalid={formik.touched[`${type}Info`]?.firstName && !!(formik.errors[`${type}Info`]?.firstName)} label="" type="text" name={`${type}Info.firstName`} placeholder="firstName" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['firstName'] || ''}></Input>

            <Input helperText={formik.errors[`${type}Info`]?.lastName && formik.touched[`${type}Info`]?.lastName ? formik.errors[`${type}Info`]?.lastName : ''}
                invalid={formik.touched[`${type}Info`]?.lastName && !!(formik.errors[`${type}Info`]?.lastName)} label="" type="text" name={`${type}Info.lastName`} placeholder="lastName" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['lastName'] || ''}></Input>

            <Input helperText={formik.errors[`${type}Info`]?.phone && formik.touched[`${type}Info`]?.phone ? formik.errors[`${type}Info`]?.phone : ''}
                invalid={formik.touched[`${type}Info`]?.phone && !!(formik.errors[`${type}Info`]?.phone)} label="" type="tel" name={`${type}Info.phone`} placeholder="phone" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['phone'] || ''}></Input>

            <Input helperText={formik.errors[`${type}Info`]?.email && formik.touched[`${type}Info`]?.email ? formik.errors[`${type}Info`]?.email : ''}
                invalid={formik.touched[`${type}Info`]?.email && !!(formik.errors[`${type}Info`]?.email)} label="" type="email" name={`${type}Info.email`} placeholder="email" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['email'] || ''}></Input>

            <Input helperText={formik.errors[`${type}Info`]?.addressLine1 && formik.touched[`${type}Info`]?.addressLine1 ? formik.errors[`${type}Info`]?.addressLine1 : ''}
                invalid={formik.touched[`${type}Info`]?.addressLine1 && !!(formik.errors[`${type}Info`]?.addressLine1)} label="" type="text" name={`${type}Info.addressLine1`} placeholder="addressLine1" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['addressLine1'] || ''}></Input>

            <Input label="" type="text" name={`${type}Info.addressLine2`} placeholder="addressLine2" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['addressLine2'] || ''}></Input>

            <Input helperText={formik.errors[`${type}Info`]?.city && formik.touched[`${type}Info`]?.city ? formik.errors[`${type}Info`]?.city : ''}
                invalid={formik.touched[`${type}Info`]?.city && !!(formik.errors[`${type}Info`]?.city)} label="" type="text" name={`${type}Info.city`} placeholder="city" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['city'] || ''}></Input>

            <Select
                label=""
                name={`${type}Info.state`}
                value={formik.values[`${type}Info`]?.state || ''}
                onBlurFunction={formik.handleBlur}
                onChangeFunction={formik.handleChange}
                optionList={stateOptions}
                helperText={formik.errors[`${type}Info`]?.state && formik.touched[`${type}Info`]?.state ? formik.errors[`${type}Info`]?.state : ''}
                invalid={formik.touched[`${type}Info`]?.state && !!(formik.errors[`${type}Info`]?.state)}
            />
            <Input helperText={formik.errors[`${type}Info`]?.zip && formik.touched[`${type}Info`]?.zip ? formik.errors[`${type}Info`]?.zip : ''}
                invalid={formik.touched[`${type}Info`]?.zip && !!(formik.errors[`${type}Info`]?.zip)} label="" type="text" name={`${type}Info.zip`} placeholder="zip" onBlurFunction={formik.handleBlur} onChangeFunction={formik.handleChange} value={formik.values[`${type}Info`]['zip'] || ''}></Input>
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
        <div className='rights-request-form'>
            <div className='markdown-content'><ReactMarkdown>{formCopy.body}</ReactMarkdown></div>
            <form onSubmit={formik.handleSubmit}>
                <div className='is-request-for-radio-group'>
                    <RadioGroup name="isRequestFor"
                        label="Are you making this request for yourself or on behalf
                        of someone else?"
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
                    formik.values.isRequestFor && <div className='personal-info-group'>
                        {generatePersonalInfoForm('requestor')}

                        {formik.values.isRequestFor !== 'self' && generatePersonalInfoForm('representative')}

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
                    generateSchoolSelect()
                }
                {
                    <>
                        <CheckboxGroup name="selectedActions"
                            label="Please Select a requested action"
                            ariaLabelCheckboxGroup="selectedActions"
                            indeterminate={false}
                            helperText={formik.errors.selectedActions && formik.touched.selectedActions ? Array.isArray(formik.errors.selectedActions) ? formik.errors.selectedActions[0] : formik.errors.selectedActions : ''}
                            invalid={formik.touched.selectedActions && !!(formik.errors.selectedActions)}
                        >
                            {formik.values.schoolState && selectedStateData.availableActions?.map((action: FormattedActionsOption) =>
                                <>
                                    <Checkbox
                                        checked={formik.values.selectedActions.includes(action.name)}
                                        name={`selectedActions`}
                                        value={formik.values.selectedActions.find(selectedAction => action.name === selectedAction)}
                                        ariaLabelCheckbox={action.name}
                                        label={action.name}
                                        onChangeFunction={(e) => {
                                            formik.setFieldTouched('selectedActions', true, false);
                                            if (e.target.checked) {
                                                formik.setFieldValue('selectedActions', [...formik.values.selectedActions, action.name]);
                                            } else {
                                                formik.setFieldValue('selectedActions', formik.values.selectedActions.filter(item => item !== action.name));
                                            }
                                            formik.validateField('selectedActions');
                                            if (action.key === 'right_to_access') {
                                                formik.setFieldValue('selectedOptions', []);
                                            }
                                        }}
                                        onBlurFunction={() => formik.handleBlur}
                                    ></Checkbox>
                                    {<div>{
                                        formik.values.selectedActions.includes(action.name) && action.name === 'Right To Deletion' && <>
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
                                    </div>}


                                    {
                                        formik.values.selectedActions.includes(action.name) && action.name !== 'Right to Deletion' && action.options.length >= 1 &&
                                        <CheckboxGroup name="selectedOptions"
                                            label="Please Select a Right to Access option"
                                            ariaLabelCheckboxGroup="selectedOptions"
                                            indeterminate={false}
                                            helperText={formik.errors.selectedOptions && formik.touched.selectedOptions ? Array.isArray(formik.errors.selectedOptions) ? formik.errors.selectedOptions[0] : formik.errors.selectedOptions : ''}
                                            invalid={formik.touched.selectedOptions && !!(formik.errors.selectedOptions)}>
                                            {
                                                action.options.map(option => (<>
                                                    {/*<input
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
                                                    {option}*/}

                                                    <Checkbox
                                                        checked={formik.values.selectedOptions.includes(option)}
                                                        name={`selectedOptions`}
                                                        value={option}
                                                        ariaLabelCheckbox={option}
                                                        label={option}
                                                        onChangeFunction={(e) => {
                                                            formik.setFieldTouched('selectedOptions', true, false);
                                                            if (e.target.checked) {
                                                                formik.setFieldValue('selectedOptions', [...formik.values.selectedOptions, option]);
                                                            } else {
                                                                formik.setFieldValue('selectedOptions', formik.values.selectedOptions.filter(item => item !== option));
                                                            }
                                                            formik.validateField('selectedOptions');
                                                        }}
                                                    ></Checkbox>
                                                </>))
                                            }

                                        </CheckboxGroup>
                                    }
                                </>)
                            }
                        </CheckboxGroup>
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




