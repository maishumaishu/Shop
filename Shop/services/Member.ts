
import Service = require('services/Service');
import site = require('Site');

let JData = window['JData'];
class MemberService extends Service {
    constructor() {
        super();
    }

    member = {
        dataSource() {
            var dataSource = new JData.WebDataSource(
                site.config.memberUrl + 'Member/List'
            );
            return dataSource;
        }
    }

    operator = {
        dataSource: function () {
            return new JData.WebDataSource(
                site.config.shopUrl + 'Operator/List',
                site.config.shopUrl + 'Operator/Create',
                null,
                site.config.shopUrl + 'Operator/Delete'
            );
        },
        create: function (userId, outletId) {
            /// <return type="jQuery.Deferred"/>
            return $.ajax({
                url: site.config.shopUrl + 'Operator/Create',
                data: {
                    memberId: userId,
                    outletId: outletId
                }
            })
        }
    }

    userInfo = {
        get: function (userId) {
            return $.ajax({
                url: site.config.memberUrl + 'UserInfo/Get',
                data: {
                    AppUserId: userId
                }
            })
        },
        set: function (userId, nickName, country, province, city,
            headerImageUrl, gender) {
            return $.ajax({
                url: site.config.memberUrl + 'UserInfo/Set',
                data: {
                    userId: userId,
                    nickName: nickName,
                    coutry: country,
                    province: province,
                    city: city,
                    headerImageUrl: headerImageUrl,
                    gender: gender
                }
            });
        }
    }

    account = {
        removeAccount: function (username) {
            return Service.callMethod('Account/RemoveAccount', { username: username });
        },
        recharge: function (memberId: string, amount: number, password: string): JQueryPromise<any> {
            var data = { memberId: memberId, amount: amount, password: password };
            return Service.callMethod('Account/Recharge', data);
        }
    }
}

export = new MemberService();
