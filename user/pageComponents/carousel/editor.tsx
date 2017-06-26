import { Editor, EditorProps, guid } from 'mobileComponents/editor';
import { default as Control, Props as ControlProps, State as ControlState, CarouselItem } from 'mobileComponents/carousel/control';
// import site = require('Site');
import { default as station } from 'services/station';
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
export default class EditorComponent extends Editor<ControlProps, ControlState, EditorState, Control>{
    constructor(props) {
        super(props);
    }

}