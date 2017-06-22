interface FetchOptions {
    method?: string,
    headers?: any,
    body?: any,
}

interface FetchResponse {
    json(): any;
    text(): string | Promise<string>;
    status: number;
    statusText: string;
    headers: FetchHeader;
}

interface FetchHeader {
    get(name: string): string
}

declare function fetch(url: string, options: FetchOptions): Promise<FetchResponse>


declare module "fetch" {
    export = fetch;
}