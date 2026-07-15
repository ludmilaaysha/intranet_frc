import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

type UserRole = 'Admininstrador' | 'Cliente';

export interface User {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: UserRole;
  isFullTime: boolean;
}

const INITIAL_USERS_STORE: User[] = [
  {
    id: 1,
    name: 'Edward Perry',
    age: 25,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Admininstrador',
    isFullTime: true,
  },
  {
    id: 2,
    name: 'Josephine Drake',
    age: 36,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Cliente',
    isFullTime: false,
  },
  {
    id: 3,
    name: 'Cody Phillips',
    age: 19,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Cliente',
    isFullTime: true,
  },
];

export function getUsersStore(): User[] {
  const stringifiedUsers = localStorage.getItem('users-store');
  return stringifiedUsers ? JSON.parse(stringifiedUsers) : INITIAL_USERS_STORE;
}

export function setUsersStore(users: User[]) {
  return localStorage.setItem('users-store', JSON.stringify(users));
}

export async function getMany({
  paginationModel,
  filterModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: User[]; itemCount: number }> {
  const usersStore = getUsersStore();

  let filteredUsers = [...usersStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredUsers = filteredUsers.filter((user) => {
        const userValue = user[field as keyof User];

        switch (operator) {
          case 'contains':
            return String(userValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return userValue === value;
          case 'startsWith':
            return String(userValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(userValue).toLowerCase().endsWith(String(value).toLowerCase());
          case '>':
            return userValue > value;
          case '<':
            return userValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredUsers.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field as keyof User] < b[field as keyof User]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field as keyof User] > b[field as keyof User]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedUsers = filteredUsers.slice(start, end);

  return {
    items: paginatedUsers,
    itemCount: filteredUsers.length,
  };
}

export async function getOne(userId: number) {
  const usersStore = getUsersStore();

  const userToShow = usersStore.find((User) => User.id === userId);

  if (!userToShow) {
    throw new Error('User not found');
  }
  return userToShow;
}

export async function createOne(data: Omit<User, 'id'>) {
  const usersStore = getUsersStore();

  const newUser = {
    id: usersStore.reduce((max, user) => Math.max(max, user.id), 0) + 1,
    ...data,
  };

  setUsersStore([...usersStore, newUser]);

  return newUser;
}

export async function updateOne(userId: number, data: Partial<Omit<User, 'id'>>) {
  const usersStore = getUsersStore();

  let updatedUser: User | null = null;

  setUsersStore(
    usersStore.map((user) => {
      if (user.id === userId) {
        updatedUser = { ...user, ...data };
        return updatedUser;
      }
      return user;
    }),
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
}

export async function deleteOne(userId: number) {
  const usersStore = getUsersStore();

  setUsersStore(usersStore.filter((user) => user.id !== userId));
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

type ValidationResult = { issues: { message: string; path: (keyof User)[] }[] };

export function validate(user: Partial<User>): ValidationResult {
  let issues: ValidationResult['issues'] = [];

  if (!user.name) {
    issues = [...issues, { message: 'Name is required', path: ['name'] }];
  }

  if (!user.age) {
    issues = [...issues, { message: 'Age is required', path: ['age'] }];
  } else if (user.age < 18) {
    issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
  }

  if (!user.joinDate) {
    issues = [...issues, { message: 'Join date is required', path: ['joinDate'] }];
  }

  if (!user.role) {
    issues = [...issues, { message: 'Role is required', path: ['role'] }];
  } else if (!['Market', 'Finance', 'Development'].includes(user.role)) {
    issues = [
      ...issues,
      { message: 'Role must be "Market", "Finance" or "Development"', path: ['role'] },
    ];
  }

  return { issues };
}