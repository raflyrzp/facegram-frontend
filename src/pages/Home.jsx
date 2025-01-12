import { useNavigate } from "react-router-dom";
import NewsFeed from "../components/NewsFeed";
import ExplorePeople from "../components/ExplorePeople";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Home Page</h1>
      <div className="row">
        <div className="col-md-8">
          <h2>News Feed</h2>
          <NewsFeed />
        </div>

        <div className="col-md-4">
          <h2>Explore People</h2>
          <ExplorePeople />
        </div>
      </div>
    </div>
  );
}

export default Home;
