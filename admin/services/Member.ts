
import { default as Service } from 'services/Service';

// import site = require('Site');

let JData = window['JData'];
export interface UserInfo {
    Id: string,
    Balance: number,
    Gender: string,
    UserId: string,
}
class MemberService extends Service {
    constructor() {
        super();
    }

    member = {
        dataSource() {
            var dataSource = new JData.WebDataSource(
                Service.config.memberUrl + 'Member/List'
            );
            return dataSource;
        }
    }

    async members(args: wuzhui.DataSourceSelectArguments) {

        let membersResult = await Service.get<wuzhui.DataSourceSelectResult<UserInfo>>(
            Service.config.memberUrl + 'Member/List',
            args
        );

        let members = membersResult.dataItems;
        let ids = members.map(o => o.Id);
        let memberBalances = await Service.get<Array<{ MemberId: string, Balance: number }>>(
            Service.config.accountUrl + 'Account/GetAccountBalances',
            { userIds: ids.concat(',') }
        );

        for (let i = 0; i < members.length; i++) {
            members[i].Balance = (memberBalances.filter(o => o.MemberId == members[i].Id)[0] || { Balance: 0 } as UserInfo).Balance;
        }

        return members;
    }

    recharge(userId: string, amount: number) {
        let url = Service.config.accountUrl + 'Account/Recharge';
        return Service.put(url, { userId, amount });
    }

    operator = {
        dataSource: function () {
            return new JData.WebDataSource(
                Service.config.shopUrl + 'Operator/List',
                Service.config.shopUrl + 'Operator/Create',
                null,
                Service.config.shopUrl + 'Operator/Delete'
            );
        },
        create: function (userId, outletId) {
            /// <return type="jQuery.Deferred"/>
            return $.ajax({
                url: Service.config.shopUrl + 'Operator/Create',
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
                url: Service.config.memberUrl + 'UserInfo/Get',
                data: {
                    AppUserId: userId
                }
            })
        },
        set: function (userId, nickName, country, province, city,
            headerImageUrl, gender) {
            return $.ajax({
                url: Service.config.memberUrl + 'UserInfo/Set',
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

let member = new MemberService();
export default member;
