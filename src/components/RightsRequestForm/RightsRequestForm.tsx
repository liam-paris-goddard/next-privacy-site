import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CcpaRequestViewModel, SNowTicketResponse, SNowTicketRequest, FormattedFormOption, FormattedCityOption, FormattedActionsOption, SNowTicketVariables, SNowTicketPerson } from './RightsRequestFormTypes';
import ReactMarkdown from 'react-markdown'

export const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
export const phoneRegex = /^\d{10}$/;




export const RightsRequestForm = ({ formOptions, formCopy, staticFormOptions }: { formOptions: FormattedFormOption[], formCopy: { heading: string, body: string }, staticFormOptions: { [key: string]: string[] } }) => {

    const [submitState, setSubmitState] = useState<'unset' | 'success' | 'error'>('unset')
    const [formErrors, setFormErrors] = useState<{ field: string, error: string }[]>([]);
    const [inputErrorFlags, setInputErrorFlags] = useState<string[]>([]);

    const [selectedState, setSelectedState] = useState<string>('')
    const [selectedStateData, setSelectedStateData] = useState<FormattedFormOption>({} as FormattedFormOption)
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedCityData, setSelectedCityData] = useState<FormattedCityOption>({} as FormattedCityOption)
    const [selectedSchool, setSelectedSchool] = useState<string>('');
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isRequestForSelf, setIsRequestForSelf] = useState<boolean>(true);
    const [selectedRelationship, setSelectedRelationship] = useState<string>('');
    const [requestorInfo, setRequestorInfo] = useState<SNowTicketPerson>({} as SNowTicketPerson);
    const [represenativeInfo, setRepresenativeInfo] = useState<SNowTicketPerson>({} as SNowTicketPerson);
    const [deliverViaEmail, setDeliverViaEmail] = useState<boolean>(true)
    const [isPartialDeletion, setIsPartialDeletion] = useState<boolean>(true);
    const [partialDeletionDetails, setPartialDeletionDetails] = useState<string>('');


    useEffect(() => {
        setSelectedStateData(formOptions.find((option: FormattedFormOption) => option.state === selectedState) || {} as FormattedFormOption)
    }, [selectedState])
    useEffect(() => {
        setSelectedCityData(selectedStateData?.cities?.find((option: FormattedCityOption) => option.city === selectedCity) || {} as FormattedCityOption)
    }, [selectedCity])


    const validateForm = () => {
        const errors: { field: string, error: string | undefined }[] = [];
        if (!selectedState.state) {
            errors.push({ field: `state`, error: `Please select a state` })
        }
        if (!selectedCity.city) {
            errors.push({ field: `city`, error: `Please select a city` })
        }
        if (!selectedSchool) {
            errors.push({ field: `school`, error: `Please select a school` })
        }
        if (!requestorInfo.firstName) {
            errors.push({ field: `firstName`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  first name ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.lastName) {
            errors.push({ field: `lastName`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  last name ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.phone) {
            errors.push({ field: `phone`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  phone number ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.email) {
            errors.push({ field: `email`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  email address ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.addressLine1) {
            errors.push({ field: `addressLine1`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  address ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.city) {
            errors.push({ field: `city`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  city ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.state) {
            errors.push({ field: `state`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  state ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!requestorInfo.zip) {
            errors.push({ field: `zip`, error: `Please enter ${!isRequestForSelf ? 'the' : 'your'}  zip code ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (!represenativeInfo.firstName) {
            errors.push({ field: `firstName`, error: `Please enter your first name` })
        }
        if (!represenativeInfo.lastName) {
            errors.push({ field: `lastName`, error: `Please enter your last name` })
        }
        if (!represenativeInfo.phone) {
            errors.push({ field: `phone`, error: `Please enter your phone number` })
        }
        if (!represenativeInfo.email) {
            errors.push({ field: `email`, error: `Please enter your email address` })
        }
        if (!represenativeInfo.addressLine1) {
            errors.push({ field: `addressLine1`, error: `Please enter your address` })
        }
        if (!represenativeInfo.city) {
            errors.push({ field: `city`, error: `Please enter your city` })
        }
        if (!represenativeInfo.state) {
            errors.push({ field: `state`, error: `Please enter your state` })
        }
        if (!represenativeInfo.zip) {
            errors.push({ field: `zip`, error: `Please enter your zip code` })
        }
        if (!selectedRelationship) {
            errors.push({ field: `relationship`, error: `Please select your relationship to Goddard ${!isRequestForSelf ? 'of the person you are requesting for' : ''}` })
        }
        if (selectedActions.length === 0) {
            errors.push({ field: `actions`, error: `Please select at least one action` })
        }
        if (selectedActions.includes(`Right to Access`) && selectedOptions.length === 0) {
            errors.push({ field: `accessOptions`, error: `Please select at least one option from the 'Right to Access list'` })
        }
        setInputErrorFlags(errors.map((error) => error.field));
    }



    return (
        <div>

            <ReactMarkdown>{formCopy.body}</ReactMarkdown>
            <form>
                {/* TODO: check error on change */}
                <p>Fields marked with a red asterisk (<span className="required">*</span>) are required to submit.</p>
                <select onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="" disabled selected>Select your State</option>
                    {formOptions &&
                        formOptions.map((option: FormattedFormOption) => {
                            return <option value={option.state}>{option.state}</option>
                        })
                    }
                </select>
                <select onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="" disabled selected>Select your City</option>
                    {
                        selectedStateData?.cities && <>{selectedStateData.cities?.map((city: FormattedCityOption) => <option value={city.city}>{city.city}</option>)} <option value={'other'}>other</option></>
                    }

                </select>
                <select onChange={(e) => setSelectedSchool(e.target.value)}>
                    <option value="" disabled selected>Select your School</option>
                    {
                        selectedCityData?.marketingNames && <>{selectedCityData.marketingNames?.map((schoolName: string) => <option value={schoolName}>{schoolName}</option>)}<option value={'other'}>other</option></>
                    }
                </select>
                <fieldset>
                    <input type="radio" name="requestFor" value="myself" checked={isRequestForSelf} onChange={(e) => setIsRequestForSelf(true)} /> Myself
                    <input type="radio" name="requestFor" value="someone else" checked={!isRequestForSelf} onChange={(e) => setIsRequestForSelf(false)} /> Someone else
                </fieldset>
                <fieldset>
                    <h1>{`Please enter ${!isRequestForSelf ? 'the' : 'your'} information ${!isRequestForSelf ? 'for whom you are requesting' : ''}.`}
                    </h1>
                    <select name="relationshipToGoddard" onChange={(e) => setSelectedRelationship(e.target.value)}>
                        <option value="" disabled selected>Select Your Relationship</option>
                        {
                            staticFormOptions.relationshipList.map((relationship: string) => (
                                <option value={relationship}>{relationship}</option>
                            ))
                        }
                    </select>

                    <input type="text" name="firstName" onChange={(e) => setRequestorInfo({ ...requestorInfo, firstName: e.target.value })} />
                    <input type="text" name="lastName" onChange={(e) => setRequestorInfo({ ...requestorInfo, lastName: e.target.value })} />
                    <input type="tel" name="phone" onChange={(e) => setRequestorInfo({ ...requestorInfo, phone: e.target.value })} />
                    <input type="email" name="email" onChange={(e) => setRequestorInfo({ ...requestorInfo, email: e.target.value })} />
                    <input type="text" name="address1" onChange={(e) => setRequestorInfo({ ...requestorInfo, addressLine1: e.target.value })} />
                    <input type="text" name="address2" onChange={(e) => setRequestorInfo({ ...requestorInfo, addressLine2: e.target.value })} />
                    <input type="text" name="city" onChange={(e) => setRequestorInfo({ ...requestorInfo, city: e.target.value })} />
                    <input type="text" name="state" onChange={(e) => setRequestorInfo({ ...requestorInfo, state: e.target.value })} />
                    <input type="text" name="zip" onChange={(e) => setRequestorInfo({ ...requestorInfo, zip: e.target.value })} />
                </fieldset>
                {!isRequestForSelf && <fieldset>
                    <h1>{`Please enter your information.`}
                    </h1>
                    <input type="text" name="firstName" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, firstName: e.target.value })} />
                    <input type="text" name="lastName" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, lastName: e.target.value })} />
                    <input type="tel" name="phone" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, phone: e.target.value })} />
                    <input type="email" name="email" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, email: e.target.value })} />
                    <input type="text" name="address1" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, addressLine1: e.target.value })} />
                    <input type="text" name="address2" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, addressLine2: e.target.value })} />
                    <input type="text" name="city" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, city: e.target.value })} />
                    <input type="text" name="state" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, state: e.target.value })} />
                    <input type="text" name="zip" onChange={(e) => setRepresenativeInfo({ ...represenativeInfo, zip: e.target.value })} />
                </fieldset>}
                {selectedSchool && <fieldset>
                    {
                        selectedState && selectedStateData.availableActions?.map((action: FormattedActionsOption) => <>
                            <label><input type="checkbox" onChange={() => setSelectedActions([...selectedActions, action.name])} value={action.name} />{action.name}</label>
                            {
                                selectedActions.includes(action.name) && action.name === 'Right to Deletion' && <fieldset> {
                                    (<><label><input checked={isPartialDeletion} onChange={() => setIsPartialDeletion(true)} type="radio" value={action.options[0]} />{action.options[0]}</label>
                                        <label><input checked={!isPartialDeletion} onChange={() => setIsPartialDeletion(false)} type="radio" value={action.options[1]} />{action.options[1]}</label>
                                    </>)
                                }</fieldset>
                            }
                            {/* TODO: if full deletion is selected, show text area */}
                            {
                                selectedActions.includes(action.name) && action.name !== 'Right to Deletion' && action.options.length >= 1 && <fieldset>{
                                    action.options.map((option: string) => (<label><input type="checkbox" value={option} />{option}</label>))
                                }</fieldset>
                            }
                        </>)
                    }
                </fieldset>
                }
                <fieldset>
                    <input type="radio" name="deliverViaEmail" value="true" checked={deliverViaEmail} onChange={(e) => setDeliverViaEmail(true)} /> Email
                    <input type="radio" name="deliverViaEmail" value="false" checked={!deliverViaEmail} onChange={(e) => setDeliverViaEmail(false)} /> Mail
                </fieldset>

                <button onClick={submitRequest} disabled={formErrors.length > 0}></button>
                <ul>
                    {/* TODO: generateErrorMessages(formErrors)*/}
                </ul>

            </form >
        </div >

    )



    async function submitRequest(body: CcpaRequestViewModel): Promise<string> {
        // format variables 
        let variables: SNowTicketVariables = {
            school_state: selectedState.state || '',
            school_city: selectedCity.city || '',
            school: selectedSchool || '',
            right_to_access: selectedActions.includes('Right to Access') ? 'true' : 'false',
            right_to_correction: selectedActions.includes('Right to Correction') ? 'true' : 'false',
            right_to_deletion: selectedActions.includes('Right to Deletion') ? 'true' : 'false',
            right_to_opt_out: selectedActions.includes("opt-out") ? "true" : "false",
            right_to_limit_use: selectedActions.includes("right to limit use") ? "true" : "false",
            right_to_data_portability: selectedActions.includes("data portability") ? "true" : "false",
            right_to_appeal: selectedActions.includes("right to appeal") ? "true" : "false",
            yourself_or_someone: isRequestForSelf ? "Myself" : "Someone Else",
            external_record: selectedRelationship,
            rf_first_name: requestorInfo.firstName,
            rf_last_name: requestorInfo.lastName,
            rf_phone: requestorInfo.phone,
            rf_email: requestorInfo.email,
            rf_address_one: requestorInfo.addressLine1,
            rf_address_two: requestorInfo.addressLine2,
            rf_city: requestorInfo.city,
            rf_state: requestorInfo.state,
            rf_zip: requestorInfo.zip,
            request_delivered: deliverViaEmail ? "Email" : "Mail",
        };

        if (!isRequestForSelf) {
            variables = {
                ...variables,
                ar_first_name: represenativeInfo.firstName,
                ar_last_name: represenativeInfo.lastName,
                ar_phone: represenativeInfo.phone,
                ar_email: represenativeInfo.email,
                ar_address_one: represenativeInfo.addressLine1,
                ar_address_two: represenativeInfo.addressLine2,
                ar_city: represenativeInfo.city,
                ar_state: represenativeInfo.state,
                ar_zip: represenativeInfo.zip
            }

        }
        if (variables.right_to_access === 'true') {
            variables = {
                ...variables,
                access_of_personal_information: selectedOptions.includes("specific pieces of personal information") ? "true" : "false",
                access_of_categories_collected: selectedOptions.includes("categories of personal information") ? "true" : "false",
                access_of_sources_collected: selectedOptions.includes("categories of sources") ? "true" : "false",
                access_of_categories_disclosed: selectedOptions.includes("sold or disclosed") ? "true" : "false",
                access_of_categories_third_parties: selectedOptions.includes("categories of third parties") ? "true" : "false",
            }
        }


        if (variables.right_to_deletion === 'true') {
            //Next line either "FULL DELETION REQUEST" or "Partial Deletion Request"
            variables = {
                ...variables,
                request_type: isPartialDeletion ? "Partial Deletion Request" : "FULL DELETION REQUEST",
            }

            if (variables.request_type === "Partial Deletion Request") {
                variables = {
                    ...variables,
                    information_to_be_deleted: partialDeletionDetails,
                    information_deleted: partialDeletionDetails,
                }
            }
        }

        const req: SNowTicketRequest = {
            sysparm_quantity: "1",
            variables: variables
        };

        // API call to ServiceNow (SNow)
        try {
            const response = await axios.post<SNowTicketResponse>('/api/CreateSNowTicketRoute', req);

            return response.data.Result.request_number || '-1'
        } catch (error) {
            console.error(error);
            return '-1';
        }
    }
}




/*
// Add these state variables at the beginning of your component
const [requestFor, setRequestFor] = useState<'myself' | 'someone else'>('myself');
const [relationshipToGoddard, setRelationshipToGoddard] = useState<string>('');
const [firstName, setFirstName] = useState<string>('');
const [lastName, setLastName] = useState<string>('');
const [phone, setPhone] = useState<string>('');
const [email, setEmail] = useState<string>('');
const [address1, setAddress1] = useState<string>('');
const [address2, setAddress2] = useState<string>('');
const [city, setCity] = useState<string>('');
const [state, setState] = useState<string>('');
const [zip, setZip] = useState<string>('');
const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'mail'>('email');

// Add these form elements inside your form
<input type="radio" name="requestFor" value="myself" checked={requestFor === 'myself'} onChange={(e) => setRequestFor(e.target.value)} /> Myself
<input type="radio" name="requestFor" value="someone else" checked={requestFor === 'someone else'} onChange={(e) => setRequestFor(e.target.value)} /> Someone else

<input type="text" name="relationshipToGoddard" value={relationshipToGoddard} onChange={(e) => setRelationshipToGoddard(e.target.value)} />


// Modify your submitRequest function to use the state variables
async function submitRequest(body: CcpaRequestViewModel): Promise<string> {
    const req: SNowTicketRequest = {
        sysparm_quantity: "1",
        variables: {
            school_state: body.RequestingState || '',
            school_city: body.RequestingCity || '',
            school: body.RequestingSchool || '',
            // ...
            yourself_or_someone: requestFor,
            external_record: requestFor === 'myself' ? 'false' : 'true',
            rf_first_name: firstName,
            rf_last_name: lastName,
            rf_phone: phone,
            rf_email: email,
            rf_address_one: address1,
            rf_address_two: address2,
            rf_city: city,
            rf_state: state,
            rf_zip: zip,
            // ...
            request_delivered: deliveryMethod,
        },
    };

    // ...
}
*/