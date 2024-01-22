import React, { useState, useEffect, useRef } from 'react';
import Checkbox, { renderHelperIcon } from './Checkbox'; // Assuming Checkbox component is in the same directory
import './CheckboxGroup.scss';
interface CheckboxGroupProps {
    name?: string;
    label?: string;
    ariaLabelCheckboxGroup?: string;
    helperText?: string;
    status?: string;
    invalid?: boolean;
    value?: string;
    inputId?: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    selectText?: string;
    unselectText?: string;
    onChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlurFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
    parentControl?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    name = '',
    label = '',
    ariaLabelCheckboxGroup = '',
    helperText = '',
    status = '',
    invalid = false,
    value = '',
    inputId = '',
    checked = false,
    indeterminate = false,
    disabled = false,
    selectText = '',
    unselectText = '',
    onChangeFunction,
    onBlurFunction,
    children,
    parentControl = false
}) => {
    const [actionText, setActionText] = useState('');
    const groupNode = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const allChecked = checked;
        const someChecked = checked && !allChecked;
        const allDisabled = disabled;

        setActionText(allChecked ? unselectText : selectText);
    }, [checked, disabled, selectText, unselectText]);

    return (
        <div className={`checkbox-group ${invalid ? 'gsl-checkbox-group-parent-checkbox-invalid' : ''}`}>
            {/*  ref={groupNode} todo */}
            {parentControl && <Checkbox
                name={name}
                label={label}
                ariaLabelCheckbox={`${ariaLabelCheckboxGroup || label} - ${actionText}`}
                helperText={helperText}
                status={status}
                invalid={invalid}
                value={value}
                checked={checked}
                indeterminate={indeterminate}
                disabled={disabled}
                className={`gsl-checkbox-group-parent-checkbox ${invalid ? 'gsl-checkbox-group-parent-checkbox-invalid' : ''}`}
                onChangeFunction={onChangeFunction}
                onBlurFunction={onBlurFunction}
            />}
            {!parentControl && label && <label className='gsl-checkbox-group-label'>{label}</label>}
            {helperText && <div className="gsl-checkbox-group-helper-text">
                {renderHelperIcon(helperText, invalid)} {helperText}
            </div>}
            <fieldset className="gsl-checkbox-group-fieldset">
                <legend>{ariaLabelCheckboxGroup || label}</legend>
                {children}
            </fieldset>
        </div>
    );
}

export default CheckboxGroup;