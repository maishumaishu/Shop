import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobileComponents/member/control';
import { StationService } from 'adminServices/station';
import { imageUrl } from 'userServices/service';

requirejs(['css!mobileComponents/member/editor.css']);

export interface EditorState extends Partial<ControlState> {

}

let station = new StationService();
//station.saveImage()

export default class MemberEditor extends Editor<EditorProps, EditorState> {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let bg = this.state.bg ? imageUrl(this.state.bg) :
            Control.default_bg

        return (
            <div className="member-editor well">
                <div className="bg" style={{ height: 66 }}>
                    <label style={{ display: 'table-cell' }}>
                        背景图
                    </label>
                    <span style={{ display: 'table-cell', width: 120, height: 66, textAlign: 'center', cursor: 'pointer' }}>
                        <img src={bg} style={{ width: '100%', height: '100%' }} />
                        <input type="file" title="点击修改背景图" multiple={false}
                            style={{
                                display: 'table-cell', width: 120, height: 66,
                                position: 'relative', top: -66, opacity: 0
                            }}
                            ref={(e: HTMLInputElement) => {
                                if (!e) return;
                                e.onchange = async () => {
                                    if (e.files[0]) {
                                        let { base64, width, height } = await ui.imageFileToBase64(e.files[0], { width: 316, height: 184 });
                                        let { _id } = await station.saveImage(base64);
                                        this.state.bg = `${_id}_${width}_${height}`;
                                        this.setState(this.state);
                                    }
                                }
                            }} />
                    </span>

                </div>
                <div>
                    <label style={{ display: 'table-cell' }}>余额</label>
                    <span style={{ display: 'table-cell' }}>
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
                    <label style={{ display: 'table-cell' }}>积分</label>
                    <span style={{ display: 'table-cell' }}>
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
                {/* <div>
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
                </div> */}
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