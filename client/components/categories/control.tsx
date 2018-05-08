import { componentsDir, Control } from 'components/common';
import { StationService } from 'user/services/stationService';
import { ShoppingService } from 'user/services/shoppingService';
import { imageUrl } from 'user/services/service'
import { Page } from 'user/application';

export interface State {
    showSecondLevel?: boolean,
    categories?: Category[],
    showIcons?: boolean,
}

export default class CategoriesControl extends Control<any, State> {
    constructor(props) {
        super(props);
        this.state = { showIcons: false };
        // this.loadControlCSS();

        let shopping = this.elementPage.createService(ShoppingService);
        (this.elementPage as Page).showLoading();
        shopping.categories().then(categories => {
            this.state.categories = categories;
            this.setState(this.state);
            (this.elementPage as Page).hideLoading();
        })
    }
    get persistentMembers(): (keyof State)[] {
        return ["showSecondLevel", "showIcons"];
    }
    _render() {
        var result = this.state.showIcons ?
            this.renderWithIcons() : this.renderWithoutIcons();

        return result;
    }

    renderWithIcons() {
        var categories = this.state.categories;
        return (
            <div className="categories-control">
                {categories ? categories.map(item => (
                    <a key={item.Id} href={`#home_productList?categoryId=${item.Id}`} className="col-xs-4">
                        <img src={imageUrl(item.ImagePath)} className="img-responsive"
                            ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                        <span className="mini interception">{item.Name}</span>
                    </a>
                )) : null}
            </div>
        );
    }
    renderWithoutIcons() {
        var categories = this.state.categories;
        return (
            <div className="categories-control">
                {categories ? categories.map(item => (
                    <div key={item.Id} className="col-xs-6">
                        <div className="well">
                            <a href={`#home_productList?categoryId=${item.Id}`}>
                                <span className="mini interception">{item.Name}</span>
                            </a>
                        </div>
                    </div>
                )) : null}
            </div>
        );
    }
}