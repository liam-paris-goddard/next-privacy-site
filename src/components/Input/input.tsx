import { generatUuid } from "@/utils/formatUtils";
import { use, useEffect, useState } from "react";
import { HidePasswordIcon } from "../Icons/HidePasswordIcon";
import { ShowPasswordIcon } from "../Icons/ShowPasswordIcon";
import './input.scss';
import { WarningIcon } from "../Icons/WarningIcon";
import { InfoIcon } from "../Icons/InfoIcon";
export interface InputProps {
    type: 'text' | 'password' | 'email' | 'file' | 'hidden' | 'number' | 'tel' | 'url';
    invalid?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    name: string;
    autoComplete?: string;
    inputId?: string;
    pattern?: string;
    placeholder?: string;
    value?: string | number;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    label: string;
    helperText?: string;
    onKeyDownFunction?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocusFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlurFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;

}

export const Input: React.FC<InputProps> = ({
    type = 'text',
    invalid,
    readOnly,
    disabled,
    required,
    name,
    autoComplete,
    inputId = generatUuid(),
    pattern,
    placeholder,
    value = '',
    minLength,
    maxLength,
    min,
    max,
    step,
    label = '',
    helperText,
    onKeyDownFunction,
    onChangeFunction,
    onFocusFunction,
    onBlurFunction,
}) => {

    const [storedType, setStoredType] = useState(type);
    const [hidePassword, setHidePassword] = useState(true);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // implemnent event emitters
        return onKeyDownFunction ? onKeyDownFunction(event) : null

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event?.target?.value);
        // implment event emitters
        return onChangeFunction ? onChangeFunction(event) : null
    }

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        // implment event emitters
        return onFocusFunction ? onFocusFunction(event) : null

    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // implment event emitters
        return onBlurFunction ? onBlurFunction(event) : null

    };

    const togglePasswordVisibility = () => {
        if (storedType === 'password' && hidePassword) {
            setStoredType('text');
            setHidePassword(false)
        } else {
            setStoredType('password');
            setHidePassword(true)
        }
    }

    return (
        <div className={`gsl-input ${invalid ? 'gsl-input-error' : ''}`}>
            <label className='gsl-input-label' htmlFor={inputId}> {label}
                {required ? <span className="gsl-input--required">*</span> : null}
            </label>
            <div className='gsl-input-field-container'>
                <input
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className='gsl-input-field'
                    type={storedType}
                    name={name}
                    aria-invalid={invalid}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    minLength={minLength}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    min={min}
                    max={max}
                    readOnly={readOnly}
                    pattern={pattern}
                    step={step}
                    value={value}
                />
                {type === 'password' && <button className={`gsl-input-password-toggle`} onClick={() => togglePasswordVisibility()}>{hidePassword ? <HidePasswordIcon></HidePasswordIcon> : <ShowPasswordIcon></ShowPasswordIcon>}</button>}
                <div className='gsl-input-button-container'>
                    <slot></slot>
                </div>
            </div>
            {helperText && <div className='gsl-input-help-text-container'>
                {invalid ? <WarningIcon /> : <InfoIcon />}{helperText}
            </div>}
        </div>
    );
}
