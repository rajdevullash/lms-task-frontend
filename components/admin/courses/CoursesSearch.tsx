"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props {
  onSearch: (term: string) => void;
}

export default function CoursesSearch({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="btn-outline"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
}
