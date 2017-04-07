import { default as services } from 'services/Service';
import app = require('Application');
import bootbox  = require('bootbox');

services.error.add((error) => {
    if (error.Code == 'NotLogin') {
        app.redirect('User/Login');
        return;
    };
    if (bootbox) {
        bootbox.alert({
            title: '错误',
            message: error.Message
        });
    }
    else {
        alert(error.Message);
    }
})