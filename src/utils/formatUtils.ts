import { AccordionProps } from '@/components/Accordion/Accordion';
import { AccordionSectionProps } from '@/components/Accordion/AccordionSection';
import { HeaderItem, HeaderProps } from '@/types/layoutTypes';
import { v4 as uuidv4 } from 'uuid';

export function generatUuid() {
    return uuidv4()
}

export function addSectionsToHeader(headerContent: HeaderProps, sections: {
    heading: string;
    children: string;
    sectionId?: string;
}[]) {
    const formatted = { ...headerContent }
    const formattedSections: HeaderItem[] = [];
    const sectionToMap = [...sections];
    sectionToMap.map((section: AccordionSectionProps) => {
        const formattedId = formatSectionId(section)
        formattedSections.push({
            title: section.heading,
            isActive: false,
            link: `/#${formattedId}`,
            target: '_self',
            refId: formattedId,
        })

    })
    formatted.inputHeaderItems[0].children = formattedSections;
    return formatted
}


export function formatSectionId(section: AccordionSectionProps) {
    const targetId = section.sectionId ? section.sectionId : section.heading
    return encodeURIComponent(targetId.toLowerCase().replace(/[^a-z0-9]/g, '-'))
}

