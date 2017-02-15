
(<any>window).UEDITOR_HOME_URL = 'ueditor/'
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
