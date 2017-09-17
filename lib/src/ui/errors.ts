namespace ui {
    export let errors = {
        argumentNull(paramName: string) {
            let msg = `Argumnet ${paramName} can not be null or empty.`;
            let error = new Error();
            error.message = msg;
            return error;
        }
    }
}