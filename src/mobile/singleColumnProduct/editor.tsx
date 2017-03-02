import { Editor, ValueStoreContainer } from 'mobile/common';
import { Data, default as Control } from 'mobile/singleColumnProduct/control'

export default class MyEditor extends Editor<any> {
    controlType = Control;
    dataType = Data;

    render() {
        return (
            <div>
                SingleColumnProduct Editor
            </div>
        );
    }
}