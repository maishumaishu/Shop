import { default as services } from 'services/Service';
import app = require('Application');


let container = document.createElement('div');
container.className = 'admin-pc';
document.body.appendChild(container);

let alertElement = document.createElement('div');
alertElement.className = 'modal fade';
container.appendChild(alertElement);

function alert(error: { title: string, message: string }) {
    ReactDOM.render(
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                    </button>
                    <h4 className="modal-title">{error.title}</h4>
                </div>
                <div className="modal-body">
                    <h5>{error.message}</h5>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary"
                        ref={(e: HTMLButtonElement) => {
                            if (!e) return;

                            e.onclick = () => $(alertElement).modal('hide');

                        }}>确认</button>
                </div>
            </div>
        </div>
        , alertElement,
        () => {
            $(alertElement).modal();
        });
}

services.error.add((error) => {
    if (error.Code == 'NotLogin') {
        app.redirect('User/Login');
        return;
    };
    alert({
        title: '错误',
        message: error.Message
    });
});