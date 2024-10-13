"use client";
import React, { useEffect, useState } from "react";
import { IndexRepository } from "@/repositories/IndexRepository";
import type { Index } from "@/repositories/IndexRepository";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";

interface IndexTableProps {}

export const IndexesTable: React.FC<IndexTableProps> = () => {
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const indexRepository = new IndexRepository();

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const data = await indexRepository.getIndexes();
        setIndexes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch indexes.");
      } finally {
        setLoading(false);
      }
    };

    fetchIndexes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white">
      <thead className="text-zinc-500 dark:text-zinc-400">
        <tr>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Table Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Index Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Column Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Is Unique
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Is Primary
          </th>
        </tr>
      </thead>
      <tbody>
        {indexes.map((row, index) => (
          <tr key={`row-${index}`}>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.tablename}
            </td>

            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.indexname}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.columnname}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.isunique ? (
                <CheckCircleIcon className="h-6 w-6 dark:text-lime-300" />
              ) : (
                <XCircleIcon className="h-6 w-6 dark:text-red-400" />
              )}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.isprimary ? (
                <CheckCircleIcon className="h-6 w-6 dark:text-lime-300" />
              ) : (
                <XCircleIcon className="h-6 w-6 dark:text-red-400" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IndexesTable;
