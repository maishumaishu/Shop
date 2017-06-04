import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as station, PageData, ControlData } from 'services/Station';
import { default as MemberControl } from 'mobileComponents/member/control';

export default function (page: chitu.Page) {
    let pageData = {} as PageData;
    ReactDOM.render(
        <MobilePageDesigner >
            <MemberControl />
        </MobilePageDesigner>, page.element);
}
