import { getUsers } from "~/utils/users.server";

export async function loader() {
  // Get users with the most entries
  const users = await getUsers({
    sortFilter: { entries: { _count: "desc" } },
    limit: 1,
  });
  return Response.json(
    users.map((user) => ({
      userId: user.id,
      entryCount: user.entryCount,
    }))
  );
}
