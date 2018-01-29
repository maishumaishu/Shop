import { Service } from 'userServices/service';
import { userData } from 'userServices/userData';
import { app } from 'application';
import { AppError, ErrorCodes } from 'share/common';

// let container = document.createElement('div');
// container.className = 'admin-pc';
// document.body.appendChild(container);

// let alertElement = document.createElement('div');
// alertElement.className = 'modal fade';
// container.appendChild(alertElement);

Service.error.add((sender, err: AppError) => {
    if (err.handled)
        return;

    switch (err.name) {
        case ErrorCodes.Unkonwn:     //600 为未知异常
        default:
            ui.alert({ title: '错误', message: err.message });
            console.log(err);
            break;
        case ErrorCodes.TokenInvalid:     //724 为 token 失效
        case ErrorCodes.UserNotLogin:     //601 为用户未登录异常
            if (err.name == '724') {
                userData.userToken.value = '';
            }
            var currentPage = app.currentPage;
            let isLoginPage = currentPage.name == 'user.login';
            if (isLoginPage) {
                return;
            }
            //========================================================
            app.showPage('user_login', { return: currentPage.routeData.routeString });
            let url = location.href;
            url = url.replace(location.hash, '#user_login');
            break;
        case '725':
            ui.alert({ title: '错误', message: 'application-key 配置错误' });
            break;
    }
});