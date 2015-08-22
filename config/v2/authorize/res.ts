interface ResponseMessage {
    /** "authorize" */
    msg_type: string;
    /** Request object echeoed back */
    echo_req: EchoedRequest;
    authorize: AuthorizeResponse;
}

interface AuthorizeResponse {
    token: string;
    email: string;
    currency: string;
    balance: number;
    loginid: string;
    fullname: string;
}

interface EchoedRequest {

}
