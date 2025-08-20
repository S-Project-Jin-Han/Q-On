'use client';

import { useUser } from '@/shared/provider/UserProvider';

export default function Home() {
  const user = useUser();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>{user.email || 'Guest'}</h1>
        <h1>{user.name || 'Guest'}</h1>
        <h1>{user.avatarUrl || 'Guest'}</h1>
        <h1>{user.isLoggedIn ? 'Logged In' : 'Logged Out'}</h1>
        <h1>{user.isOnboarding ? 'Onboarding' : 'Not Onboarding'}</h1>
        <h1>{user.role || 'undefined'}</h1>
        <h1>{user.createdAt || 'Guest'}</h1>
      </main>
    </div>
  );
}
