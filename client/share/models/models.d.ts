interface Brand {
    Id: string;
    Name: string;
    Image?: string;
}






interface ProductCategory {
    Id: string, Name: string, ImagePath: string
}

interface Coupon {
    Id: string,
    Amount: number,
    Discount: number,
    Remark: string,
    Title: string,
    ValidBegin: Date,
    ValidEnd: Date,
}
interface CouponCode {
    Id: string,
    Amount: number,
    Code: string,
    Discount: number,
    CouponId: string,
    Remark: string,
    ReceiveBegin: Date,
    ReceiveEnd: Date,
    Title: string,
    ValidBegin: Date,
    ValidEnd: Date,
    UsedDateTime: Date,
    CreateDateTime: Date,
}
interface ReceiptInfo {
    Address: string,
    CityId: string,
    CityName: string,
    Consignee: string,
    CountyId: string,
    CountyName: string,
    FullAddress: string,
    Id: string,
    IsDefault: boolean,
    Mobile: string,
    Name: string,
    Phone: string,
    PostalCode: string,
    ProvinceId: string,
    ProvinceName: string,
    RegionId: string
}
// export interface Product {
//     Id: string, Arguments: Array<{ key: string, value: string }>,
//     BrandId: string, BrandName: string, Price: number,
//     Score: number, Unit: string, MemberPrice: number,
//     Fields: Array<{ key: string, value: string }>,
//     GroupId: string, ImagePath: string, ImagePaths: Array<string>,
//     ProductCategoryId: string, Name: string, //IsFavored?: boolean,
//     ProductCategoryName: string,
//     CustomProperties: Array<CustomProperty>,
//     Promotions: Promotion[],
//     Title: string,
// }
// export interface CustomProperty {
//     Name: string,
//     Options: Array<{ Name: string, Selected: boolean, Value: string }>
// }
// export interface Promotion {
//     Type: 'Given' | 'Reduce' | 'Discount',
//     Contents: {
//         Id: string,
//         Description: string
//     }[],
// }
interface ProductCategory {
    Id: string, Name: string, ImagePath: string
}
interface ProductComent {
    Id: string,
    Name: string,
    ImageUrl: string,
    Status: 'Evaluated' | 'ToEvaluate',
    OrderDetailId: string,
}
interface FavorProduct {
    Id: string;
    ProductId: string,
    ProductName: string,
    ImageUrl: string
}
interface Order {
    Id: string,
    Amount: number,
    CouponTitle: string,
    Discount: number,
    Freight: number,
    Invoice: string,
    OrderDate: Date,
    OrderDetails: OrderDetail[],
    ReceiptAddress: string,
    Remark: string,
    Serial: string,
    Status: string,
    // StatusText: string,
    Sum: number,
}
interface OrderDetail {
    // Id: string,
    ImageUrl: string,
    ProductId: string,
    ProductName: string,
    Price: number,
    Quantity: number,
    Score: number
}
interface Region {
    Id: string,
    Name: string
}

interface ShoppingCartItem {
    Id: string,
    Amount: number,
    Count: number,
    ImagePath: string,
    IsGiven?: boolean,
    Name: string,
    ProductId: string,
    Remark?: string,
    Score?: number,
    Selected: boolean,
    Unit?: number,
    Price: number,
    Type?: 'Reduce' | 'Discount'
}

interface Province {
    Id: string,
    Name: string
    Cities: Array<Citie>
}
interface Citie {
    Id: string,
    Name: string,
}



interface UserInfo {
    Id: string;
    NickName: string;

    County: string;
    Province: string;
    City: string;
    CountyId: string;
    ProvinceId: string,
    CityId: string,

    HeadImageUrl: string;
    Gender: string;
    // UserId: string;
    CreateDateTime: string;
    Mobile: string,
    Balance: number,
}

interface User {
    _id: string,
    mobile: string
}


interface RegisterModel {
    user: { mobile: string, password: string },
    smsId: string,
    verifyCode: string
}


interface ControlData {
    controlId: string, controlName: string, data?: any,
    selected?: boolean | 'disabled'
}

interface PageData {
    _id?: string,
    name?: string,
    remark?: string,
    // controls?: Array<ControlData>,
    isDefault?: boolean,
    showMenu?: boolean,
    className?: string,
    header?: { controls: ControlData[] },
    footer?: { controls: ControlData[] },
    views?: { controls: ControlData[] }[]
}

interface News {
    Id: string, Title: string, ImgUrl: string,
    Date: Date, Content: string
}

interface HomeProduct {
    Id: string, Name: string, ImagePath: string,
    ProductId: string, Price: number, PromotionLabel: string
}
