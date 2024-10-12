import React from "react";

interface TableRow {
  referenceTable: string;
  constraintName: string;
  referencingTable: string;
  referencingColumn: string;
}

interface ForeignKeyTableProps {
  data: TableRow[];
}

export const ForeignKeyTable: React.FC<ForeignKeyTableProps> = ({ data }) => {
  return (
    <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white">
      <thead className="text-zinc-500 dark:text-zinc-400">
        <tr>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Reference Table
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Constraint Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Referencing Table
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Referencing Column
          </th>
          <th className="relative w-0 border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            <span className="sr-only">Status</span>
          </th>
          <th className="relative w-0 border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={`row-${index}`}>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.referenceTable}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.constraintName}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.referencingTable}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.referencingColumn}
            </td>
            <td className="text-zinc-500 relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              <span className="inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300">
                Success
              </span>
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              <button
                aria-label="More options"
                type="button"
                className="relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5 shrink-0"
                >
                  <path d="M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"></path>
                </svg>
              </button>
            </td>
          </tr>
        ))}
        {/* Add more rows as needed */}
      </tbody>
    </table>

    // <div className="flex flex-col">
    //   <div className="overflow-x-auto">
    //     <div className="min-w-full py-2 align-middle inline-block">
    //       <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    //         <table className="min-w-full divide-y divide-gray-200">
    //           <thead className="bg-gray-50">
    //             <tr>
    //               <th
    //                 scope="col"
    //                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //               >
    //                 Users
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //               >
    //                 FK User ID
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //               >
    //                 Events Original
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //               >
    //                 User ID
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="bg-white divide-y divide-gray-200">
    //             {data.map((row, index) => (
    //               <tr key={index}>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    //                   {row.users}
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                   {row.fk_user_id}
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                   {row.events_original}
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                   {row.user_id}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ForeignKeyTable;
