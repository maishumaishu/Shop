import { default as services } from 'service';
import app = require('application');


let container = document.createElement('div');
container.className = 'admin-pc';
document.body.appendChild(container);

let alertElement = document.createElement('div');
alertElement.className = 'modal fade';
container.appendChild(alertElement);

services.error.add((sender, error) => {
    if (error.Code == 'NotLogin') {
        app.redirect('user/login');
        return;
    };
    ui.alert({
        title: '错误',
        message: error.Message || error.message
    });
});