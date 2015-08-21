interface ResponseMessage {
    msg_type: string;
    echo_msg: EchoMessage;
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

interface EchoMessage {

}
