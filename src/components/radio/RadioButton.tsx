import React, { useEffect, useState } from 'react';
import './RadioButton.scss';
import { generatUuid } from '@/utils/formatUtils';

export interface RadioButtonProps {
    name?: string;
    label?: string;
    disabled?: boolean;
    checked?: boolean;
    value?: string;
    inputId?: string;
    styles?: any;
    required?: boolean;
    onChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlurFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;

}

const RadioButton = ({
    name = '',
    label = '',
    disabled = false,
    checked = false,
    value = '',
    inputId,
    styles,
    required = false,
    onChangeFunction,
    onBlurFunction,
}: RadioButtonProps) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [internalId] = useState(generatUuid());

    useEffect(() => {
        if (!inputId) {
            inputId = 'input-' + internalId;
        }
    }, [inputId, internalId]);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const getCssClassMap = () => {
        return (
            `radio-button
            ${isChecked ? `radio-button-checked` : ''},
            ${disabled ? `radio-button-disabled` : ''},`
        );
    };

    return (
        <div className={getCssClassMap()} style={styles}>
            <input
                type="radio"
                name={name}
                id={inputId}
                onChange={onChangeFunction}
                onBlur={onBlurFunction}
                value={value}
                checked={checked}
                disabled={disabled}
                required={required}
            />
            <label htmlFor={inputId}>{label}</label>
        </div>
    );
};

export default RadioButton;