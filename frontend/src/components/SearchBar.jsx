import {
  BookOpen,
  ChevronRight,
  CornerDownLeft,
  Layers,
  Loader2,
  Search,
  X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchContent } from "../api/dashboard.js";

const highlightMatch = (text, query) => {
  if (!query) return text;
  const lower = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lower.indexOf(lowerQuery);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-[#6366f1]">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
};

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ skills: [], topics: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ skills: [], topics: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchContent(query.trim());
      if (data) {
        setResults(data);
        setIsOpen(true);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && query.trim().length >= 2) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (event.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  const handleResultClick = useCallback(
    (type, id) => {
      setIsOpen(false);
      setQuery("");
      if (type === "skill") {
        navigate(`/roadmap?skillId=${id}`);
      }
      if (type === "topic") {
        navigate(`/roadmap?topicId=${id}`);
      }
    },
    [navigate]
  );

  const showDropdown = isOpen;

  return (
    <div className="relative">
      <div className="flex w-64 items-center gap-2 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 transition-all duration-200 focus-within:border-[#6366f1] lg:w-80">
        <Search size={15} className="flex-shrink-0 text-[#444]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search skills, topics..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-[#444] outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="text-[#444] transition-colors duration-150 hover:text-white"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[380px] overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111] shadow-2xl shadow-black/50"
        >
          {results.skills.length > 0 && (
            <div>
              <div className="border-b border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#444]">
                Skills
              </div>
              {results.skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleResultClick("skill", skill.id)}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#0f0f0f] px-4 py-3 transition-colors duration-150 hover:bg-[#1a1a1a] last:border-0"
                >
                  <Layers size={16} className="flex-shrink-0 text-[#6366f1]" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {highlightMatch(skill.name, query)}
                    </div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-[#666]">
                      {skill.description}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#333]" />
                </div>
              ))}
            </div>
          )}

          {results.topics.length > 0 && (
            <div>
              <div className="border-b border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#444]">
                Topics
              </div>
              {results.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleResultClick("topic", topic.id)}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#0f0f0f] px-4 py-3 transition-colors duration-150 hover:bg-[#1a1a1a] last:border-0"
                >
                  <BookOpen size={16} className="flex-shrink-0 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {highlightMatch(topic.title, query)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-[#1a1a1a] px-1.5 py-0.5 text-xs text-[#666]">
                        {topic.skillName}
                      </span>
                      {topic.status === "in_progress" && (
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-xs text-indigo-400">
                          In Progress
                        </span>
                      )}
                      {topic.status === "completed" && (
                        <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs text-green-400">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-[#666]">{topic.progressPercentage}%</div>
                </div>
              ))}
            </div>
          )}

          {results.skills.length === 0 && results.topics.length === 0 && !loading && (
            <div className="px-4 py-6 text-center">
              <Search size={20} className="mx-auto text-[#333]" />
              <div className="mt-2 text-sm text-[#666]">No results for "{query}"</div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2 text-xs text-[#444]">
            <span>Press Enter to see all results</span>
            <CornerDownLeft size={12} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
