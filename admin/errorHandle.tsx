import { default as services } from 'adminServices/service';
import app = require('application');


let container = document.createElement('div');
container.className = 'admin-pc';
document.body.appendChild(container);

let alertElement = document.createElement('div');
alertElement.className = 'modal fade';
container.appendChild(alertElement);

services.error.add((sender, error) => {
    //724

    if (error.name == 'NotLogin' || error.name == `724`) {
        services.token = '';
        // location.search = '';
        // app.redirect('user/login');
        location.href = 'index.html#user/login';
        return;
    };

    //========================================
    // 延迟处理错误，让其它模块先处理
    let timeoutId = setTimeout(() => {
        if (!error['handled']) {
            ui.alert({
                title: '错误',
                message: error.message
            });
        }

        clearTimeout(timeoutId);

    }, 100);
    //========================================
});