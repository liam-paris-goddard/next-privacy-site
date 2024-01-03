import matter from "gray-matter";
import fs from 'fs'
import { School } from "./D365";
import { FormattedFormOption } from "@/components/RightsRequestForm/RightsRequestFormTypes";
import rrfOptions from '../../public/rrfOptions.json'

export function formatSchoolList(schoolList: School[]): FormattedFormOption[] {
    return schoolList.reduce((acc: FormattedFormOption[], school) => {
        let stateObj = acc.find((s: FormattedFormOption) => s.state === school.State);
        if (!stateObj) {
            const availActions = Object.entries(rrfOptions.StateActions)
                .filter(([action, states]) => states.includes(school.State))
                .map(([action, states]) => action);
            stateObj = { state: school.State, cities: [], availableActions: availActions };
            acc.push(stateObj);
        }

        let cityObj = stateObj.cities.find((c: {
            city: string;
            marketingNames: string[];
        }) => c.city === school.City);
        if (!cityObj) {
            cityObj = { city: school.City, marketingNames: [] };
            stateObj.cities.push(cityObj);
        }

        if (!cityObj.marketingNames.includes(school.MarketingName)) {
            cityObj.marketingNames.push(school.MarketingName);
        }
        return acc;
    }, [])
}


