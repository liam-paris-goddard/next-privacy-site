import { FormattedActionsOption, FormattedSchoolListOption } from "@/components/RightsRequestForm/RightsRequestFormUtils";
import { D365, School } from "./D365";
import matter from "gray-matter";
import rrfOptions from './rrfOptions';

export async function generateSchoolList(stateListData: string[]) {
    const stateListFrontMatter = stateListData.map(state => matter(state));
    const statesToFetch = stateListFrontMatter.map(state => state.data.state);
    const fetchedSchoolListData = await fetchSchoolList(statesToFetch);
    return fetchedSchoolListData ? formatSchoolList(fetchedSchoolListData, stateListFrontMatter) : [] as FormattedSchoolListOption[];
}

export const actionTitleList: { [key: string]: string } = {
    right_to_access: "Right To Access",
    right_to_correction: "Right To Correction",
    right_to_deletion: "Right To Deletion",
    right_to_opt: "Right to opt-out (sale, share, targeted ads, profiling)",
    right_to_limit: "Right To Limit Use",
    right_to_portability: "Right To Data Portability",
    right_to_appeal: "Right To Appeal"
}

export async function fetchSchoolList(stateListData: string[]) {

    const d365 = new D365(
        process.env.D365_AUTH_URL,
        process.env.D365_CLIENT_ID,
        process.env.D365_CLIENT_SECRET,
        process.env.D365_BASE_URL
    );

    await d365.init();

    // Call the getSchools method
    return await d365.getSchools(stateListData)
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

export function formatSchoolList(schoolList: School[], stateFrontmatterData: { [key: string]: any }): FormattedSchoolListOption[] {
    return schoolList.reduce((acc: FormattedSchoolListOption[], school) => {
        let stateObj = {} as FormattedSchoolListOption;
        let foundObj = acc.find((s: FormattedSchoolListOption) => s.state === school.State);
        if (!foundObj) {

            const stateActionData = stateFrontmatterData.find((state: { [key: string]: any }) => state.data.state === school.State);
            const availActions: FormattedActionsOption[] = [];
            for (const [key, value] of Object.entries(stateActionData.data)) {
                if (key !== 'state' && value === true) {
                    availActions.push({ key: key, name: actionTitleList[key], options: [] });
                }
            }
            for (const action of availActions) {
                if (rrfOptions.ActionOptions.hasOwnProperty(action.key)) {
                    action.options = rrfOptions.ActionOptions[action.key];
                }
            }


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