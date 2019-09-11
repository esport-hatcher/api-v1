export interface IUserProps {
    // tslint:disable-next-line:no-any
    username: string;
    password: string;
    email: string;
    avatarUrl: string;
    superAdmin: boolean;
    hashtag?: string;
    country?: string;
    city?: string;
    phoneNumber?: string;
}
