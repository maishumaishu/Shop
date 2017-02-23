
import app = require('Application');
import val = require('knockout.validation');
import shopping = require('services/Shopping');



export default function (page: chitu.Page) {

    var validation;
    var currentItem;

    var model = {
        regionFreight: {
            Id: ko.observable(),
            RegionId: ko.observable(),
            RegionName: ko.observable(),
            Freight: ko.observable().extend({ required: true }),
            FreeAmount: ko.observable()
        },
        freights: ko.observableArray(),
        freightEdit: function (item) {

        },
        back: function () {
            app.back().catch(function () {
                app.redirect('Freight/SolutionList')
            });
        },
        edit: function (item) {
            if (validation != null)
                validation.showAllMessages(false);

            model.regionFreight.Id(ko.unwrap(item.Id));
            model.regionFreight.RegionId(ko.unwrap(item.RegionId));
            model.regionFreight.RegionName(ko.unwrap(item.RegionName));
            model.regionFreight.Freight(ko.unwrap(item.Freight));
            model.regionFreight.FreeAmount(ko.unwrap(item.FreeAmount));
            (<any>$(page.element).find('[name="regionFreight"]')).modal();
            currentItem = item;
        },
        confirm: function () {
            validation = ko.validation.group(model.regionFreight);
            if (!(<any>model.regionFreight).isValid()) {
                validation.showAllMessages();
                return $.Deferred().reject();
            }

            var id = model.regionFreight.Id();
            var freight = model.regionFreight.Freight();
            var freeAmount = model.regionFreight.FreeAmount();
            return shopping.setRegionFreight(id, freight, freeAmount).done(function () {
                currentItem.Freight(freight);
                currentItem.FreeAmount(freeAmount);
                (<any>$(page.element).find('[name="regionFreight"]')).modal('hide');
            });
        }
    };


    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        ko.applyBindings(model, page.element);

        page_load(page, page.routeData.values);
    })

    function page_load(sender, args) {
        app.nav_bar.title(decodeURI(args.name));
        return shopping.getRegionFreights(args.id).then(function (items) {
            for (var i = 0; i < items.length; i++) {
                items[i] = ko.mapping.fromJS(items[i]);
            }
            model.freights(items);
        });
    };
}
