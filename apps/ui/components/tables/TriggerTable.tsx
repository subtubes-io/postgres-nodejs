"use client";
import React, { useEffect, useState } from "react";
import { TriggerRepository } from "@/repositories/TriggerRepository";
import type { Trigger } from "@/repositories/TriggerRepository";
import { SettingsPanel } from "./SettingsPanel";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface TriggersTableProps {}

const TruncatedText: React.FC<{ text: string }> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control modal open/close

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <pre className="whitespace-pre-wrap break-words text-sm/5">
        {text.slice(0, 100)}...
      </pre>
      <button onClick={openModal} className="text-blue-600 hover:underline">
        Show more
      </button>

      {/* Modal Dialog */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Function Definition
                  </Dialog.Title>
                  <div className="mt-4">
                    <pre className="whitespace-pre-wrap break-words text-sm text-white">
                      {text}
                    </pre>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
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

  const handleFormSubmit = (tableName: string, isRegex: boolean) => {
    console.log("Table Name:", tableName);
    console.log("Is Regex:", isRegex);
  };

  return (
    <>
      <SettingsPanel onSubmit={handleFormSubmit} />
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
              <td className="relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] border-b border-zinc-950/5 dark:border-white/5 py-4 sm:first:pl-1 sm:last:pr-1">
                <TruncatedText text={row.functiondefinition} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TriggersTable;
