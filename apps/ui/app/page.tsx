"use client";
import React, { useEffect, useState } from "react";
import { ProjectsRepository } from "@/repositories/ProjectsRepository";
import { Project } from "@/repositories/ProjectsRepository";
import { ProjectsTable } from "@/components/tables/ProjectsTable"; // Reusing your table component
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export const HomeDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const projectsRepository = new ProjectsRepository();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsRepository.getAllProjects();
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  // Calculate some project stats (you can modify this to include real data)
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.settings?.active).length;

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-white">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Overview of your project's performance.
        </p>
      </header>

      {/* Project Overview Section */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Projects */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
            Total Projects
          </h2>
          <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-white">
            {totalProjects}
          </p>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
            Active Projects
          </h2>
          <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-white">
            {activeProjects}
          </p>
        </div>

        {/* Example Widget: Project Completion */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
            Completion Status
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <CheckCircleIcon className="h-6 w-6 text-lime-300" />
            <span className="text-lg text-zinc-950 dark:text-white">
              {activeProjects} Active
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <XCircleIcon className="h-6 w-6 text-red-400" />
            <span className="text-lg text-zinc-950 dark:text-white">
              {totalProjects - activeProjects} Inactive
            </span>
          </div>
        </div>
      </section>

      {/* Projects Table Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-4">
          Recent Projects
        </h2>
        <ProjectsTable />
      </section>
    </div>
  );
};

export default HomeDashboard;
