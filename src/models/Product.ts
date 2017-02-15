class Product {
    Id = ko.observable()
    Name = ko.observable();
    Unit = ko.observable();
    OldPrice = ko.observable();
    Price = ko.observable();
    CostPrice = ko.observable();
    Introduce = ko.observable<string>();
    ImagePaths = ko.observableArray([]);
    Score = ko.observable();

    ImagePath = ko.pureComputed<string>({
        read: function () {
            return this.ImagePaths().join(',');
        },
        write: function (value) {
            if (value)
                this.ImagePaths(value.split(','));
            else
                this.ImagePaths([]);
        }
    }, this);

    BrandId = ko.observable();
    ProductCategoryId = ko.observable();
    OffShelve = ko.observable();
    OnShelve = ko.computed(function () {
        var offShelve = this.OffShelve();
        if (offShelve == null)
            offShelve = false;

        return !offShelve;
    }, this);
    SKU = ko.observable();
    Commission = ko.observable();
    DisplayCommission = ko.computed({
        read: function () {
            var c = ko.unwrap(this.Commission);
            if (c == null)
                return null;

            return (c * 100).toFixed(0);
        },
        write: function (value) {
            if (value == null)
                return;
            this.Commission(new Number(value).valueOf() / 100);
        }
    }, this);

    // Group = {
    //     Id: ko.observable(),
    //     Name: ko.observable(),
    //     ProductPropertyDefeineId: ko.observable(),
    //     ProductArgumentId: ko.observable()
    // };

    Stock = ko.observable();
    BuyLimitedNumber = ko.observable();
    MemberPrice = ko.observable();
    Discout = ko.observable();

    CategoryName = ko.observable();
    PropertyDefineId = ko.observable();

    // Arguments:{ key:string,value:string }[] = [];
    // Fields: { key:string,value:string }[] = [];
    Arguments = ko.observableArray<{ key: string, value: string }>();
    Fields = ko.observableArray<{ key: string, value: string }>();

    constructor() {
        this.Name.extend({ required: true });
        this.Price.extend({ required: true });
        this.Unit.extend({ required: true });
        this.Introduce.extend({ required: true });
    }
}


export = Product;