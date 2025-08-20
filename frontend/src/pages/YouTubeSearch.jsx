import { useEffect, useState } from "react";
import { Search, Play, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Layout from "../components/Layout";
import { useSearchParams } from "react-router-dom";

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();


  const handleSearch = async (query) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/videos?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularWorkouts = [
    { name: "Yoga", icon: "🧘‍♀️" },
    { name: "Push ups", icon: "💪" },
    { name: "HIIT", icon: "🔥" },
    { name: "Pilates", icon: "🤸‍♀️" },
    { name: "Cardio", icon: "❤️" },
    { name: "Strength training", icon: "🏋️‍♂️" },
  ];

  useEffect(() => {
    const q = searchParams.get("query");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="min-h-screen text-foreground pt-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Workout Video Search
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the perfect workout videos for your fitness journey
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search workout (e.g. yoga, push up, HIIT)"
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!query || isLoading}
                  className="h-12 px-6"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {videos.length === 0 && !selectedVideo && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Popular Workouts
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {popularWorkouts.map((workout, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => {
                          setQuery(workout.name);
                        }}
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
                      >
                        <span className="text-2xl">{workout.icon}</span>
                        <span className="text-sm font-medium">
                          {workout.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Player */}
          {selectedVideo && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="aspect-video mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${
                      selectedVideo.url.split("v=")[1]
                    }`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedVideo.title}
                </h2>
              </CardContent>
            </Card>
          )}

          {videos.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Play className="h-6 w-6" />
                Search Results ({videos.length} videos)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, idx) => (
                  <Card
                    key={idx}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Click to watch</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
