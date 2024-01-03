import axios from 'axios';


export interface School {
    MarketingName: string;
    City: string;
    State: string;
}


export interface LookupData {
    Schools: School[];
}

export interface OAuthTokenResponse {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    expires_on: number;
    not_before: number;
    resource: string;
    access_token: string;
    GrantTime: Date;
    Expiration: Date;
}

export interface DynamicsSchoolResult {
    odatacontext: string;
    value: Value[];
}

export interface Value {
    odataetag: string;
    name: string;
    gsi_fmsid: string;
    gsi_schooladvertisingname: string;
    address1_city: string;
    address1_stateorprovince: string;
    accountid: string;
}


export class D365 {
    public lookupsJsonFile: string = '';
    private authUrl: string;
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    public bearerToken: string = '';
    private tokenExpiration: Date = new Date(0);

    constructor(authUrl?: string, clientId?: string, clientSecret?: string, baseUrl?: string) {
        this.authUrl = authUrl || '';
        this.clientId = clientId || '';
        this.clientSecret = clientSecret || '';
        this.baseUrl = baseUrl || '';
    }

    private async generateToken(): Promise<boolean> {
        const params = new URLSearchParams();
        params.append('client_id', this.clientId);
        params.append('resource', this.baseUrl);
        params.append('client_secret', this.clientSecret);
        params.append('grant_type', 'client_credentials');
        try {
            const response = await axios.post(this.authUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const tokenObj = response.data;
            if (tokenObj) {
                this.bearerToken = tokenObj.access_token;
                this.tokenExpiration = new Date(tokenObj.expires_on);
            }

            if (!this.bearerToken) throw new Error('Token not generated');
            if (this.tokenExpiration < new Date()) throw new Error('Token is expired');
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async init() {
        await this.generateToken();
    }

    public async getSchools(states?: string[]): Promise<School[]> {
        const rv: School[] = [];
        if (!this.bearerToken || this.tokenExpiration < new Date(Date.now() - 10000)) throw new Error('Token not acquired or expired');

        const version = '9.2';
        const apiUrl = `${this.baseUrl}/api/data/v${version}`;
        const reqUrl = `${apiUrl}/accounts?$select=gsi_schooladvertisingname,address1_city,address1_stateorprovince`;

        try {
            const response = await axios.get(reqUrl, {
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`
                }
            });

            const json = response.data;
            if (!json) {
                throw new Error('No response data');
            } else {
                const schoolsResult: DynamicsSchoolResult = json;
                if (!schoolsResult) return rv;
                for (const v of schoolsResult.value) {
                    if (v.gsi_schooladvertisingname && v.address1_city && v.address1_stateorprovince) {
                        const school: School = {
                            MarketingName: v.gsi_schooladvertisingname,
                            City: v.address1_city,
                            State: v.address1_stateorprovince
                        };
                        if (!states || states.includes(school.State)) {
                            rv.push(school);
                        }
                    } else if (v.address1_city) {
                        //console.log(`${v.address1_stateorprovince}, ${v.address1_city}`);
                    } else {
                        //console.log('totally blank');
                    }
                }
                return rv;
            }
        } catch (error) {
            throw error;
        }
    }
}