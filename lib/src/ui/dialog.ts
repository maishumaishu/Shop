
namespace ui {

    export class Dialog {
        private element: HTMLElement;
        constructor(element: HTMLElement) {
            this.element = element;
        }
        show() {
            this.element.style.display = 'block';
            this.element.className = 'modal fade in';
        }
        hide(): Promise<any> {
            this.element.className = 'modal fade out';
            this.element.style.removeProperty('display');
            return new Promise((reslove, reject) => {
                setTimeout(() => {
                    reslove();
                }, 1000);
            });
        }
    }

    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    export function showDialog(element: HTMLElement) {
        element.style.display = 'block';
        element.className = 'modal fade in';
        let closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
        for (let i = 0; i < closeButtons.length; i++) {
            (closeButtons[i] as HTMLElement).onclick = () => hideDialog(element);
        }
    }

    export function hideDialog(element: HTMLElement) {
        element.className = 'modal fade out';
        element.style.removeProperty('display');
        return new Promise((reslove, reject) => {
            setTimeout(() => {
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
        var dialog = new Dialog(element);
        dialog.show();

        let titleElement = element.querySelector('.modal-title');


        let modalFooter = element.querySelector('.modal-footer');
        let cancelButton = modalFooter.querySelector('[name="cancel"]') as HTMLButtonElement;
        let okButton = modalFooter.querySelector('[name="ok"]') as HTMLButtonElement;
        okButton.onclick = () => dialog.hide();

    }
}