export default interface IUser {
    id?: number;
    username: string;
    email: string;
    avatarUrl: string;
    password: string;
    superAdmin: boolean;
}
