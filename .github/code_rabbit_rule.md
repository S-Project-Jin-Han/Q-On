# 🤖 Frontend Team AI/CodeRabbit Guidelines

## 📌 Overview

This document provides AI and CodeRabbit review guidelines for maintaining consistent code quality and conventions across our 4-member frontend team.

---

## 🏗️ Architecture and Directory Structure

### Required Directory Structure (Next.js App Router)

```bash
src/
├── app/
│   ├── (auth)/        # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── api/           # API Routes
│   │   └── [feature]/
│   │       └── route.ts
│   ├── [feature]/     # Dynamic routes
│   ├── globals.css
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── features/[feature-name]/
│   ├── components/    # Feature-specific UI components
│   ├── api/          # Client-side API (endpoints.ts, types.ts, [feature]Api.ts, mockData.ts)
│   ├── hooks/        # useQuery, useMutation hooks
│   ├── store/        # Zustand state (feature-level)
│   └── [feature].types.ts
├── shared/
│   ├── components/   # Common UI (Atomic Design)
│   ├── hooks/        # Common hooks
│   ├── store/        # Global state
│   ├── lib/          # axios client, query configuration
│   ├── constants/
│   ├── types/
│   ├── styles/
│   ├── api/          # Common API client
│   └── msw/handlers/ # MSW handlers
├── public/           # Static assets
└── tests/
```

### Verification Points

- [ ] Feature folders follow `features/[feature-name]/` structure?
- [ ] Common components are located in `shared/components/`?
- [ ] API routes are in `src/app/api/` directory?
- [ ] Pages are in `src/app/` directory following App Router structure?
- [ ] Client-side API files are in correct feature directories?

---

## 📝 Naming Conventions

### File Names

| Type             | Rule       | Example                                 | Checkpoint                             |
| ---------------- | ---------- | --------------------------------------- | -------------------------------------- |
| Components/Pages | PascalCase | `LoginPage.tsx`, `UserCard.tsx`         | First letter uppercase, clear meaning  |
| Next.js Pages    | lowercase  | `page.tsx`, `layout.tsx`, `loading.tsx` | Next.js reserved names                 |
| API Routes       | lowercase  | `route.ts`                              | Next.js API route file                 |
| Hooks/Utils/API  | camelCase  | `useUserQuery.ts`, `formatDate.ts`      | Lowercase start, verb+noun combination |
| Images/Assets    | kebab-case | `user-avatar.png`, `logo-icon.svg`      | Hyphen connection, lowercase           |
| Folders          | kebab-case | `user-profile`, `search-input`          | Hyphen connection, lowercase           |

### Function Names

| Type              | Pattern                     | Example                                | Must Check           |
| ----------------- | --------------------------- | -------------------------------------- | -------------------- |
| Event Handlers    | `handle` + Action           | `handleLoginClick`, `handleFormSubmit` | Starts with handle?  |
| General Functions | Verb start                  | `calculateAverage`, `validateEmail`    | Starts with verb?    |
| HTTP Methods      | HTTP verb                   | `getUserInfo`, `postLoginData`         | HTTP method clear?   |
| Custom Hooks      | `use` + Domain              | `useAuth`, `useUserQuery`              | Starts with use?     |
| Query Hooks       | `use` + Domain + `Query`    | `useUserStatusQuery`                   | Has Query suffix?    |
| Mutation Hooks    | `use` + Domain + `Mutation` | `useLoginMutation`                     | Has Mutation suffix? |

### Variable Names

| Type         | Pattern             | Example                           | Checkpoint            |
| ------------ | ------------------- | --------------------------------- | --------------------- |
| Boolean      | `is/has/can` + Noun | `isModalOpen`, `hasPermission`    | Boolean prefix used?  |
| Arrays/Lists | Plural or `List`    | `users`, `userList`               | Plural expression?    |
| Constants    | UPPER_SNAKE_CASE    | `API_BASE_URL`, `MAX_RETRY_COUNT` | Uppercase+underscore? |

---

## 🧹 Code Writing Style

### Component Internal Order (Required)

```typescript
const ExampleComponent = () => {
  // 1. React hooks (useState, useQuery, useStore, etc.)
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const [isLoading, setIsLoading] = useState(false);

  // 2. General variable declarations
  const isFormValid = email !== '' && password !== '';

  // 3. useEffect declarations
  useEffect(() => {
    // logic
  }, [dependency]);

  // 4. Function declarations
  const handleSubmit = () => {
    // logic
  };

  // 5. return statement (must have blank line before return)

  return <div>...</div>;
};
```

### Depth Limitation and Conditional Rules

```typescript
// ❌ 3+ level nesting prohibited
if (condition1) {
  if (condition2) {
    if (condition3) {
      // Not allowed
      // code
    }
  }
}

// ✅ Simplify with condition combination
if (condition1 && condition2 && condition3) {
  // code
}

// ❌ Unnecessary else usage
if (condition) {
  return true;
} else {
  return false;
}

// ✅ Remove else
if (condition) {
  return true;
}
return false;
```

### Ternary Operator Rules

```typescript
// ✅ Simple ternary operator
const result = isEven ? 'Even' : 'Odd';

// ❌ Nested ternary operators prohibited
const result = isEven ? (count >= 10 ? 'Even 10+' : 'Even <10') : 'Odd';
```

---

## 📚 JSDoc Documentation Guidelines (Required for Components & API Routes)

### API Route Handler JSDoc Template (Required)

````typescript
/**
 * Handles user authentication
 * @param request - Next.js request object
 * @returns Response with user data or error
 * @throws {Error} - Authentication failed
 * @example
 * ```
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Response: { user: User, token: string }
 * ```
 */
export async function POST(request: Request) {
  // implementation
}
````

### Function JSDoc Template

````typescript
/**
 * Handles user login authentication
 * @param credentials - User login credentials
 * @param credentials.email - User email address
 * @param credentials.password - User password
 * @returns Promise<User> - Authenticated user information
 * @throws {AuthError} - Thrown when authentication fails
 * @example
 * ```typescript
 * const user = await loginUser({ email: 'test@test.com', password: '123' });
 * ```
 */
const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // implementation
};
````

### Component JSDoc Template (Required)

````typescript
/**
 * User profile card component
 * @param props - Component props
 * @param props.user - User information to display
 * @param props.onClick - Function to execute on card click
 * @param props.className - Additional CSS class name
 * @returns JSX.Element
 * @example
 * ```tsx
 * <UserCard
 *   user={userData}
 *   onClick={() => navigate('/profile')}
 *   className="mb-4"
 * />
 * ```
 */
interface UserCardProps {
  user: User;
  onClick?: () => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => {
  // implementation
};
````

### Page Component JSDoc Template (Required)

````typescript
/**
 * User profile page
 * @param params - Route parameters
 * @param params.userId - User ID from URL
 * @param searchParams - URL search parameters
 * @returns JSX.Element
 * @example
 * ```
 * URL: /user/123?tab=settings
 * params: { userId: '123' }
 * searchParams: { tab: 'settings' }
 * ```
 */
interface UserPageProps {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function UserPage({ params, searchParams }: UserPageProps) {
  // implementation
}
````

### Hook JSDoc Template

````typescript
/**
 * Custom hook for managing user authentication state
 * @returns Authentication-related state and functions
 * @returns returns.user - Current authenticated user information
 * @returns returns.isAuthenticated - Authentication status
 * @returns returns.login - Login function
 * @returns returns.logout - Logout function
 * @example
 * ```typescript
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
const useAuth = () => {
  // implementation
};
````

---

## 🌿 Git 컨벤션

### 브랜치 네이밍

```bash
# 패턴: [유형]/[#이슈번호]-[간단한-설명]
feature/#13-user-login-form
fix/#14-button-styling-issue
refactor/#15-api-layer-cleanup
chore/#16-eslint-setup
```

### 커밋 메시지

```bash
# 패턴: [#이슈번호] [유형]: [설명]
#13 feat: 사용자 로그인 폼 구현
#14 fix: 버튼 스타일링 이슈 수정
#15 refactor: API 레이어 구조 개선
#16 chore: ESLint 설정 추가
```

---

## 🧪 MSW 및 API 개발

### API 파일 구조 검증

```typescript
// features/[기능명]/api/ 내부 필수 파일들
├── endpoints.ts    // API 경로 상수
├── types.ts       // 응답/요청 타입
├── [기능명]Api.ts  // 실제 API 함수
└── mockData.ts    // MSW 목업 데이터
```

### MSW 핸들러 작성 규칙

```typescript
// shared/msw/handlers/[기능명].ts
export const userHandlers = [
  // ✅ 성공 케이스
  http.get('*/api/user/profile', () => {
    return HttpResponse.json({
      status: 200,
      message: '성공',
      data: MOCK_USER_PROFILE,
      timestamp: new Date().toISOString(),
    });
  }),

  // ✅ 에러 케이스도 반드시 포함
  http.get('*/api/user/invalid', () => {
    return HttpResponse.json(
      {
        status: 404,
        message: '사용자를 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }),
];
```

---

## 🧩 코드 리뷰 PNL 원칙

### Praise (칭찬) - 필수 포함

- 잘한 점, 인상 깊은 부분 언급
- 예: "함수 분리가 깔끔해서 로직 파악이 쉬워졌어요!"

### Need (개선점) - 구체적 제안

- 명확한 이유와 함께 개선점 제시
- 예: "삼항연산자가 복잡해 보이니 if-else로 가독성을 높이면 어떨까요?"

### Learn (배움) - 지식 공유

- 새로 배운 점이나 유용한 패턴 공유
- 예: "이 React Query 패턴은 처음 봤는데 좋은 참고가 됐어요!"

---

## ✅ CodeRabbit 리뷰 체크리스트

### 파일 구조 검증

- [ ] 기능별 폴더 구조가 올바른가?
- [ ] 파일명이 컨벤션을 따르는가?
- [ ] Barrel export가 적절히 사용되었는가?

### Code Quality Verification

- [ ] JSDoc documentation is provided for ALL components and API routes (required)
- [ ] Page components have proper JSDoc with params and searchParams documentation
- [ ] API route handlers have proper JSDoc with request/response documentation
- [ ] Naming conventions are followed consistently
- [ ] Depth limitation (max 2 levels) is maintained
- [ ] TypeScript types are properly defined

### API 및 상태 관리

- [ ] MSW 핸들러에 성공/실패 케이스가 모두 포함되었는가?
- [ ] API 응답 구조가 실제 명세와 일치하는가?
- [ ] React Query 훅이 올바르게 분리되었는가?
- [ ] Zustand 상태가 전역 UI 제어에만 사용되었는가?

### Git 및 브랜치

- [ ] 브랜치명에 JIRA 키가 포함되었는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?
- [ ] PR 제목이 명확하고 이해하기 쉬운가?

---

## 🚨 Auto-Block Rules

The following issues **MUST be flagged for correction**:

1. **Incorrect File Structure** - Not following Next.js App Router or features/shared directory structure
2. **Missing JSDoc** - Components or API routes without proper JSDoc documentation
3. **3+ Level Nesting** - Conditional/loop depth exceeding 2 levels
4. **Wrong File Location** - Files not placed in appropriate app/, features/, or shared directories
5. **Naming Convention Violations** - Not following handle*, use*, is\* patterns or Next.js conventions
6. **Missing MSW Error Cases** - Handlers with only success scenarios
7. **Missing JIRA Keys** - Branch names and commits without JIRA issue keys
8. **Incorrect API Route Structure** - API routes not following `/api/[feature]/route.ts` pattern

**Note**: JSDoc is now mandatory for all components and API routes. Code reviews must verify proper documentation exists.
