export interface FormattedFormOption {
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
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
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