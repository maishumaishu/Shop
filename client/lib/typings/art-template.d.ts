interface Template {
    render(tmp: string, args: object)
}
declare module 'art-template' {
    let template: Template;
    export = template;
}