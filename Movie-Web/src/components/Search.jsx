const Search = ({ searchWeb, setSearchWeb }) => {
  return (
    <div className="search text-white">
      <div>
        <img src="search.svg" alt="" />
        <input
          type="text"
          placeholder="Search your favorite movies"
          value={searchWeb}
          onChange={(event) => setSearchWeb(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
