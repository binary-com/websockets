interface Response {
    /** Response type, "authorize" */
    type: string;
    /** Id of the request message */
    reply_to: string;
    /** Request object echeoed back */
    response: AuthorizeResponse;
}

interface AuthorizeResponse {
    email: string;
    currency: string;
    balance: number;
    loginid: string;
    fullname: string;
}
