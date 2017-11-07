interface Category {
    Id: string, Name: string, ParentId?: string,
    SortNumber?: number, Remark?: string, Hidden?: boolean,
    ImagePath?: string
}

type PromotionType = 'Given' | 'Reduce' | 'Discount';
type PromotionMethod = 'Count' | 'Amount';
interface Promotion {
    Id: string,
    Type: PromotionType,
    Method: PromotionMethod,
    IsAll: boolean,
    CreateDateTime: Date,
    PromotionContentRules: PromotionContentRule[],
    PromotionRangeRules: PromotionRangeRule[]
}

interface PromotionContentRule {
    Id: string,
    LevelValue: number,
    // Type: string,
    // Method: string,
    Description?: string,
    // ObjectType: string,
    // ObjectId: string,
    // ObjectName: string,
    // CollectionType: string,
    GivenValue: string,
    // PromotionId: string,
    CreateDateTime: Date,
}

interface PromotionRangeRule {
    Id: string,
    ObjectType: string,
    ObjectId: string,
    ObjectName: string,
    CollectionType: 'Include' | 'Exclude'
    PromotionId?: string,
    CreateDateTime: Date
}

interface PromotionActivity {
    Id: string,
    Name: string,
    BeginDate: Date,
    EndDate: Date,
}

interface Order {
    Id: string,
    /** 订单日期 */
    OrderDate: Date,
    /** 付款人 */
    Consignee: string,
    /** 收货人地址 */
    ReceiptAddress: string,
    /** 状态 */
    Status: string,
    /** 状态文字 */
    StatusText: string,
    /** 序列号 */
    Serial: string,
    /** 运费 */
    Freight: number,
    /** 发票信息 */
    Invoice: string,
    /** 备注 */
    Remark: string,
    /** 合计金额 */
    Sum: number,
    OrderDetails: OrderDetail[]
}

interface OrderDetail {
    Id: string,
    ProductName: string,
    Price: number,
    Unit: string,
    Quantity: number
}

interface FreightSolution {
    Id: string,
    Name: string
}

interface ProductFreight {
    Id: string,
    Name: string,
    ObjectId: string,
    ObjectType: string,
    SolutionId: string,
    SolutionName: string
}

interface Coupon {
    Id: string,
    Title: string,
    Content: string,
    Discount: number,
    Amount: number,
    ValidBegin: Date,
    ValidEnd: Date,
    ProductIds?: string,
    CategoryIds?: string,
    BrandIds?: string
}

interface CouponCode {
    Title: string,
    Content: string,
    UsedDateTime: Date,
    ValidBegin: Date,
    ValidEnd: Date,
}

interface CityFreight {
    Id: string,
    /** 配送金额 */
    SendAmount: number,
    /** 运费 */
    Freight: number,
    /** 配送范围 */
    SendRadius: number,
}

interface Category {
    Id: string, Name: string, ParentId?: string,
    SortNumber?: number, Remark?: string, Hidden?: boolean,
    ImagePath?: string
}

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

interface CustomProperty {
    Name: string,
    Options: Array<{ Name: string, Selected: boolean, Value: string }>
}

interface Promotion {
    Type: 'Given' | 'Reduce' | 'Discount',
    Contents: {
        Id: string,
        Description: string
    }[],
}

interface RegionFreight {
    Id: string,
    FreeAmount: number,
    Freight: number,
    RegionId: string,
    RegionName: string,
    SolutionId: string
}