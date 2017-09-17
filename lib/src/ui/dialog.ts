
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

    export class Dialog {
        private element: HTMLElement;
        constructor(element: HTMLElement) {
            this.element = element;
        }
        show() {
            this.element.style.display = 'block';

            removeClassName(this.element, 'out');
            addClassName(this.element, 'modal fade in');
        }
        hide(): Promise<any> {
            removeClassName(this.element, 'in');
            addClassName(this.element, 'modal fade out');

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
}