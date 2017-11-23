namespace ui {
    export type Callback = (event: MouseEvent) => Promise<any>;
    export type Arguments = { confirm?: string | (() => string), toast?: string | HTMLElement };

    export function buttonOnClick(callback: Callback, args?: Arguments): (event: Event) => void;
    export function buttonOnClick(element: HTMLButtonElement, callback: Callback, args?: Arguments);
    export function buttonOnClick(arg1: any, arg2: any, arg3?: Arguments): (event: Event) => void {
        let element: HTMLButtonElement;
        let callback: Callback;
        let args: Arguments;
        if (typeof (arg1) == 'function') {
            callback = arg1;
            args = arg2;
        }
        else if (typeof (arg2) == 'function') {
            element = arg1;
            callback = arg2;
            args = args;
        }
        else {
            throw new Error("Arguments error");
        }

        args = args || {};
        let execute = async (event) => {
            let button = (event.target as HTMLButtonElement);
            button.setAttribute('disabled', '');
            try {
                await callback(event);
                if (args.toast) {
                    showToastMessage(args.toast);
                }
            }
            catch (exc) {
                console.error(exc);
                throw exc;
            }
            finally {
                button.removeAttribute('disabled')
            }
        }

        let result = function (event: Event) {

            if (!args.confirm) {
                execute(event);
                return;
            }

            let text = typeof args.confirm == 'string' ?
                args.confirm :
                args.confirm();
            ui.confirm({ message: text, confirm: (event) => execute(event) });
        }
        if (element)
            element.onclick = result;

        return result;
    }

    function showToastMessage(msg: string | HTMLElement) {
        if (!msg)
            throw new Error('Argument msg is null.');

        let dialogContainer: HTMLElement = dialogConfig.dialogContainer || document.body;
        let toastDialogElement = document.createElement('div');
        toastDialogElement.className = 'modal fade in';
        toastDialogElement.style.marginTop = '20px';
        console.assert(dialogContainer != null, 'dialog container is null.');
        dialogContainer.appendChild(toastDialogElement);

        toastDialogElement.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body form-horizontal">
                                </div>
                            </div>
                        </div>
                    `;
        let modalBody = toastDialogElement.querySelector('.modal-body');
        console.assert(modalBody != null);
        if (typeof msg == 'string')
            modalBody.innerHTML = `<h5>${msg}</h5>`;
        else
            modalBody.appendChild(msg);

        // let dialog = new Dialog(toastDialogElement);
        // dialog.show();
        ui.showDialog(toastDialogElement);
        setTimeout(() => {
            ui.hideDialog(toastDialogElement).then(() => {
                toastDialogElement.remove();
            });
        }, 500);
    }
}