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
                    <label>余额</label>
                    <span>
                        <input type="checkbox"
                            ref={(e: HTMLInputElement) => {
                                if (!e) return;
                                e.checked = this.state.showBalance == true;
                                e.onchange = () => {
                                    this.state.showBalance = e.checked;
                                    this.setState(this.state);
                                }
                            }} />显示余额
                    </span>
                </div>
                <div>
                    <label>积分</label>
                    <span>
                        <input type="checkbox"
                            ref={(e: HTMLInputElement) => {
                                if (!e) return;
                                e.checked = this.state.showScore == true;
                                e.onchange = () => {
                                    this.state.showScore = e.checked;
                                    this.setState(this.state);
                                }
                            }} />显示积分
                    </span>
                </div>
                <div>
                    <label>等级</label>
                    <span>
                        <input type="checkbox"
                            ref={(e: HTMLInputElement) => {
                                if (!e) return;
                                e.checked = this.state.showLevel == true;
                                e.onchange = () => {
                                    this.state.showLevel = e.checked;
                                    this.setState(this.state);
                                }
                            }} />显示等级
                    </span>
                </div>
                <div>
                    <label>销售员中心</label>
                    <span>
                        <label>
                            <input name="sells-center" type="radio"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    e.checked = this.state.sellsCenter == 'showToMember';
                                    e.onchange = () => {
                                        this.state.sellsCenter = e.checked ? 'showToMember' : 'showToSells';
                                        this.setState(this.state);
                                    }
                                }} />对所以会员显示
                        </label>
                        <label>
                            <input name="sells-center" type="radio"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    e.checked = this.state.sellsCenter == 'showToSells';
                                    e.onchange = () => {
                                        this.state.sellsCenter = e.checked ? 'showToSells' : 'showToMember';
                                        this.setState(this.state);
                                    }
                                }} />只对销售员显示
                        </label>
                    </span>
                </div>
            </div>
        );
    }
}