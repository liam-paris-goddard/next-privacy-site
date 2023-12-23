import React from 'react';
import './Accordion.scss'
import { DownArrowIcon } from '../Icons/DownArrowIcon';
import ReactMarkdown from 'react-markdown'

export interface AccordionSectionProps {
    heading: string;
    children: string;
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    defaultOpen?: boolean;
    sectionId?: string;
    expanded?: boolean;
    iconPosition?: 'left' | 'right';
    onToggle?: (id: string) => void;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
    heading,
    children,
    headingLevel = 3,
    defaultOpen = false,
    sectionId = '',
    expanded = false,
    iconPosition = 'right',
    onToggle = () => { },
}) => {

    const handleClick = () => {
        onToggle(sectionId);
    };

    const headingMap = {
        1: 'heading-1',
        2: 'heading-2',
        3: 'heading-3',
        4: 'heading-4',
        5: 'heading-5',
        6: 'heading-6'
    }


    return (
        <div id={sectionId} className='gsl-accordion-section'>
            <h2 aria-level={headingLevel}>
                <button aria-expanded={expanded} className={`${headingLevel ? headingMap[headingLevel] : ''} gsl-accordion-section-heading-button icon-${iconPosition} ${expanded ? 'expanded' : ''}`} onClick={handleClick}>
                    <DownArrowIcon className={`${headingLevel ? headingMap[headingLevel] : ''} gsl-accordion-section-heading-icon`} />
                    {heading}
                </button>
            </h2>
            <div role="region" aria-labelledby={sectionId}
                hidden={!expanded} className={`gsl-accordion-section-body-container`}>
                <ReactMarkdown>{children}</ReactMarkdown>
            </div>
        </div>
    );
};