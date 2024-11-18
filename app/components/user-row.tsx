interface UserRowProps {
  id: string;
  fullName: string;
  email: string;
  entryCount: number;
  thumbnailUrl: string;
}

export function UserRow({
  email,
  entryCount,
  fullName,
  thumbnailUrl,
}: UserRowProps) {
  return (
    <li className="py-3 sm:py-4 hover:cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full"
            src={thumbnailUrl}
            alt={fullName}
          />
        </div>
        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {fullName}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {email}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {entryCount}
        </div>
      </div>
    </li>
  );
}
