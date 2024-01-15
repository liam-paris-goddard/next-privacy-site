import axios from "axios";
import * as Yup from 'yup';

export interface FormattedSchoolListOption {
    state: string;
    cities: FormattedCityOption[]
    availableActions: FormattedActionsOption[]
};

export interface FormattedActionsOption {
    name: string,
    options: string[]
}

export interface FormattedCityOption {
    city: string;
    marketingNames: string[];
};

export interface RRFormError {
    field: string;
    error: string;
}[]

export const phoneRegex = /\+?(\d{1,4}?)?[-. (]*(\d{1,3})[-. )]*(\d{1,3})[-. ]*(\d{1,9})/g;
export const requestorInfoSchema = Yup.object({
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    phone: Yup.string().required('This field is required').matches(phoneRegex, 'Please enter a valid phone number'),
    email: Yup.string().required('This field is required').email('Please enter a valid email address'),
    addressLine1: Yup.string().required('This field is required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('This field is required'),
    state: Yup.string().required('This field is required'),
    zip: Yup.string().required('This field is required'),
});

export const represenativeInfoSchema = Yup.object({
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    phone: Yup.string().required('This field is requiredd').matches(phoneRegex, 'Please enter a valid phone number'),
    email: Yup.string().required('This field is required').email('Please enter a valid email address'),
    addressLine1: Yup.string().required('This field is required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('This field is required'),
    state: Yup.string().required('This field is required'),
    zip: Yup.string().required('This field is required'),
});

export const rightsRequestFormValidationSchema = Yup.object({
    schoolState: Yup.string().required('Please select an option'),
    schoolCity: Yup.string().required('Please select an option'),
    schoolMarketingName: Yup.string().required('Please select an option'),
    selectedActions: Yup.array().of(Yup.string()).min(1, 'At least one action is required'),
    selectedOptions: Yup.array().of(Yup.string()).when('selectedActions', (selectedActions, schema) => {
        const flattenedSelectedActions = [].concat(...selectedActions) as string[];
        return flattenedSelectedActions.includes('Right to Access') ? schema.min(1, 'At least one option is required for right to access') : schema;
    }),
    deletionOption: Yup.string().oneOf(['full', 'partial']).when('selectedActions', (selectedActions, schema) => (selectedActions.includes('Right to Deletion') ? schema.required('an option is required for right to deletion') : schema)),
    partialDeletionDetails: Yup.string(),
    isRequestFor: Yup.string().oneOf(['self', 'other']).required('Please select an option'),
    selectedRelationship: Yup.string().required('Please select an option'),
    requestorInfo: requestorInfoSchema.required('Please fill out requestor information'),
    deliveryType: Yup.string().oneOf(['email', 'mail']).required('Please select an option'),
});

export interface FormValues {
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



export interface RRFormInput {
    RequestingState?: string;
    RequestingCity?: string;
    RequestingSchool?: string;
    SelectedActions?: string;
    SelectedOptions?: string;
    Actions?: string[];
    Options?: string[];
    PartialDeletionDetails?: string;
    IsRequestForSelf?: boolean;
    Requestor?: SNowTicketPerson;
    Representative?: SNowTicketPerson;
    Relationship?: string;
    DeliverViaEmail?: boolean;
    CcpaRequestionOptions?: string;
    CcpaRequestionOptionsArray?: string[];
    Attachment?: File;
    DeleteAllInfo?: boolean;
    DeleteInstructionText?: string;
}

export interface SNowTicketPerson {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}

export interface SNowTicketRequest {
    sysparm_id?: string;
    sysparm_quantity?: string;
    variables: SNowTicketVariables;
}

export interface SNowTicketVariables {
    school_state?: string;
    school_city?: string;
    school?: string;
    right_to_access?: string;
    access_of_personal_information?: string;
    access_of_categories_collected?: string;
    access_of_sources_collected?: string;
    access_of_categories_disclosed?: string;
    access_of_categories_third_parties?: string;
    right_to_correction?: string;
    right_to_deletion?: string;
    request_type?: string;
    information_to_be_deleted?: string;
    information_deleted?: string;  //Maybe not needed?
    right_to_opt_out?: string;
    right_to_limit_use?: string;
    right_to_data_portability?: string;
    right_to_appeal?: string;
    yourself_or_someone?: string;
    external_record?: string;
    rf_first_name?: string;
    rf_last_name?: string;
    rf_phone?: string;
    rf_email?: string;
    rf_address_one?: string;
    rf_address_two?: string;
    rf_city?: string;
    rf_state?: string;
    rf_zip?: string;
    ar_first_name?: string;
    ar_last_name?: string;
    ar_phone?: string;
    ar_email?: string;
    ar_address_one?: string;
    ar_address_two?: string;
    ar_city?: string;
    ar_state?: string;
    ar_zip?: string;
    request_delivered?: string;
}
export interface SNowTicketResponse {
    Error: Error;
    Status?: string;
    Result: SNowTicketResult;
}

export interface SNowTicketError {
    Message?: string;
    Detail?: string;
}

export interface SNowTicketResult {
    errMsg?: string;
    rf_state?: string;
    sys_id?: string;
    number?: string;
    request_number?: string;
    request_id?: string;
    table?: string;
}

export async function testSubmit() {
    const testReq = { "sysparm_quantity": "1", "variables": { "school_state": "California", "school_city": "Carlsbad", "school": "Carlsbad", "right_to_access": "false", "access_of_personal_information": "false", "access_of_categories_collected": "false", "access_of_sources_collected": "false", "access_of_categories_disclosed": "false", "access_of_categories_third_parties": "false", "right_to_correction": "false", "right_to_deletion": "false", "request_type": "Access", "information_to_be_deleted": "test", "information_deleted": "", "right_to_opt_out": "false", "right_to_limit_use": "false", "right_to_data_portability": "false", "right_to_appeal": "false", "yourself_or_someone": "Yourself", "external_record": "false", "rf_first_name": "test", "rf_last_name": "test", "rf_phone": "test", "rf_email": "test@test.com", "rf_address_one": "test", "rf_address_two": "test", "rf_city": "test", "rf_state": "test", "rf_zip": "test", "ar_first_name": "test", "ar_last_name": "test", "ar_phone": "test", "ar_email": "test@test.com", "ar_address_one": "test", "ar_address_two": "test", "ar_city": "test", "ar_state": "NJ", "ar_zip": "test", "request_delivered": "Email" } }
    try {
        const response = await axios.post<SNowTicketResponse>('/api/CreateSNowTicketRoute', testReq);

        return response.data.Result.request_number || '-1'
    } catch (error) {
        console.error(error);
        return '-1';
    }
}
export async function submitRequest(formValues: FormValues): Promise<string> {
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