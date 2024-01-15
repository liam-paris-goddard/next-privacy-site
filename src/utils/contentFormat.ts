import matter from "gray-matter"

export function formatRRFData(formCopyData: string, rrfStaticOptions: any) {

    const formCopyMatterData = matter(formCopyData)
    const staticFormOptions = {
        relationshipList: rrfStaticOptions.Relationships,
        stateList: rrfStaticOptions.StatesAndTerritories,
    }


    const formCopy = { heading: formCopyMatterData.data.heading, body: formCopyMatterData.content }
    return {
        staticFormOptions,
        formCopy
    }
}

export const formatHomePageData = (landingPageArr: string[]) => {
    return landingPageArr.map(file => {
        const matterData = matter(file)
        return {
            heading: matterData.data?.heading || '',
            order: matterData.data?.order,
            children: matterData?.content || '',
            headingLevel: null
        }
    }).sort((a, b) => a.order - b.order).map(({ heading, children, order }) => ({ heading, children }))

}