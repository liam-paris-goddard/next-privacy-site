import matter from "gray-matter";
import fs from 'fs'
import { School } from "./D365";
import { FormattedActionsOption, FormattedFormOption } from "@/components/RightsRequestForm/RightsRequestFormTypes";
import rrfOptions from '../../public/rrfOptions.json'

export function formatSchoolList(schoolList: School[]): FormattedFormOption[] {
    return schoolList.reduce((acc: FormattedFormOption[], school) => {
        let stateObj = {} as FormattedFormOption;
        let foundObj = acc.find((s: FormattedFormOption) => s.state === school.State);
        if (!foundObj) {
            const availActions = Object.entries(rrfOptions.StateActions)
                .filter(([action, states]) => states.includes(school.State))
                .map(([action, states]) => {
                    const actionsWithOptions = rrfOptions.ActionOptions as { [key: string]: string[] }
                    const actionIncludesOptions = Object.keys(actionsWithOptions).includes(action);
                    let actionObj = { name: action, options: [] } as FormattedActionsOption;
                    if (actionIncludesOptions) {
                        actionObj.options = actionsWithOptions[action];
                    }
                    return actionObj;
                });

            stateObj = { state: school.State, cities: [], availableActions: availActions };
            acc.push(stateObj);
        }

        let cityObj = stateObj?.cities?.find((c: {
            city: string;
            marketingNames: string[];
        }) => c.city === school.City);
        if (!cityObj) {
            cityObj = { city: school.City, marketingNames: [] };
            stateObj?.cities?.push(cityObj);
        }

        if (!cityObj?.marketingNames.includes(school.MarketingName)) {
            cityObj?.marketingNames.push(school.MarketingName);
        }
        return acc;
    }, [])
}


