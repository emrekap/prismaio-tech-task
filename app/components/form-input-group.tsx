import React, { HTMLInputTypeAttribute } from "react";

interface InputGroupProps {
  id: string;
  name: string;
  labelText?: string;
  type?: HTMLInputTypeAttribute;
  validationError?: string;
  selectValues?: { key: string; value: string | number; selected?: boolean }[];
  defaultValue?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
}

export function FormInputGroup({
  id,
  labelText,
  name,
  type = "text",
  validationError,
  selectValues,
  defaultValue,
  onChange,
}: InputGroupProps) {
  return (
    <div>
      {labelText && (
        <label
          htmlFor={id}
          className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
        >
          {labelText}
        </label>
      )}

      <>
        {selectValues ? (
          <select
            id={id}
            name={name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={selectValues.findIndex((s) => s.selected)}
          >
            {selectValues.map(({ key, value }) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            id={id}
            className="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            defaultValue={defaultValue}
            onChange={onChange}
          />
        )}
      </>

      {validationError && (
        <p className="text-red-500 text-xs">{validationError}</p>
      )}
    </div>
  );
}
