import React, { useEffect, useRef, useState } from 'react';
import { InfoIcon } from '../Icons/InfoIcon';
import './RadioGroup.scss';
import { WarningIcon } from '../Icons/WarningIcon';
import RadioButton, { RadioButtonProps } from './RadioButton';
import { generatUuid } from '@/utils/formatUtils';


export interface RadioGroupProps {
    name?: string;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    inline?: boolean;
    disabled?: boolean;
    required?: boolean;
    buttons: RadioButtonProps[];
    onChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlurFunction?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
const RadioGroup = ({
    name = '',
    label = '',
    helperText = '',
    invalid = false,
    inline = false,
    disabled = false,
    required = false,
    buttons = [],
    onChangeFunction,
    onBlurFunction,
}: RadioGroupProps) => {
    const internalId = generatUuid();
    const [formattedButtons, setFormattedButtons] = useState<RadioButtonProps[]>([]);
    useEffect(() => {
        setFormattedButtons(applyAttributesToButtons(buttons));
    }, [buttons]);

    const applyAttributesToButtons = (buttonArr: RadioButtonProps[]) => {
        return buttonArr.map((button) => {
            button.name = name
            if (required) {
                button.required = true;
            }
            button.onChangeFunction = onChangeFunction;
            button.onBlurFunction = onBlurFunction;
            return button;
        })
    }

    const renderAdditionalInfo = () => {
        if (helperText) {
            return (
                <div
                    role="text"
                    id={`gsl-radio-group-helper-text-${internalId}`}
                    className={`gsl-component-help-text-container ${invalid ? 'gsl-component-help-text-container-error' : ''}`}
                    aria-label={helperText}
                >
                    {invalid ? (<WarningIcon />) : (<InfoIcon />)}
                    <span>{helperText}</span>
                </div>
            )
        }
    }

    return (
        <fieldset className="gsl-radio-group" disabled={disabled}>
            <legend className="gsl-radio-group-title">
                <label className={`gsl-radio-group-title-label ${!label ? 'hide-label' : ''} `} aria-label={label ? label : name}>
                    {!helperText && invalid && <InfoIcon />}{label && label}
                    {required ? <span className="gsl-radio-group--required">*</span> : null}
                </label>
                {renderAdditionalInfo()}
            </legend>
            <div className={`gsl-radio-group-container ${inline ? 'inline-position' : ''} `}>
                {formattedButtons && formattedButtons.map((button) => {
                    return <RadioButton key={button.label} {...button}></RadioButton>
                })}
            </div>
        </fieldset>
    );
}

export default RadioGroup;