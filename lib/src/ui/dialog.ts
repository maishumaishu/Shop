
namespace ui {

    function addClassName(element: HTMLElement, className: string) {
        console.assert(className != null, 'class is null');
        let c1 = (element.className || '').split(/\s+/);
        let c2 = className.split(/\s+/);
        var itemsToAdd = c2.filter(o => c1.indexOf(o) < 0);
        c1.push(...itemsToAdd);

        element.className = c1.join(' ');
    }


    function removeClassName(element: HTMLElement, className: string) {
        console.assert(className != null, 'class is null');
        let c1 = (element.className || '').split(/\s+/);
        let c2 = className.split(/\s+/);
        var itemsRemain = c1.filter(o => c2.indexOf(o) < 0);

        element.className = itemsRemain.join(' ');
    }

    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    export function showDialog(element: HTMLElement) {

        removeClassName(element, 'out');
        element.style.display = 'block';
        setTimeout(() => {
            addClassName(element, 'modal fade in');
        }, 100);

        let closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
        for (let i = 0; i < closeButtons.length; i++) {
            (closeButtons[i] as HTMLElement).onclick = () => hideDialog(element);
        }
    }

    export function hideDialog(element: HTMLElement) {

        removeClassName(element, 'in');
        addClassName(element, 'modal fade out');

        return new Promise((reslove, reject) => {
            setTimeout(() => {
                element.style.removeProperty('display');
                reslove();
            }, 1000);
        });
    }

    export function alert(args: string | { title: string, message: string }) {
        let element = document.createElement('div');
        ui.dialogContainer.appendChild(element);
        if (typeof args == 'string') {
            args = { title: '&nbsp;', message: args }
        }

        element.innerHTML = `
            <div class="modal-dialog">
                
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title">${args.title}</h4>
                    </div>
                    <div class="modal-body">
                        <h5>${args.message}</h5>
                    </div>
                    <div class="modal-footer">
                        <button name="ok" type="button" class="btn btn-primary">
                            确定
                        </button>
                    </div>
                </div>
            </div>
        `;
        // $(element).modal();
        // $(element).on('hidden.bs.modal', () => {
        //     $(element).remove();
        // });
        // var dialog = new Dialog(element);
        // dialog.show();
        ui.showDialog(element);

        let titleElement = element.querySelector('.modal-title');


        let modalFooter = element.querySelector('.modal-footer');
        let cancelButton = modalFooter.querySelector('[name="cancel"]') as HTMLButtonElement;
        let okButton = modalFooter.querySelector('[name="ok"]') as HTMLButtonElement;
        okButton.onclick = () => ui.hideDialog(element);//dialog.hide()

    }

    export function confirm(args: {
        title?: string, message: string, cancle?: () => void,
        confirm: (event: Event) => Promise<any>,
        container?: HTMLElement
    }) {

        // if (typeof args == 'string')
        //     args = { title: args };
        let title: string;
        let message: string;
        let execute = args.confirm;
        let container = args.container || document.body;
        
        if (typeof args == 'string') {
            message = args;
        }
        else {
            title = args.title;
            message = args.message;
        }

        let confirmDialogElment: HTMLElement;

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



        modalBody.innerHTML = `<h5>${message}</h5>`;
        if (title) {
            modalHeader.querySelector('h4').innerHTML = title;
        }

        let cancelButton = modalFooter.querySelector('[name="cancel"]') as HTMLButtonElement;
        let okButton = modalFooter.querySelector('[name="ok"]') as HTMLButtonElement;
        let closeButton = modalHeader.querySelector('.close') as HTMLElement;

        closeButton.onclick = cancelButton.onclick = function () {
            ui.hideDialog(confirmDialogElment).then(() => {
                confirmDialogElment.remove();
            });
        }

        okButton.onclick = function (event) {
            execute(event)
                .then(() => ui.hideDialog(confirmDialogElment))
                .then(() => {
                    confirmDialogElment.remove();
                });
        }

        ui.showDialog(confirmDialogElment);
    }
}