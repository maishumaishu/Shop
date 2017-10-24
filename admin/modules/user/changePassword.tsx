// chitu.action(['ko.val','sv/ShopAdmin'], function (page) {
//     /// <param name="page" type="chitu.Page"/>
//     //services.shopping. modifyPassword



// });

// import adminService = require('adminServices/ShopAdmin');

// class PageModel {
//     private validation: KnockoutValidationErrors;

//     password = ko.observable();
//     confirmPassword = ko.observable();

//     constructor() {
//         this.password.extend({ required: true });
//         this.confirmPassword.extend({
//             equal: {
//                 onlyIf: () => {
//                     return this.password() != null;
//                 },
//                 params: this.password,
//                 message: '两次输入的密码不同'
//             }
//         });

//         this.validation = ko.validation.group(this);
//     }


//     changePassword(model: PageModel) {
//         if (!(<any>model).isValid()) {
//             this.validation.showAllMessages();
//             return;
//         }

//         // return adminService.changePassword(model.password());
//     }
// }

// export default function (page: chitu.Page) {
//     requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page, page.routeData.values);
//     })
// }

// function page_load(page: chitu.Page, args) {
//     page.element.className = 'admin-pc';
//     var model = new PageModel();
//     ko.applyBindings(model, page.element);
// }

import { Service } from 'adminServices/service';
import { UserService } from 'adminServices/user';
import site from 'site';

let userService = new UserService();


export default function (page: chitu.Page) {

}


class ChangePasswordPage extends React.Component<any, any>{
    changePassword() {
        return Promise.resolve();
    }
    render() {
        return (

            <div className="form-horizontal col-md-6 col-lg-5" style={{ marginTop: 20 }}>
                <div className="form-group">
                    <label className="col-md-3 control-label">新密码</label>
                    <div className="col-md-9">
                        <input data-bind="value:password" type="password" className="form-control" placeholder="请输入新密码" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-3 control-label">确认密码</label>
                    <div className="col-md-9">
                        <input data-bind="value:confirmPassword" type="password" className="form-control" placeholder="请再一次输入新密码" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-9 col-md-offset-3">
                        <button data-bind="click:changePassword" data-dialog="type:'flash',content:'修改密码成功'" className="btn btn-primary"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                e.onclick = ui.buttonOnClick(this.changePassword, { toast: '修改密码成功！' });
                            }}>
                            <span className="icon-ok"></span>确定
                        </button>
                    </div>
                </div>
            </div>

        );
    }
}