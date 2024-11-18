import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { createUser, getUsers, User } from "~/utils/users.server";
import { UserRow } from "~/components/user-row";
import {
  CreateUserInputError,
  createUserSchema,
} from "~/utils/validation-schemas";
import { FormInputGroup } from "~/components/form-input-group";

export const meta: MetaFunction = () => {
  return [{ title: "Prisma IO Home Task" }];
};

const genderSelectValues = [
  { key: "Male", value: "male", selected: true },
  { key: "Female", value: "female" },
];

type UserActionData = {
  userId?: string;
  inputError?: CreateUserInputError;
  formError?: string;
};

export const loader: LoaderFunction = async () => {
  const users = await getUsers({
    sortFilter: { entries: { _count: "desc" } },
  });
  return Response.json({ users });
};
// https://loremflickr.com/320/320/girl
export const action: ActionFunction = async ({ request }) => {
  try {
    const form = Object.fromEntries(await request.formData());
    console.log("form:", form);
    console.log("createUserSchema: ", createUserSchema);
    const parsed = createUserSchema.safeParse(form);
    console.log("parsed: ", parsed);
    if (!parsed.success) {
      return Response.json(
        { inputError: parsed.error.format() },
        { status: 400 }
      );
    }

    console.log("parsed.data: ", parsed.data);
    const user = await createUser(parsed.data);

    return redirect(`/users/${user.id}`);
  } catch (e) {
    return Response.json(
      { formError: e instanceof Error ? e.message : "Unkown Error" },
      { status: 409 }
    );
  }
};

export default function Index() {
  const { users } = useLoaderData<{ users: User[] }>();
  const actionData = useActionData<UserActionData>();

  // const $form = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  // useEffect(() => {
  //   if (navigation.state === "idle" && actionData?.userId) {
  //     $form.current?.reset();
  //   }
  // }, [navigation.state, actionData]);

  return (
    <div className="flex h-screen items-center justify-center ">
      <div className="flex flex-col items-center min-w-96 gap-4">
        <header className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 w-full">
          <p className="flex leading-6 text-gray-700 dark:text-gray-200">
            Create New User
          </p>
          <Form
            className="flex-col w-full space-y-4 justify-between"
            method="POST"
            // ref={$form}
          >
            <FormInputGroup
              validationError={
                actionData &&
                actionData.inputError?.firstName &&
                actionData.inputError.firstName._errors[0]
              }
              id={"firstName"}
              name={"firstName"}
              labelText={"First Name"}
              type={"text"}
            />
            <FormInputGroup
              validationError={
                actionData &&
                actionData.inputError?.lastName &&
                actionData.inputError.lastName._errors[0]
              }
              id={"lastName"}
              name={"lastName"}
              labelText={"Last Name"}
              type={"text"}
            />
            <FormInputGroup
              validationError={
                actionData &&
                actionData.inputError?.email &&
                actionData.inputError.email._errors[0]
              }
              id={"email"}
              name={"email"}
              labelText={"Email"}
            />
            <FormInputGroup
              validationError={
                actionData &&
                actionData.inputError?.thumbnailUrl &&
                actionData.inputError.thumbnailUrl._errors[0]
              }
              id={"thumbnailUrl"}
              name={"thumbnailUrl"}
              labelText={"Avatar Url"}
            />
            <FormInputGroup
              validationError={
                actionData &&
                actionData.inputError?.thumbnailUrl &&
                actionData.inputError.thumbnailUrl._errors[0]
              }
              id={"gender"}
              name={"gender"}
              labelText={"Gender"}
              selectValues={genderSelectValues}
            />

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {navigation.state === "idle" ? "Create User" : "Loading.."}
            </button>
            <p className="text-red-500">{actionData?.formError}</p>
          </Form>
        </header>
        <div className="flex-col max-h-[400px] w-full overflow-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              All Users
            </h5>
            <h1>Entries</h1>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user, idx) => (
                <a key={`a-${idx}`} href={`/users/${user.id}`}>
                  <UserRow
                    key={`user-row-${user.id}`}
                    id={user.id}
                    fullName={`${user.firstName} ${user.lastName}`}
                    email={user.email}
                    entryCount={user.entryCount}
                    thumbnailUrl={
                      user.thumbnailUrl || "put a default image link"
                    }
                  />
                </a>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
