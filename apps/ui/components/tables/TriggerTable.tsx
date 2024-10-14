"use client";
import React, { useEffect, useState } from "react";
import { TriggerRepository } from "@/repositories/TriggerRepository";
import type { Trigger } from "@/repositories/TriggerRepository";

interface TriggersTableProps {}

const TruncatedText: React.FC<{ text: string }> = ({ text }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  // Length of characters to show before truncating
  const characterLimit = 100;

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div>
      <pre className="whitespace-pre-wrap break-words text-sm/5">
        {isTruncated ? `${text.slice(0, characterLimit)}...` : text}
      </pre>
      <button
        onClick={toggleTruncate}
        className="text-blue-600 hover:underline"
      >
        {isTruncated ? "Show more" : "Show less"}
      </button>
    </div>
  );
};

export const TriggersTable: React.FC<TriggersTableProps> = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const triggerRepository = new TriggerRepository();

  useEffect(() => {
    const fetchTriggers = async () => {
      try {
        const data = await triggerRepository.getTriggers();
        setTriggers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch triggers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTriggers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white">
      <thead className="text-zinc-500 dark:text-zinc-400">
        <tr>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Trigger Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Function Name
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Trigger Type
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Event
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Level
          </th>
          <th className="border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10 sm:first:pl-1 sm:last:pr-1">
            Function Definition
          </th>
        </tr>
      </thead>
      <tbody>
        {triggers.map((row, index) => (
          <tr key={`row-${index}`}>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.triggername}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.functionname}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.triggertype}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.event.filter((e) => e !== null).join(", ")}
            </td>
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              {row.level}
            </td>
            {/* <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              <pre className="whitespace-pre-wrap break-words overflow-hidden text-sm/5">
                {row.functionDefinition}
              </pre>
            </td> */}
            <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
              <TruncatedText text={row.functiondefinition} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TriggersTable;
