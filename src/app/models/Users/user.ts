export interface Role {
  id: number;
  name: string;
  disabled: boolean;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface UserFullData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalCode: string;
  createdAt: string;
  roles: Role[];
  permissions: Permission[];
}

export interface UserInfo {
  userId: number;
  firstName: string;
  lastName: string;
}

export interface User {

  id: number;

  firstName: string;

  lastName: string;

  phone: string;

  email: string;

  disabled: boolean;

  nationalCode: string | null;

  createdAt: string;
}
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  email?: string;
  meliCode?: string;
}

export interface UpdateUserRequest {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  meliCode?: string;
}
