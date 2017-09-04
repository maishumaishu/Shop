"use strict";
exports.__esModule = true;
window.UEDITOR_HOME_URL = 'scripts/ueditor/';
var references = ['ue/ueditor.config', 'ue/ueditor.all', 'ue/third-party/zeroclipboard/ZeroClipboard'];
function createEditor(editorId, field) {
    var ueditorLoadDeferred = $.Deferred();
    requirejs(references, function () {
        window.ZeroClipboard = arguments[2];
        var UE = window['UE'];
        UE.delEditor(editorId);
        var ue = UE.getEditor(editorId, {
            elementPathEnabled: false,
            enableAutoSave: false
        });
        ue.ready(function () {
            ue.setHeight(300);
            ue.setContent(field() || '');
            var disable_subscribe = false;
            field.subscribe(function (value) {
                if (disable_subscribe)
                    return;
                ue.setContent(value);
            });
            ue.addListener('contentChange', function (editor) {
                var content = this.getContent();
                disable_subscribe = true;
                field(content);
                disable_subscribe = false;
            });
        });
    });
}
exports.createEditor = createEditor;
function createUEEditor(editorId, field) {
    var ueditorLoadDeferred = $.Deferred();
    requirejs(references, function () {
        window.ZeroClipboard = arguments[2];
        var UE = window['UE'];
        UE.delEditor(editorId);
        var ue = UE.getEditor(editorId, {
            elementPathEnabled: false,
            enableAutoSave: false
        });
        ue.ready(function () {
            ue.setHeight(300);
            ue.setContent(field.value || '');
            var disable_subscribe = false;
            // field.subscribe(function (value) {
            //     if (disable_subscribe)
            //         return;
            //     ue.setContent(value);
            // });
            ue.addListener('contentChange', function (editor) {
                var content = this.getContent();
                disable_subscribe = true;
                field.value = (content);
                disable_subscribe = false;
            });
        });
    });
}
exports.createUEEditor = createUEEditor;
