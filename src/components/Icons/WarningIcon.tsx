


import { colorTokens } from '../../styles/tokens/variables'

export const WarningIcon: React.FC<{ className?: string }> = ({ className }) => {
    return (<svg className={className} width="28" height="24" viewBox="0 0 28 24" >
        <path fill={colorTokens.alert} d="M16.281,3.219l-.893,1.514L3.142,25.7l-.861,1.514h28L29.42,25.7,17.174,4.733Zm0,4.037L26.741,25.2H5.821ZM15.261,14.1v6.055H17.3V14.1Zm0,7.064v2.018H17.3V21.164Z" transform="translate(-2.281 -3.219)" />
    </svg >)
}
