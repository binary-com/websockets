interface PortfolioRequest {
    /** Unique id identifiyng the request */
    id: string;
    /** Request type */
    type: string;
    /** Parameters for the request */
    parameters: PortfolioParameters;
}

interface PortfolioParameters {
    /** Authorization token */
    token: string;
}
