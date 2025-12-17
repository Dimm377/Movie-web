import { useState } from "react";
import Search from "./components/Search.jsx";
const App = () => {
  const [searchWeb, setSearchWeb] = useState("");
  return (
    <main>
      <div className="picture" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero" />
          <h1 className="text-white font-bold text-6xl">
            <span className="text-gradient">Next-Gen</span> Movie Interface.
          </h1>
        </header>
        <Search searchWeb={searchWeb} setSearchWeb={setSearchWeb} />
        <h1 className="text-white">{searchWeb}</h1>
      </div>
    </main>
  );
};

export default App;
