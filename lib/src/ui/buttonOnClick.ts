namespace ui {
    export type Callback = (event: MouseEvent) => Promise<any>;
    export type Arguments = { confirm?: string, toast?: string | HTMLElement };

    export let dialogContainer = document.body;
    export function setDialogContainer(value: HTMLElement) {
        if (value == null)
            throw new Error('value can not be null.');

        dialogContainer = value;
    }



    export function buttonOnClick(callback: Callback, args?: Arguments): (event: Event) => void {
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

        return function (event: Event) {
            let confirmPromise: Promise<any>;
            let confirmDialogElment: HTMLElement;

            if (!args.confirm) {
                execute(event);
                return;
            }

            confirmDialogElment = document.createElement('div');
            confirmDialogElment.className = 'modal fade';
            confirmDialogElment.style.marginTop = '20px'
            console.assert(dialogContainer != null, 'dialog container is null');

            dialogContainer.appendChild(confirmDialogElment);
            confirmDialogElment.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                    </button>
                                    <h4 class="modal-title">确认</h4>
                                </div>
                                <div class="modal-body form-horizontal">
                                   
                                </div>
                                <div class="modal-footer">
                                    <button name="cancel" type="button" class="btn btn-default">
                                        取消
                                    </button>
                                    <button name="ok" type="button" class="btn btn-primary">
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

            let modalHeader = confirmDialogElment.querySelector('.modal-header');
            let modalBody = confirmDialogElment.querySelector('.modal-body');
            let modalFooter = confirmDialogElment.querySelector('.modal-footer');

            modalBody.innerHTML = `<h5>${args.confirm}</h5>`;

            let cancelButton = modalFooter.querySelector('[name="cancel"]') as HTMLButtonElement;
            let okButton = modalFooter.querySelector('[name="ok"]') as HTMLButtonElement;
            let closeButton = modalHeader.querySelector('.close') as HTMLElement;

            closeButton.onclick = cancelButton.onclick = function () {
                ui.hideDialog(confirmDialogElment).then(() => {
                    confirmDialogElment.remove();
                });
            }
            okButton.onclick = function () {
                // execute(event).then(() => $(confirmDialogElment).modal('hide'));
                execute(event)
                    .then(() => ui.hideDialog(confirmDialogElment))
                    .then(() => {
                        confirmDialogElment.remove();
                    });
            }

            // $(confirmDialogElment).modal();
            // $(confirmDialogElment).on('hidden.bs.modal', function () {
            //     $(confirmDialogElment).remove();
            // });
            // let dialog = new Dialog(confirmDialogElment);
            // dialog.show();
            ui.showDialog(confirmDialogElment);
        }
    }

    function showToastMessage(msg: string | HTMLElement) {
        if (!msg)
            throw new Error('Argument msg is null.');

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

        let dialog = new Dialog(toastDialogElement);
        dialog.show();
        setTimeout(() => {
            dialog.hide().then(() => {
                toastDialogElement.remove();
                dialog = null;
            });
        }, 500);
    }
}