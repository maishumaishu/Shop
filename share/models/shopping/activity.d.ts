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
    Type: string,
    Method: string,
    Description: string,
    ObjectType: string,
    ObjectId: string,
    ObjectName: string,
    CollectionType: string,
    PromotionId: string,
}

interface PromotionRangeRule {
    Id: string,
    ObjectType: string,
    ObjectId: string,
    ObjectName: string,
    CollectionType: string
    PromotionId: string,
}

