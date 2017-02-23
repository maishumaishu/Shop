import service = require('services/Service');


class SMSService {
    sendVerifyCode(mobile: string) {
        let url = `http://${service.config.serviceHost}/sms/sendVerifyCode`;
        return service.putByJson<{smsId:string}> (url, { mobile, type: 'register' });
    }
}

export = new SMSService();