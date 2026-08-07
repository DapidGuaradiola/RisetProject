export default async function Users(){
    type usersType = {
        user_id : number,
        username: string,
        nickname: string,
      };
      const data = await fetch("http://backend:3000/users");
      const users: usersType[] = await data.json();
      return (
        <>
          <table className="border-collapse border border-spacing-2 table-fixed my-auto mx-4">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>NickName </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td className="border-collapse border-gray-400 px-4 py-2">{u.user_id}</td>
                  <td className="border-collapse border-gray-400 px-4 py-2">{u.username}</td>
                  <td className="border-collapse border-gray-400 px-4 py-2">{u.nickname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
}