import { Form } from "@remix-run/react";
import { Entry } from "~/utils/guestbook-entry.server";
import { EditIcon } from "./icons/edit-icon";
import { DeleteIcon } from "./icons/delete-icon";
import { useRef, useState } from "react";

import { GuestBookEntryFormGroup } from "./guestbook-entry-form";

interface GuestbookEntryCardProps {
  entry: Entry;
  navigationState: "idle" | "loading" | "submitting";
  validationError?: string;
}

export function GuestbookEntryCard({
  entry,
  navigationState,
  validationError,
}: GuestbookEntryCardProps) {
  const [editMode, setEditMode] = useState(false);
  const commentFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex py-4 text-white min-w-80">
      <div className={"flex-col w-full bg-gray-500 px-4 py-6 rounded "}>
        <div className="flex text-xs justify-end">
          <Form method="POST">
            <div className="flex justify-between">
              <input type="hidden" name="entryId" value={entry.id} />
              <button
                name="intent"
                value="delete_comment"
                title="Delete Comment"
              >
                <DeleteIcon className={"h-4 w-4"} />
              </button>
            </div>
          </Form>
          <button
            name="intent"
            value="edit_comment"
            title="Edit Comment"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <EditIcon className={"h-4 w-4"} />
          </button>
        </div>
        {editMode ? (
          <>
            <Form
              method="POST"
              ref={commentFormRef}
              onSubmit={() => {
                setEditMode(false);
              }}
            >
              <input type="hidden" name="entryId" value={entry.id} />
              <GuestBookEntryFormGroup
                id={"comment"}
                name={"comment"}
                navigationState={navigationState}
                validationError={validationError}
                defaultValue={entry.content}
                intent="update_comment"
              />
            </Form>
          </>
        ) : (
          <>
            <blockquote className="leading-relaxed mb-6">
              {entry.content}
            </blockquote>
            <time className="flex text-xs justify-end text-gray-300">
              {new Date(entry.updatedAt).toDateString()}
            </time>
          </>
        )}
      </div>
    </div>
  );
}
