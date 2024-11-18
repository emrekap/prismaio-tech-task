import { getUsers } from "~/utils/users.server";

export async function loader() {
  const users = await getUsers({
    sortFilter: { entries: { _count: "desc" } },
  });
  return Response.json(users);
}
