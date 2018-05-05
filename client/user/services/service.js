var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "maishu-chitu", "share/common", "share/service", "share/common"], function (require, exports, chitu, common_1, service_1, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.guid = common_2.guid;
    exports.imageUrl = common_2.imageUrl;
    exports.parseUrlParams = common_2.parseUrlParams;
    exports.urlParams = common_2.urlParams;
    let appToken;
    // let _userToken: chitu.ValueStore<string>;
    // let USER_TOKEN = `${tokens.appToken}_userToken`;
    exports.tokens = (function () {
        let appId = common_1.urlParams.appKey;
        let USER_TOKEN = `${appId}_userToken`;
        let userToken = new chitu.ValueStore(localStorage.getItem(USER_TOKEN));
        userToken.add((value) => {
            if (!value) {
                localStorage.removeItem(USER_TOKEN);
                return;
            }
            localStorage.setItem(USER_TOKEN, value);
        });
        return {
            appId,
            userToken
        };
        // {
        //     get appToken() {
        //         if (appToken == null) {
        //             let search = location.search;
        //             console.assert(search != null, 'search cannt null.');
        //             appToken = urlParams.appKey;
        //         }
        //         return appToken;
        //     },
        //     // get userToken(): chitu.ValueStore<string> {
        //     //     if (_userToken == null) {
        //     //         let USER_TOKEN = `${tokens.appToken}_userToken`;
        //     //         //=========================================
        //     //         //FOR TEST
        //     //         // var a = 1;
        //     //         // localStorage.setItem(USER_TOKEN, '5a45dc610645b4047cde18f9')
        //     //         //=========================================
        //     //         _userToken = new chitu.ValueStore<string>(localStorage.getItem(USER_TOKEN));
        //     //         _userToken.add((value) => {
        //     //             if (!value) {
        //     //                 localStorage.removeItem(USER_TOKEN);
        //     //                 return;
        //     //             }
        //     //             localStorage.setItem(USER_TOKEN, value);
        //     //         })
        //     //     }
        //     //     return _userToken;
        //     // }
        //     userToken:new chitu.ValueStore<string>(localStorage.getItem())
        // }
    })();
    exports.config = {
        pageSize: 10
    };
    let protocol = location.protocol;
    let service_domain = common_1.serviceHost;
    class Service extends service_1.default {
        ajax(url, options) {
            const _super = name => super[name];
            return __awaiter(this, void 0, void 0, function* () {
                let host = service_domain; //Ping.optimumServer ||
                url = `${protocol}//${host}/${url}`;
                options = options || {};
                options.headers = options.headers || {};
                let self = this;
                if (!exports.tokens.appId) {
                    let err = new Error("app token error");
                    Service.error.fire(self, err);
                    return;
                }
                options.headers['application-id'] = exports.tokens.appId;
                if (exports.tokens.userToken.value)
                    options.headers['token'] = exports.tokens.userToken.value;
                return _super("ajax").call(this, url, options);
            });
        }
        static get storeName() {
            let key = `${common_1.urlParams.appKey}`;
            return "";
        }
    }
    Service.error = chitu.Callbacks();
    exports.Service = Service;
});
