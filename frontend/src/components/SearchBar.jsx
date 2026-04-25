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
  const [results, setResults] = useState({ skills: [], topics: [], users: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ skills: [], topics: [], users: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchContent(query.trim());
      if (data) {
        setResults({
          skills: data.skills || [],
          topics: data.topics || [],
          users: data.users || []
        });
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
    (type, data) => {
      setIsOpen(false);
      setQuery("");
      if (type === "skill") {
        navigate(`/roadmap?skillId=${data}`);
      }
      if (type === "topic") {
        navigate(`/roadmap?topicId=${data}`);
      }
      if (type === "user") {
        navigate(`/u/${data}`);
      }
    },
    [navigate]
  );

  const showDropdown = isOpen;

  return (
    <div className="relative">
      <div className="flex w-64 items-center gap-2 rounded-lg border border-subtle bg-main px-3 py-2 transition-all duration-200 focus-within:border-[#6366f1] lg:w-80">
        <Search size={15} className="flex-shrink-0 text-muted" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tracks, topics..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-sm text-primary placeholder-muted outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="text-muted transition-colors duration-150 hover:text-primary"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[380px] overflow-hidden rounded-xl border border-subtle bg-card shadow-2xl shadow-black/50"
        >
          {results.skills.length > 0 && (
            <div>
              <div className="border-b border-subtle bg-main px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted">
                Tracks
              </div>
              {results.skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleResultClick("skill", skill.id)}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#0f0f0f] px-4 py-3 transition-colors duration-150 hover:bg-card-hover last:border-0"
                >
                  <Layers size={16} className="flex-shrink-0 text-[#6366f1]" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-primary">
                      {highlightMatch(skill.name, query)}
                    </div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-secondary">
                      {skill.description}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
          )}

          {results.topics.length > 0 && (
            <div>
              <div className="border-b border-subtle bg-main px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted">
                Topics
              </div>
              {results.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleResultClick("topic", topic.id)}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#0f0f0f] px-4 py-3 transition-colors duration-150 hover:bg-card-hover last:border-0"
                >
                  <BookOpen size={16} className="flex-shrink-0 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-primary">
                      {highlightMatch(topic.title, query)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-card-hover px-1.5 py-0.5 text-xs text-secondary">
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
                  <div className="text-xs text-secondary">{topic.progressPercentage}%</div>
                </div>
              ))}
            </div>
          )}

          {results.users && results.users.length > 0 && (
            <div>
              <div className="border-b border-subtle bg-main px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted">
                Users
              </div>
              {results.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleResultClick("user", user.username)}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#0f0f0f] px-4 py-3 transition-colors duration-150 hover:bg-card-hover last:border-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white uppercase">
                    {user.display_name.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-primary">
                      {highlightMatch(user.display_name, query)}
                    </div>
                    <div className="text-xs text-secondary">@{user.username}</div>
                  </div>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
          )}

          {results.skills.length === 0 && results.topics.length === 0 && (!results.users || results.users.length === 0) && !loading && (
            <div className="px-4 py-6 text-center">
              <Search size={20} className="mx-auto text-muted" />
              <div className="mt-2 text-sm text-secondary">No results for "{query}"</div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-subtle bg-main px-4 py-2 text-xs text-muted">
            <span>Press Enter to see all results</span>
            <CornerDownLeft size={12} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
