import RoadmapNode from "./RoadmapNode.jsx";

const RoadmapGraph = ({ topics, selectedTopicId, onTopicSelect, loading }) => {
  if (loading || !topics || topics.length === 0) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-skeleton animate-pulse" />
            <div className="h-20 w-64 rounded-xl bg-skeleton animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topics.map((topic, index) => (
        <div key={topic.id} className="flex flex-col">
          <RoadmapNode
            topic={topic}
            isSelected={selectedTopicId === topic.id}
            onClick={() => onTopicSelect(topic)}
          />
          {index < topics.length - 1 && (
            <div className="ml-5 mt-2 flex w-12 justify-center">
              <div
                className={`h-8 w-0.5 ${
                  topic.isCompleted ? "bg-green-500/40" : "bg-skeleton"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoadmapGraph;
