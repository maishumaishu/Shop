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