interface RegisterModel {
    username: string,
    password: string,
    smsId: string,
    verifyCode: string
}

type StyleColor = 'default' | 'red' | 'green' | 'pink' | 'goldenrod';

interface Store {
    Id: string,
    Name: string,
    Data: { ImageId?: string, Style?: StyleColor },
}

interface Seller {
    Id: string,
    UserName: string,
    OpenId: string,
    Mobile: string,
    Email: string,
}