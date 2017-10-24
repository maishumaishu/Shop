import { Editor, EditorProps, guid } from 'pageComponents/editor';
import { default as Control, Props as ControlProps, State as ControlState, CarouselItem } from 'pageComponents/carousel/control';
// import site = require('Site');
import { StationService } from 'userServices/stationService';
// import { ImagePreview } from 'common/ImagePreview';
// import { Button } from 'common/controls';
import FormValidator from 'lib/formValidator';

/**
 * TODO:
 * 1. 表单验证
 * 2. 窗口关闭后，数据清除
 * 3. 编辑，删除功能
 */
requirejs([`css!${Editor.path('carousel')}.css`]);
// & { editItemIndex: number }
export interface EditorState {
    editItemIndex: number
}
export default class EditorComponent extends Editor<EditorProps, EditorState>{
    constructor(props) {
        super(props);
    }

}