import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import './select.scss';
import { WarningIcon } from '../Icons/WarningIcon';
import { InfoIcon } from '../Icons/InfoIcon';
export interface OptionProps {
    value: string;
    label?: string;
    disabled?: boolean;
    selected?: boolean;
    type: string;
}

export interface OptionGroupProps {
    label: string,
    disabled?: boolean,
    type: 'optionGroup';
    options: OptionProps[]
}

export interface SelectProps {
    helperText?: string
    label: string
    hideLabel?: boolean
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    selectId?: string
    name: string
    placeholder?: string;
    value?: string;
    optionList: (OptionProps | OptionGroupProps)[]
    onBlurFunction: (e: React.FocusEvent<HTMLSelectElement>) => void;
    onChangeFunction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    classes?: string;
}


const Select: React.FC<SelectProps> = ({ selectId = uuidv4(), invalid, disabled, hideLabel, label, required, helperText, placeholder, name, optionList = [], classes, onChangeFunction, onBlurFunction, value }) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const [formattedOptionList, setFormattedOptionList] = useState<(OptionProps | OptionGroupProps)[]>(optionList);
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeFunction(e);
        setSelectedValue(e.target.value);
    };

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return (
        <div className={`gsl-select ${classes} ${invalid ? 'gsl-select--invalid' : ''} ${disabled ? 'gsl-select--disabled' : ''}`}>
            <label htmlFor={selectId} className={`gsl-select--label ${hideLabel ? 'gsl-select--label-hide' : ''}`} >
                {invalid && !helperText && <WarningIcon></WarningIcon>} {label} {required ? <span className="gsl-select--required">*</span> : null}
            </label>
            <select className='gsl-select--input'
                onChange={handleChange}
                aria-invalid={invalid}
                id={selectId}
                value={selectedValue}
                name={name}
                disabled={disabled}
                required={required}
                onBlur={onBlurFunction}>
                {optionList.length && optionList.map((item: OptionProps | OptionGroupProps) => {
                    if (item.type === "option") {
                        return (
                            <option
                                key={item.label}
                                disabled={item.disabled}
                                label={item.label}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        );
                    }
                })}
            </select>
            {helperText && <div className='gsl-component-help-text-container'>
                {invalid ? <WarningIcon></WarningIcon> : <InfoIcon></InfoIcon>}
                <span>{helperText}</span>
            </div>}
        </div>
    );
};

export default Select;