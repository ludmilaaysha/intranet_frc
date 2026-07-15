import { UserRole } from '../auth.types';
export declare class User {
    id: number;
    providerSubject: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
