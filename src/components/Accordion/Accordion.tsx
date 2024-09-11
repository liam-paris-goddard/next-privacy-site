import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AccordionSection, AccordionSectionProps } from './AccordionSection'
import './Accordion.scss'
import { v4 as uuidv4 } from 'uuid';
import { formatSectionId } from '@/utils/formatUtils';

export interface AccordionProps {
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    toggle?: boolean;
    iconPosition?: 'left' | 'right';
    sectionList: AccordionSectionProps[];
    defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ headingLevel = 3, toggle = false, iconPosition = 'right', sectionList, defaultOpen }) => {
    const [formattedSectionList, setFormattedSectionList] = useState<AccordionSectionProps[]>([]);
    const sectionRefs = useRef((new Array(sectionList.length)).fill(React.createRef<HTMLDivElement>()));

    const accordionSectionToggledHandler = (id: string) => {
        setFormattedSectionList(prevFormattedSectionList => {
            const selectedSection = prevFormattedSectionList.find(section => section.sectionId === id);
            if (selectedSection) {
                if (toggle && !selectedSection.expanded) {
                    return prevFormattedSectionList.map(section => {
                        if (section.sectionId === id) {

                            return { ...section, expanded: !section.expanded };
                        }
                        else {
                            return { ...section, expanded: false };
                        }
                    });
                } else {
                    return prevFormattedSectionList.map(section => {
                        if (section.sectionId === id) {
                            return { ...section, expanded: !section.expanded };
                        } else {
                            return section;
                        }
                    });
                }
            } else {
                return prevFormattedSectionList;
            }
        });
    };

    useEffect(() => {
        if (sectionList.length > 0) {
            const x = formatAccordionSections(sectionList);
            setFormattedSectionList(x);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') { // Check if window is defined (i.e., if we're on the client side)
            formattedSectionList.forEach((section, index) => {
                if (toggle && section.expanded && sectionRefs.current[index]) {
                    sectionRefs.current[index].current?.scrollTo({ block: 'start' })
                }
            });
        }
    }, [formattedSectionList]);


    const formatAccordionSections = (sections: AccordionSectionProps[]) => sections.map((section: AccordionSectionProps) => {
        const childHeadingLevel = section.headingLevel || headingLevel;
        const childSectionId = formatSectionId(section);
        const childExpanded = section.defaultOpen || defaultOpen || false
        return {
            ...section,
            headingLevel: childHeadingLevel,
            iconPosition,
            onToggle: accordionSectionToggledHandler,
            sectionId: childSectionId,
            expanded: childExpanded
        }
    })

    return (
        <div className='gsl-accordion' >
            {formattedSectionList.map((section, index) => <div ref={sectionRefs.current[index]} key={section.sectionId} id={section.sectionId}><AccordionSection key={section.sectionId} {...section}>{section.children}</AccordionSection></div>)}
        </div>
    );
};