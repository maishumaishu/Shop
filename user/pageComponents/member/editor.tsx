import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobileComponents/member/control';
requirejs(['css!mobileComponents/member/editor.css']);

export interface EditorState {

}

export default class MemberEditor extends Editor<ControlProps, ControlState, EditorState, Control> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="member-editor well">
                <div className="bg">
                    <label>
                        背景图
                    </label>
                    <span>
                        <img src="../user/pageComponents/member/images/bg_user.png" />
                        <a href="">修改图片</a>
                    </span>
                </div>
                <div>
                    <label>等级</label>
                    <span>
                        <input type="checkbox" />显示等级
                    </span>
                </div>
                <div>
                    <label>积分</label>
                    <span>
                        <input type="checkbox" />显示积分
                    </span>
                </div>
                <div>
                    <label>销售员中心</label>
                    <span>
                        <label>
                            <input name="sells-center" type="radio" />对所以会员显示
                        </label>
                        <label>
                            <input name="sells-center" type="radio" />只对销售员显示
                        </label>
                    </span>
                </div>
            </div>
        );
    }
}