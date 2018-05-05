declare interface jweixin {
    config(value);
    ready(callback: Function)
    error(callback: (res: { errMsg: string }) => void)
    onMenuShareTimeline(value)
    onMenuShareAppMessage(value)
    getLocation(args: {
        type: 'wgs84',
        success: (res: {
            latitude: number,
            longitude: number,
            speed: number,
            accuracy: number
        }) => void,
        fail(err)
    });
    chooseImage(args: {
        /** 图片数量，默认 9 */
        count?: number,
        /** 可以指定是原图还是压缩图，默认二者都有 */
        sizeType?: ('original' | 'compressed')[],
        /** 可以指定来源是相册还是相机，默认二者都有 */
        sourceType?: ('album' | 'camera')[],
        success?: (res: { localIds: string[] }) => void
    });
    getLocalImgData(args: {
        localId: string,
        success?: ((res: { localData }) => void)
    })

}



type SizeType = 'original' | 'compressed'

declare module "jweixin" {
    export = jweixin;
}