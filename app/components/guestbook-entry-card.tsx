import { Form } from "@remix-run/react";
import { Entry } from "~/utils/guestbook-entry.server";
import { EditIcon } from "./icons/edit-icon";
import { DeleteIcon } from "./icons/delete-icon";

interface GuestbookEntryCardProps {
  entry: Entry;
}

export function GuestbookEntryCard({ entry }: GuestbookEntryCardProps) {
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
          <button name="intent" value="edit_comment" title="Edit Comment">
            <EditIcon className={"h-4 w-4"} />
          </button>
        </div>
        <blockquote className="leading-relaxed mb-6">
          {entry.content}
        </blockquote>
        <time className="flex text-xs justify-end text-gray-300">
          {new Date(entry.createdAt).toDateString()}
        </time>
      </div>
    </div>
  );
}
