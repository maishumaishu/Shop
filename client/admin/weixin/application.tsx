import * as chitu from 'maishu-chitu';
import * as ui from 'ui';

export class Application extends chitu.Application {

    constructor() {
        super()

        this.error.add((app, err) => this.on_error(app, err));
    }

    on_error(arg0: any, err: Error): any {
        ui.alert(err.message);
    }
}

window['app'] = window['app'] || new Application();
let app: Application = window['app'];
export default app;