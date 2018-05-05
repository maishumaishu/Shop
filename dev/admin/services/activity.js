// (function (factory) {
//     var references = ['sv/Services', 'JData'];
//     if (typeof define === 'function') {
//         define(references, factory);
//     }
//     else {
//         factory();
//     }
define(["require", "exports", "admin/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //HELLO
    let headers = {};
    if (service_1.default.token)
        headers['user-token'] = service_1.default.token;
    if (location.search) {
        headers['application-id'] = location.search.substr(1);
    }
    var baseUrl = service_1.default.config.shopUrl + 'PromotionActivity/';
    let JData = window['JData'];
    class ActivityService extends service_1.default {
        url(path) {
            return `${service_1.default.config.shopUrl}PromotionActivity/${path}`;
        }
        addActivity(item) {
            // let url = baseUrl + 'AddActivity';
            let url = this.url('SaveActivity');
            return this.postByJson(url, item);
        }
        updateActivity(item) {
            let url = this.url('SaveActivity');
            return this.postByJson(url, item);
        }
        getActivity(id) {
            let url = this.url('GetActivity'); //baseUrl + 'GetActivity'
            return this.get(url, { id }); //$.ajax({ url: baseUrl + 'GetActivity', method: 'post', data: { id: id } });
        }
        deleteActivity(item) {
            // let url = baseUrl + 'DeleteActivity';
            let url = this.url('DeleteActivity');
            return this.deleteByJson(url, { id: item.Id });
        }
        activities() {
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
            return this.postByJson(url, data);
        }
        deletePromotion(id) {
            // return $.ajax({ url: baseUrl + 'DeletePromotion', method: 'post', data: { id: id } });
            let url = this.url('DeletePromotion');
            let data = { id };
            return this.deleteByJson(url, data);
        }
        promotions(activityId) {
            /// <returns type="jQuery.Deferred"/>
            // return $.ajax({ url: baseUrl + 'GetPromotions', method: 'get', data: { activityId: activityId } });
            let url = this.url('GetPromotions');
            return this.get(url, { activityId });
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
            };
            let url = this.url('AddRangeRule');
            return this.postByJson(url, data);
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
            return this.deleteByJson(url, { id });
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
            return this.postByJson(url, {
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
            return this.deleteByJson(url, { id });
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
            return this.postByJson(url, { ruleId, type });
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
            return this.postByJson(url, { promotionId, isAll });
        }
        updateActivityPromotions(activityId, promotions) {
            let url = this.url('UpdateActivityPromotions');
            return this.postByJson(url, { activityId, promotions });
        }
    }
    exports.ActivityService = ActivityService;
});
