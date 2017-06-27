namespace ui {
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