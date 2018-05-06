declare module 'lessc' {
    export class Parser {
        constructor(options);
        parse(input: string, callback: (err, tree: { toCSS: () => string }) => void);
    }
}