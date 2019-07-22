export default interface IUser {
    // tslint:disable-next-line:no-any
    id?: number;
    username: string;
    email: string;
    avatarUrl: string;
    password: string;
    superAdmin: boolean;
}
