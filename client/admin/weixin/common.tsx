export let socket_url = 'http://maishu.alinq.cn:8015';

export function loadjs<T>(url) {
    return new Promise<T>((resolve, reject) => {
        requirejs([url],
            function (obj: T) {
                resolve(obj);
            },
            function (err) {
                reject(err);
            }
        )
    })
}

export function getOpenId(code: string) {

}