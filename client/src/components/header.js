import SearchBar from "./search-bar";
import Logout from "./logout";
import { useContext } from "react";
import { UserContext } from "./user-context";

// AKA the banner
const Header = ({
  appModel,
  searchString,
  setSearchString,
  setPageNow,
  setSearchResults,
}) => {
  const [user, setUser] = useContext(UserContext);
  return (
    <header>
      <div className="aline">
        <li className="user-info">
          {user ? (
            <div>
              <Logout appModel={appModel} />
            </div>
          ) : (
            <h3>Guest User</h3>
          )}
        </li>
        <li>
          <h1>Fake Stack Overflow</h1>
        </li>
        <li className="search-bar-container">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            setPageNow={setPageNow}
            setSearchResults={setSearchResults}
          />
        </li>
      </div>
    </header>
  );
};

export default Header;
