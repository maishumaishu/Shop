interface Product {
    Id: string;
    BuyLimitedNumber: number;
    // ChildrenCount: number;
    Name: string;
    Unit: string;
    OffShelve: boolean;
    MemberPrice: number;
    Price: number;
    CostPrice: string;
    Introduce: string;
    ImagePath: string;
    ImagePaths: string[];
    ImageCover: string;
    Score: number;
    ProductCategoryId: string,
    BrandId: string,
    SKU: string,
    Stock: number;
    ParentId: string,
    Fields: { key: string, value: string }[],
    Arguments: { key: string, value: string }[],
    Title: string,
    CustomProperties: Array<CustomProperty>,
    Promotions: Promotion[],
    GroupId: string,
    ProductCategoryName: string,
}