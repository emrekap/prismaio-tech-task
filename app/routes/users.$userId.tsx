/* eslint-disable no-case-declarations */
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import {
  deleteUser,
  getUserById,
  updateUser,
  UserWithEntries,
} from "~/utils/users.server";
import { GuestbookEntryCard } from "~/components/guestbook-entry-card";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  createGuestbookEntry,
  deleteEntry,
} from "~/utils/guestbook-entry.server";
import {
  CreateGuestBookInputError,
  createGuestBookSchema,
  UpdateUserInputError,
  updateUserSchema,
} from "~/utils/validation-schemas";
import { FormInputGroup } from "~/components/form-input-group";
import { PrimaryButton } from "~/components/primary-button";

export const meta: MetaFunction = () => {
  return [{ title: "User Detail Page" }];
};

type UserDetailActionData = {
  intent: "create_comment" | "edit_user" | "delete_comment" | "delete_user";
  ok: boolean;
  updateInputError?: UpdateUserInputError;
  createEntryInputError?: CreateGuestBookInputError;
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.userId) return redirect("/");
  const user = await getUserById(params.userId);
  if (!user) return redirect("/");

  return Response.json(user);
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.userId) return redirect("/");
  const { userId } = params;
  const formData = Object.fromEntries(await request.formData());
  console.log("formData: ", formData);
  const intent = formData.intent;
  switch (intent) {
    case "create_comment":
      const createEntryForm = createGuestBookSchema.safeParse(formData);
      if (!createEntryForm.success) {
        return Response.json(
          {
            createEntryInputError: createEntryForm.error.format(),
            ok: false,
            intent,
          },
          { status: 400 }
        );
      }
      await createGuestbookEntry(createEntryForm.data.comment, userId);
      return Response.json({ ok: true, intent }, { status: 200 });
    case "edit_user":
      const updateUserForm = updateUserSchema.safeParse(formData);
      console.log("updateUserForm: ", updateUserForm);
      if (!updateUserForm.success) {
        return Response.json(
          {
            updateInputError: updateUserForm.error.format(),
            ok: false,
            intent,
          },
          { status: 400 }
        );
      }
      await updateUser(userId, updateUserForm.data);
      return Response.json({ ok: true, intent }, { status: 200 });
    case "delete_comment":
      console.log("formData: ", formData);
      if (formData.entryId && typeof formData.entryId === "string") {
        await deleteEntry(formData.entryId);
        return redirect(`/users/${userId}`);
      }
      return Response.json({ ok: false, intent }, { status: 400 });
    case "delete_user":
      await deleteUser(userId);
      return Response.json({ ok: true, intent }, { status: 200 });
    default:
      throw new Error("Unexpected action");
  }
}

export default function UserDetailPage() {
  const userDetail = useLoaderData<UserWithEntries>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<UserDetailActionData>();
  const commentForm = useRef<HTMLFormElement>(null);
  const editUserForm = useRef<HTMLFormElement>(null);

  const [editMode, setEditMode] = useState(false);
  // When user enters a new thumbnail url, we update the UI, so they can preview their profile picture before editing
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(
    userDetail.thumbnailUrl
  );
  useEffect(() => {
    if (navigation.state === "idle" && actionData?.ok) {
      // sucessfull operation
      if (actionData.intent === "create_comment") {
        commentForm.current?.reset();
      } else if (actionData.intent === "edit_user") {
        setEditMode(false);
        editUserForm.current?.reset();
      }
    }
  }, [navigation.state, actionData]);

  const handleDeleteUserSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      confirm(
        "Are you sure you want to delete this profile? This action cannot be reverted!"
      )
    ) {
      const formData = new FormData(e.currentTarget);
      submit(formData, {
        method: "post",
      });
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center gap-4 min-w-[672px] max-w-2xl py-3">
        <header className="flex-col w-full border rounded text-center bg-gray-700 text-gray-500 py-2">
          <img
            className="w-32 h-32 rounded-full mx-auto"
            src={thumbnailPreviewUrl}
            alt=""
          />
          {editMode ? (
            <>
              <div className="flex text-sm mt-5 px-3">
                <Form
                  method="POST"
                  className="flex-col w-full"
                  ref={editUserForm}
                >
                  <FormInputGroup
                    validationError={
                      actionData &&
                      actionData.updateInputError?.firstName &&
                      actionData.updateInputError.firstName._errors[0]
                    }
                    id={"firstName"}
                    name={"firstName"}
                    labelText="First Name"
                    defaultValue={userDetail.firstName}
                  />
                  <FormInputGroup
                    validationError={
                      actionData &&
                      actionData.updateInputError?.lastName &&
                      actionData.updateInputError.lastName._errors[0]
                    }
                    id={"lastName"}
                    name={"lastName"}
                    labelText="Last Name"
                    defaultValue={userDetail.lastName}
                  />
                  <FormInputGroup
                    validationError={
                      actionData &&
                      actionData.updateInputError?.thumbnailUrl &&
                      actionData.updateInputError.thumbnailUrl._errors[0]
                    }
                    id={"thumbnailUrl"}
                    name={"thumbnailUrl"}
                    labelText={"Avatar Url"}
                    defaultValue={thumbnailPreviewUrl}
                    onChange={(e) => {
                      setThumbnailPreviewUrl(e.target.value);
                    }}
                  />
                  <div className="flex justify-end py-2">
                    <PrimaryButton name="intent" value="edit_user">
                      {navigation.state === "idle" ? "Update" : "Loading.."}
                    </PrimaryButton>
                  </div>
                </Form>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm mt-5">
                <h2 className="font-medium leading-none text-white hover:text-indigo-600 transition duration-500 ease-in-out">
                  {`${userDetail.firstName} ${userDetail.lastName}`}
                </h2>
                <p>{userDetail.email}</p>
              </div>
              <div className="flex justify-end p-3">
                <PrimaryButton onClick={() => setEditMode(true)}>
                  Edit
                </PrimaryButton>
                <Form onSubmit={handleDeleteUserSubmit}>
                  <input
                    type="hidden"
                    name="intent"
                    value="delete_user"
                  ></input>
                  <input
                    type="hidden"
                    name="userId"
                    value={userDetail.id}
                  ></input>
                  <PrimaryButton>Delete Profile</PrimaryButton>
                </Form>
              </div>
            </>
          )}
        </header>

        <section className="text-white body-font w-full">
          <div className="container py-10 mx-auto">
            <h1 className="text-3xl font-medium title-font  mb-12 text-center">
              Guest Book
            </h1>
            <div className="flex flex-wrap gap-2 justify-between ">
              {userDetail.entries.length === 0 ? (
                <h3>
                  No entry for found for
                  {` ${
                    userDetail.firstName
                  } :/ Wanna be the first one to make ${
                    userDetail.gender === "female" ? "her" : "him"
                  } happy!`}
                </h3>
              ) : (
                <>
                  {userDetail.entries.map((entry, idx) => (
                    <GuestbookEntryCard key={`entry-${idx}`} entry={entry} />
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
        <section className="flex-col w-full">
          <div className="p-5 border rounded text-center bg-gray-700 text-gray-500 min-w-sm">
            <Form method="POST" ref={commentForm}>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your message
              </label>
              <textarea
                id="comment"
                rows={6}
                name="comment"
                className="block p-2.5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your thoughts..."
              ></textarea>
              <PrimaryButton
                name="intent"
                value="create_comment"
                className="mt-2"
              >
                {navigation.state === "idle" ? "Comment" : "Loading.."}
              </PrimaryButton>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
}
