import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, Layers, Search } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
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

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const [results, setResults] = useState({ skills: [], topics: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runSearch = async () => {
      if (query.trim().length < 2) {
        setResults({ skills: [], topics: [] });
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await searchContent(query.trim());
      setResults(data || { skills: [], topics: [] });
      setLoading(false);
    };
    runSearch();
  }, [query]);

  const totalResults = results.skills.length + results.topics.length;

  return (
    <div className="min-h-screen bg-main text-primary">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div
          className="mb-6 flex items-center gap-2 text-sm text-secondary transition-colors duration-200 hover:text-primary"
          onClick={() => navigate(-1)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") navigate(-1);
          }}
        >
          <ArrowLeft size={16} />
          Back
        </div>

        <div className="flex items-center gap-3">
          <Search size={24} className="text-[#6366f1]" />
          <h1 className="text-2xl font-bold text-primary">
            Search results for <span className="text-[#6366f1]">"{query}"</span>
          </h1>
        </div>
        {!loading && (
          <div className="mt-1 text-sm text-secondary">
            {totalResults > 0 ? `${totalResults} results found` : "No results found"}
          </div>
        )}

        {loading && (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-20 rounded-xl border border-subtle bg-card animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && totalResults === 0 && (
          <div className="mt-16 text-center">
            <Search size={48} className="mx-auto text-muted" />
            <div className="mt-4 text-lg font-semibold text-primary">
              No results for "{query}"
            </div>
            <div className="mt-2 text-sm text-secondary">
              Try searching for a different skill or topic
            </div>
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="mt-6 rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm text-white transition-all duration-200 hover:bg-indigo-500"
            >
              Browse All Skills →
            </button>
          </div>
        )}

        {!loading && results.skills.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center text-sm font-semibold text-primary">
              Skills
              <span className="ml-2 rounded-full bg-skeleton px-2 py-0.5 text-xs text-secondary">
                {results.skills.length}
              </span>
            </div>
            {results.skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => navigate(`/roadmap?skillId=${skill.id}`)}
                className="mb-3 flex cursor-pointer items-center gap-4 rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Layers size={18} className="text-[#6366f1]" />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-primary">
                    {highlightMatch(skill.name, query)}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-sm text-secondary">
                    {skill.description}
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
            ))}
          </section>
        )}

        {!loading && results.topics.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center text-sm font-semibold text-primary">
              Topics
              <span className="ml-2 rounded-full bg-skeleton px-2 py-0.5 text-xs text-secondary">
                {results.topics.length}
              </span>
            </div>
            {results.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/roadmap?topicId=${topic.id}`)}
                className="mb-3 cursor-pointer rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <BookOpen size={18} className="text-purple-400" />
                    </div>
                    <div className="text-base font-semibold text-primary">
                      {highlightMatch(topic.title, query)}
                    </div>
                  </div>
                  {topic.status === "in_progress" && (
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                      In Progress
                    </span>
                  )}
                  {topic.status === "completed" && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                      Completed
                    </span>
                  )}
                </div>

                <div className="ml-14 mt-2 text-xs text-secondary">
                  <span className="rounded bg-card-hover px-2 py-0.5">
                    {topic.skillName}
                  </span>
                </div>
                <div className="ml-14 mt-2 line-clamp-2 text-sm text-secondary">
                  {topic.description}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 rounded-full bg-skeleton">
                    <div
                      className="h-1 rounded-full bg-[#6366f1]"
                      style={{ width: `${topic.progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-secondary">
                    {topic.progressPercentage}% complete
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
