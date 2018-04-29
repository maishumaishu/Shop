
namespace ui {

    function dialogContainer(): HTMLElement {
        return dialogConfig.dialogContainer || document.body;
    }

    export let dialogConfig = {
        dialogContainer: null as HTMLElement
    }

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

    let dialogElements = new Array<HTMLElement>();
    let dialogCallbacks = new Array<Function>();
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    export function showDialog(element: HTMLElement, callback?: (button: HTMLButtonElement) => void) {

        removeClassName(element, 'out');
        element.style.display = 'block';
        setTimeout(() => {
            addClassName(element, 'modal fade in');
        }, 100);

        let dialogIndex = dialogElements.indexOf(element);
        if (dialogIndex < 0) {
            dialogElements.push(element);
            dialogIndex = dialogElements.length - 1;

            let closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
            for (let i = 0; i < closeButtons.length; i++) {
                (closeButtons[i] as HTMLElement).onclick = () => hideDialog(element);
            }

            let allButtons = element.querySelectorAll('button');
            for (let i = 0; i < allButtons.length; i++) {
                allButtons.item(i).addEventListener('click', function (event) {
                    let callback = dialogCallbacks[dialogIndex];
                    if (callback) {
                        callback(event.currentTarget as HTMLButtonElement);
                    }
                })
            }
        }

        dialogCallbacks[dialogIndex] = callback;
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
        dialogContainer().appendChild(element);
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

        dialogContainer().appendChild(confirmDialogElment);
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

    export let showPanel = (function () {
        let panel = document.createElement('div');
        panel.className = 'mobile-page panel';
        panel.style.display = 'none';

        document.body.appendChild(panel);
        panel.innerHTML = `
            <div class="modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
    
                        </div>
                        <div class="modal-body">
    
                        </div>
                        <div class="modal-footer">
    
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop in">
            </div>
        `;

        let modal = panel.querySelector('.modal') as HTMLElement;
        let backdrop = panel.querySelector('.modal-backdrop') as HTMLElement;
        let header = panel.querySelector('.modal-header') as HTMLElement;
        let footer = panel.querySelector('.modal-footer') as HTMLElement;

        let body = panel.querySelector(".modal-body") as HTMLElement;
        let modalDialog = panel.querySelector(".modal-dialog") as HTMLElement;

        let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0

        //=====================================================================
        // 点击非窗口区域，关窗口。并禁用上级元素的 touch 操作。
        // let panel = this.panel; //this.refs['panel'] as HTMLElement;
        // let modalDialog = this.modalDialog; //this.refs['modalDialog'] as HTMLElement;
        panel.addEventListener('touchstart', (event: TouchEvent) => {
            let dialogRect = modalDialog.getBoundingClientRect();
            for (let i = 0; i < event.touches.length; i++) {
                let { clientX } = event.touches[i];
                if (clientX < dialogRect.left) {
                    hide();
                    return;
                }
            }
        });

        if (isIOS) {
            panel.addEventListener('touchstart', (event) => {
                let tagName = (event.target as HTMLElement).tagName;
                if (tagName == 'BUTTON' || tagName == 'INPUT' || tagName == 'A') {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
            });
        }

        function hide() {
            modal.style.removeProperty('transform');
            backdrop.style.opacity = '0';
            window.setTimeout(() => {
                panel.style.display = 'none';
            }, 500);
        }

        return function showPanel(args: {
            /** render header */
            header?: (headerElement: HTMLElement) => void,
            /** render body */
            body?: (bodyElement: HTMLElement) => void,
            /** render footer */
            footer?: (footerElement: HTMLElement) => void
        }) {
            args = args || {};
            panel.style.display = 'block';
            modal.style.display = 'block';

            setTimeout(() => {
                modal.style.transform = 'translateX(0)';
                backdrop.style.opacity = '0.5';
            }, 50);

            let setBodyHeight = () => {
                let headerHeight = header.getBoundingClientRect().height;
                let footerHeight = footer.getBoundingClientRect().height;
                let bodyHeight = window.innerHeight - headerHeight - footerHeight;
                body.style.height = `${bodyHeight}px`;
            };

            window.addEventListener('resize', () => setBodyHeight());
            setBodyHeight();

            if (args.header)
                args.header(header);

            if (args.body)
                args.body(body);

            if (args.footer)
                args.footer(footer);

            return {
                hide: () => hide()
            }
        }
    })();
}

