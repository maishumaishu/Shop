import { VirtualMobile } from "components/virtualMobile";
import { MobilePage } from 'components/mobilePage';
import { MobilePageDesigner } from "components/mobilePageDesigner";
import { StationService as UserStation } from 'user/services/stationService';
import { StationService as AdminStation, guid } from 'admin/services/station';

export default function (page: chitu.Page) {
    class ProductEditPage extends React.Component<any, any> {
        render() {
            let pageData: PageData = {
                name: '*product',
                view: {
                    controls: [
                        { controlName: 'carousel', controlId: guid() }
                    ]
                },
                footer: {
                    controls: [
                        { controlName: 'shoppingCartBar', controlId: guid() }
                    ]
                }
            }

            let adminStation = page.createService(AdminStation);
            let userStation = page.createService(UserStation);
            return (
                <MobilePageDesigner pageData={pageData}
                    save={(pageData) => adminStation.savePageData(pageData, true)}
                    pageDatas={userStation.pages}
                    showComponentPanel={true} />
            );
        }
    }

    ReactDOM.render(<ProductEditPage />, page.element);
}