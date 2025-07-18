type User = {
  id: number
  username: string
  email: string
  userType: string
}

async function getUsers() {
  // You can use a direct fetch call here
  const res = await fetch('http://localhost:8080/api/users'); // Disable cache for dev

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data;
}

export default async function Home() {
  const users = await getUsers();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-[32px] row-start-2 sm:items-start">
        <h1>Hello!</h1>
        <h1>User List (from Server Component)</h1>
        <ul>
          {users.map((user: User) => (
            <li key={user.id}>{["SUPERADMIN", "ADMIN"].includes(user.userType) ? "🛡️" : "👤"} {user.username} - {user.email} </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
