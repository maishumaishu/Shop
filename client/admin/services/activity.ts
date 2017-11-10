// (function (factory) {
//     var references = ['sv/Services', 'JData'];
//     if (typeof define === 'function') {
//         define(references, factory);
//     }
//     else {
//         factory();
//     }

// })(function () {
import { default as Service } from 'adminServices/service';

//HELLO

let headers = {};
if (Service.token)
    headers['user-token'] = Service.token;

if (location.search) {
    headers['application-key'] = location.search.substr(1);
}

$.ajaxSettings.headers = headers;

var baseUrl = Service.config.shopUrl + 'PromotionActivity/';
let JData = window['JData'];
export class ActivityService extends Service {
    private url(path: string): string {
        return `${Service.config.shopUrl}PromotionActivity/${path}`;
    }
    addActivity(item) {
        // let url = baseUrl + 'AddActivity';
        let url = this.url('SaveActivity');
        return this.post(url, item);
    }
    updateActivity(item) {
        let url = this.url('SaveActivity');
        return this.post(url, item);
    }
    getActivity(id: string): Promise<any> {
        let url = this.url('GetActivity');//baseUrl + 'GetActivity'
        return this.get(url, { id }); //$.ajax({ url: baseUrl + 'GetActivity', method: 'post', data: { id: id } });
    }
    deleteActivity(item: PromotionActivity): Promise<any> {
        // let url = baseUrl + 'DeleteActivity';
        let url = this.url('DeleteActivity');
        return this.deleteByJson(url, { id: item.Id });
    }
    activities(): Promise<any> {
        let url = this.url('GetActivities');
        return this.get(url);
    }
    addPromotion(activityId, type, method) {
        let url = this.url('AddPromotion');
        let data = {
            activityId: activityId,
            type: type,
            method: method
        };
        return this.post<{ Id: string }>(url, data);
    }

    deletePromotion(id) {
        // return $.ajax({ url: baseUrl + 'DeletePromotion', method: 'post', data: { id: id } });
        let url = this.url('DeletePromotion');
        let data = { id };
        return this.delete(url, data);
    }
    promotions(activityId) {
        /// <returns type="jQuery.Deferred"/>
        // return $.ajax({ url: baseUrl + 'GetPromotions', method: 'get', data: { activityId: activityId } });
        let url = this.url('GetPromotions');
        return this.get<Promotion[]>(url, { activityId });
    }
    addRangeRule(objectId, objectName, objectType, collectionType, promotionId) {
        /// <returns type="jQuery.Deferred"/>
        // return $.ajax({
        //     url: baseUrl + 'AddRangeRule',
        //     method: 'post',
        //     data: {
        //         objectId: objectId,
        //         objectName: objectName,
        //         objectType: objectType,
        //         collectionType: collectionType,
        //         promotionId: promotionId
        //     }
        // });

        let data = {
            objectId: objectId,
            objectName: objectName,
            objectType: objectType,
            collectionType: collectionType,
            promotionId: promotionId
        }

        let url = this.url('AddRangeRule');
        return this.post<{ Id: string }>(url, data);
    }
    deleteRangeRule(id) {
        /// <returns type="jQuery.Deferred"/>
        // return $.ajax({
        //     url: baseUrl + 'DeleteRangeRule',
        //     method: 'post',
        //     data: {
        //         id: id
        //     }
        // });
        let url = this.url('DeleteRangeRule');
        return this.delete(url, { id });
    }
    addContentRule(levelValue, givenType, givenValue, promotionId, description) {
        // return $.ajax({
        //     url: baseUrl + 'AddContentRule',
        //     method: 'post',
        //     data: {
        //         levelValue: levelValue,
        //         givenType: givenType,
        //         givenValue: givenValue,
        //         promotionId: promotionId,
        //         description: description
        //     }
        // });
        let url = this.url('AddContentRule');
        return this.post<{ Id: string }>(url, {
            levelValue: levelValue,
            givenType: givenType,
            givenValue: givenValue,
            promotionId: promotionId,
            description: description
        });
    }
    deleteContentRule(id) {
        // return $.ajax({
        //     url: baseUrl + 'DeleteContentRule',
        //     method: 'post',
        //     data: {
        //         id: id
        //     }
        // });
        let url = this.url('DeleteContentRule');
        return this.delete(url, { id });
    }
    changeCollectionType(ruleId, type) {
        /// <returns type="jQuery.Deferred"/>
        // return $.ajax({
        //     url: baseUrl + 'ChangeCollectionType',
        //     method: 'post',
        //     data: {
        //         ruleId: ruleId,
        //         type: type
        //     }
        // });
        let url = this.url('ChangeCollectionType');
        return this.post(url, { ruleId, type });
    }
    changeIsAll(promotionId, isAll) {
        // return $.ajax({
        //     url: baseUrl + 'ChangeIsAll',
        //     method: 'post',
        //     data: {
        //         promotionId: promotionId,
        //         isAll: isAll
        //     }
        // });
        let url = this.url('ChangeIsAll');
        return this.post(url, { promotionId, isAll });
    }
    updateActivityPromotions(activityId: string, promotions: Array<Promotion>) {
        let url = this.url('UpdateActivityPromotions');
        return this.postByJson(url, { activityId, promotions })
    }
}

let active = new ActivityService();
export default active;
