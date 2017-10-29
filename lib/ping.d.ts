declare class Ping {
    constructor(options?: {
        favicon?: string,
        timeout?: number
    })

    ping(source: string, callback: ((err, ping) => void));
}