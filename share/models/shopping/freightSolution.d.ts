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
