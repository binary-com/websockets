interface Request {
    /** Unique id identifiyng the request */
    id: string;
    /** Request type */
    type: string;
    /** Parameters for the request */
    parameters: AuthorizeParameters;
}

interface AuthorizeParameters {
    /** Authorization token */
    token: string;
}
