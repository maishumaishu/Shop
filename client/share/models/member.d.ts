interface RegisterModel {
    username: string, 
    password: string,
    smsId: string,
    verifyCode: string
}

interface Store {
    Id: string,
    Name: string,
    Data: { ImageId: string },
}

interface Seller {
    Id: string,
    UserName: string,
    OpenId: string,
    Mobile: string,
    Email: string,
}