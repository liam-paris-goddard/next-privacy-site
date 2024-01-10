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
    value?: string | number | boolean;
    optionList: (OptionProps | OptionGroupProps)[]
    onBlurFunction: (e: React.FocusEvent<HTMLSelectElement>) => void;
    onChangeFunction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}


const Select: React.FC<SelectProps> = ({ selectId = uuidv4(), invalid, disabled, hideLabel, label, required, helperText, placeholder, name, optionList = [], onChangeFunction, onBlurFunction, value }) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const [formattedOptionList, setFormattedOptionList] = useState<(OptionProps | OptionGroupProps)[]>(optionList);
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeFunction(e);
        if (e?.target?.value !== selectedValue) {
            setSelectedValue(e.target.value);
        }
    };

    return (
        <div className={`gsl-select ${invalid ? 'gsl-select--invalid' : ''} ${disabled ? 'gsl-select--disabled' : ''}`}>
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
                {placeholder && <option value="" disabled selected>{placeholder}</option>}
                {optionList.length && optionList.map((item: OptionProps | OptionGroupProps) => {
                    if (item.type === "option") {
                        return (
                            <option
                                disabled={item.disabled}
                                label={item.label}
                                value={item.value}
                                selected={item.selected}
                            >
                                {item.label}
                            </option>
                        );
                    } else if (item.type === "optionGroup") {
                        return (
                            <optgroup
                                label={item.label}
                            >
                                {item.options.map((option: OptionProps) =>
                                (
                                    <option
                                        disabled={option.disabled}
                                        label={option.label}
                                        value={option.value}
                                        selected={option.selected}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                })}
            </select>
            {invalid && helperText && <p className="gsl-select--helper-text gsl-select--invalid-text"> <WarningIcon></WarningIcon>{helperText}</p>}
            {!invalid && helperText && <p className="gsl-select--helper-text"><InfoIcon></InfoIcon>{helperText}</p>}
        </div>
    );
};

export default Select;