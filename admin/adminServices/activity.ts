﻿// (function (factory) {
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
    // activities = new JData.WebDataSource(baseUrl + 'GetActivities', baseUrl + 'AddActivity', null, baseUrl + 'DeleteActivity');
    addActivity(item) {
        let url = baseUrl + 'AddActivity';
        return this.postByJson(url, item);
    }
    getActivity(id: string): Promise<any> {
        return this.get(baseUrl + 'GetActivity', { id }); //$.ajax({ url: baseUrl + 'GetActivity', method: 'post', data: { id: id } });
    }
    deleteActivity(item): Promise<any> {
        let url = baseUrl + 'DeleteActivity';
        return this.deleteByJson(url, item);
    }
    activities(): Promise<any> {
        return this.get(baseUrl + 'GetActivities');
    }
    addPromotion(activityId, type, method) {
        /// <returns type="jQuery.Deferred"/>
        debugger;
        return $.ajax({
            url: baseUrl + 'AddPromotion', method: 'post',
            data: {
                activityId: activityId,
                type: type,
                method: method
            }
        });
    }
    deletePromotion(id) {
        /// <returns type="jQuery.Deferred"/>
        return $.ajax({ url: baseUrl + 'DeletePromotion', method: 'post', data: { id: id } });
    }
    getPromotions(activityId) {
        /// <returns type="jQuery.Deferred"/>
        return $.ajax({ url: baseUrl + 'GetPromotions', method: 'get', data: { activityId: activityId } });
    }
    addRangeRule(objectId, objectName, objectType, collectionType, promotionId) {
        /// <returns type="jQuery.Deferred"/>
        return $.ajax({
            url: baseUrl + 'AddRangeRule',
            method: 'post',
            data: {
                objectId: objectId,
                objectName: objectName,
                objectType: objectType,
                collectionType: collectionType,
                promotionId: promotionId
            }
        });
    }
    deleteRangeRule(id) {
        /// <returns type="jQuery.Deferred"/>
        return $.ajax({
            url: baseUrl + 'DeleteRangeRule',
            method: 'post',
            data: {
                id: id
            }
        });
    }
    addContentRule(levelValue, givenType, givenValue, promotionId, description) {
        return $.ajax({
            url: baseUrl + 'AddContentRule',
            method: 'post',
            data: {
                levelValue: levelValue,
                givenType: givenType,
                givenValue: givenValue,
                promotionId: promotionId,
                description: description
            }
        });
    }
    deleteContentRule(id) {
        return $.ajax({
            url: baseUrl + 'DeleteContentRule',
            method: 'post',
            data: {
                id: id
            }
        });
    }
    changeCollectionType(ruleId, type) {
        /// <returns type="jQuery.Deferred"/>
        return $.ajax({
            url: baseUrl + 'ChangeCollectionType',
            method: 'post',
            data: {
                ruleId: ruleId,
                type: type
            }
        });
    }
    changeIsAll(promotionId, isAll) {
        return $.ajax({
            url: baseUrl + 'ChangeIsAll',
            method: 'post',
            data: {
                promotionId: promotionId,
                isAll: isAll
            }
        });
    }
}

let active = new ActivityService();
export default active;