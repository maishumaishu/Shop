define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // (<any>window).UEDITOR_HOME_URL = '/scripts/ueditor/'
    var references = ['ue/ueditor.config', 'ue/ueditor.all.min', 'ue/third-party/zeroclipboard/ZeroClipboard'];
    function createEditor(editorId, field, onContentChanged) {
        requirejs(references, function () {
            // window['UEDITOR_CONFIG'].serverUrl = `${location.protocol}//web.bailunmei.com/ueditor/net/controller.ashx`;
            window.ZeroClipboard = arguments[2];
            let UE = window['UE'];
            UE.delEditor(editorId);
            let ue = UE.getEditor(editorId, {
                elementPathEnabled: false,
                enableAutoSave: false
            });
            ue.ready(() => {
                ue.setHeight(300);
                ue.setContent(field.value || '');
                let disable_subscribe = false;
                // field.subscribe(function (value) {
                //     if (disable_subscribe)
                //         return;
                //     ue.setContent(value);
                // });
                ue.addListener('contentChange', function (editor) {
                    let content = this.getContent();
                    disable_subscribe = true;
                    field.value = content;
                    disable_subscribe = false;
                    if (onContentChanged) {
                        onContentChanged(content);
                    }
                });
            });
        });
    }
    exports.createEditor = createEditor;
    function createUEEditor(editorId, field) {
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
                    target: field
                };
                field.onchange(ev);
            });
        });
    }
    exports.createUEEditor = createUEEditor;
});
