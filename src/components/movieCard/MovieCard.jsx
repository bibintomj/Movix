// author - Jithin Thomas Jacob

// movie card component to display movie/tv details
const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home); // get image urls from redux store
  const navigate = useNavigate(); // hook for navigation
  const posterUrl = data.poster_path
    ? url.poster + data.poster_path // use poster path if available
    : PosterFallback; // fallback image if not

  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)} // navigate to details page on click
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} /> {/* display poster image */}
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average.toFixed(1)} /> {/* display rating */}
            <Genres data={data.genre_ids.slice(0, 2)} /> {/* display genres */}
          </React.Fragment>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data.title || data.name}</span> {/* display title */}
        <span className="date">
          {dayjs(data.release_date).format("MMM D, YYYY")} {/* format and display release date */}
        </span>
      </div>
    </div>
  );
};

export default MovieCard; // export movie card component