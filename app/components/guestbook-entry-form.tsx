import { PrimaryButton } from "./primary-button";

interface EntryFormProps {
  id: string;
  name: string;
  labelText?: string;
  validationError?: string;
  defaultValue?: string;
  navigationState: "idle" | "loading" | "submitting";
  rows?: number;
  onSubmit?(): void;
  intent: "create_comment" | "update_comment";
}

// eslint-disable-next-line react/display-name
export function GuestBookEntryFormGroup({
  id,
  name,
  labelText,
  defaultValue,
  navigationState,
  validationError,
  intent,
  rows = 6,
}: EntryFormProps) {
  return (
    <div className="p-5 border rounded text-center bg-gray-700 text-gray-500 min-w-sm">
      <div>
        {labelText && (
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {labelText}
          </label>
        )}

        <textarea
          id={id}
          rows={rows}
          name={name}
          className="block p-2.5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts..."
          defaultValue={defaultValue}
        ></textarea>
        <PrimaryButton name="intent" value={intent} className="mt-2">
          {navigationState === "idle" ? "Comment" : "Loading.."}
        </PrimaryButton>
      </div>
      {validationError && (
        <p className="text-red-500 text-xs">{validationError}</p>
      )}
    </div>
  );
}
