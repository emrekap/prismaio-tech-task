import { LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { getUserById } from "~/utils/users.server";

const schema = z.object({
  userId: z.string().uuid(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return Response.json(
      {
        message: parsed.error.format(),
      },
      { status: 400 }
    );
  }
  return Response.json(await getUserById(parsed.data.userId));
}
