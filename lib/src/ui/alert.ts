
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

    export function alert(msg: string) {
        let element = document.createElement('div');
        ui.dialogContainer.appendChild(element);
        // ReactDOM.render(
        //     <div className="modal-dialog">
        //         <div className="modal-content">
        //             <div className="modal-body">
        //                 <h5>{msg}</h5>
        //             </div>
        //         </div>
        //     </div>,
        //     element
        // );
        element.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <h5>${msg}</h5>
                    </div>
                </div>
            </div>
        `;
        $(element).modal();
        $(element).on('hidden.bs.modal', () => {
            $(element).remove();
        });
    }
}