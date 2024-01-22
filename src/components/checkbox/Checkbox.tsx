import { generatUuid } from '@/utils/formatUtils';
import React, { useState, useEffect } from 'react';
import './Checkbox.scss';
import { InfoIcon } from '../Icons/InfoIcon';
import { WarningIcon } from '../Icons/WarningIcon';
import { CheckboxIcon } from '../Icons/CheckboxIcon';
interface CheckboxProps {
    className?: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    status?: string;
    invalid?: boolean;
    hideLabel?: boolean;
    name?: string;
    value?: string;
    ariaLabelCheckbox?: string;
    required?: boolean;
    helperText?: string;
    label?: string;
    onChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlurFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/* Accessibility: rendering the icon *only* when checked, otherwise is always visible in HCM */
export const renderIcon = (indeterminate: boolean, checked: boolean) => {
    if (indeterminate) {
        return (
            <span>-</span> //TODO: replace
        );
    }

    if (checked) {
        return (
            <CheckboxIcon className='gsl-checkbox-icon' />
        );
    }
}

export const renderHelperIcon = (helperText: string, invalid: boolean) => {
    if (helperText && !invalid) {
        return (
            <InfoIcon className={'gsl-checkbox-icon'} />
        );
    }
    if (invalid) {
        return <WarningIcon className='gsl-checkbox-icon' />
    }
}

const Checkbox: React.FC<CheckboxProps> = ({
    className = '',
    checked = false,
    indeterminate = false,
    disabled = false,
    status = '',
    invalid = false,
    hideLabel = false,
    name = '',
    value = '',
    ariaLabelCheckbox = '',
    required = false,
    helperText = '',
    label = '',
    onChangeFunction,
    onBlurFunction,
}) => {
    const [internalId] = useState(generatUuid)
    const inputId = `checkbox-${internalId}`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChangeFunction) {
            onChangeFunction(event);
        }
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (onBlurFunction) {
            onBlurFunction(event);
        }
    }

    const helperTextId = helperText ? `helper-message-${internalId}` : null;

    return (

        <div
            className={`${className ? className : ''} gsl-checkbox 
                ${checked ? 'checked ' : ''}
                ${indeterminate ? 'indeterminate ' : ''}
                ${disabled ? 'disabled ' : ''}
                ${invalid ? 'error ' : ''}
             ${hideLabel ? 'hideLabel ' : ''}`
            }>
            <input
                type="checkbox"
                className='gsl-checkbox-input'
                name={name}
                id={inputId}
                value={value}
                checked={checked}
                aria-label={ariaLabelCheckbox}
                aria-checked={indeterminate ? 'mixed' : false}
                aria-invalid={status === 'error' || invalid}
                aria-describedby={helperTextId || undefined}
                disabled={disabled}
                required={required}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <label className='gsl-checkbox-container' htmlFor={inputId}>
                <div className='gsl-checkbox-checkbox'>{renderIcon(indeterminate, checked)}</div>
                <div className='gsl-checkbox-label'>{label}</div>
            </label>
            <div className='gsl-component-help-text-container'>{renderHelperIcon(helperText, invalid)} {helperText && <span id={helperTextId ? helperTextId : ''}>{helperText}</span>}</div>
        </div >
    );
}

export default Checkbox;