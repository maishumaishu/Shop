
import { ValueStore } from 'service';

(<any>window).UEDITOR_HOME_URL = 'scripts/ueditor/'
var references = ['ue/ueditor.config', 'ue/ueditor.all', 'ue/third-party/zeroclipboard/ZeroClipboard'];

export function createEditor(editorId: string, field: KnockoutObservable<string>) {
    let ueditorLoadDeferred = $.Deferred();

    requirejs(references, function () {
        (<any>window).ZeroClipboard = arguments[2];
        let UE = window['UE'];
        UE.delEditor(editorId);
        let ue = UE.getEditor(editorId, {
            elementPathEnabled: false,
            enableAutoSave: false
        });

        ue.ready(() => {
            ue.setHeight(300);
            ue.setContent(field() || '');

            let disable_subscribe = false;
            field.subscribe(function (value) {
                if (disable_subscribe)
                    return;

                ue.setContent(value);
            });

            ue.addListener('contentChange', function (editor) {
                let content = this.getContent();
                disable_subscribe = true;
                field(content);
                disable_subscribe = false;
            });
        });


    });
}

export function createUEEditor(editorId: string, field: HTMLInputElement) {
    let ueditorLoadDeferred = $.Deferred();

    requirejs(['um', 'um_zh'], function () {

        let UM = window['UM'];
        UM.delEditor(editorId);
        var um = UM.getEditor(editorId, {
            /* 传入配置参数,可配参数列表看umeditor.config.js */
            //toolbar: []//'undo redo | bold italic underline'
            initialFrameHeight: 300,
            initialFrameWidth: '100%'
        });
        um.addListener('contentChange', function () {
            let content = this.getContent();
            field.value = content;
            
            let ev = {
                target: field as EventTarget
            } as Event;

            field.onchange(ev);
        });
    });
}

