import { useState } from "react";
const NavigationBar = ({ appModel, setCurrentPage }) => {
  /**
   * Renders a navigation bar with two tabs: "Questions" and "Tags".
   * The currently highlighted tab is determined by the `highlight` state variable.
   * When a tab is clicked, the `highlight` state is updated and the `setCurrentPage` function is called with the corresponding page name
   * to change the current page displayed
   *
   * @param {Object} appModel - An object representing the application model.
   * @param {Function} setCurrentPage - A function to update the current page.
   * @returns {JSX.Element} The rendered navigation bar.
   */
  const [highlight, setHightlight] = useState("Questions");
  const questionTabStyle =
    highlight === "Questions" ? { backgroundColor: "lightgrey" } : {};
  const tagsTabStyle =
    highlight === "Tags" ? { backgroundColor: "lightgrey" } : {};
  const profileTabStyle =
    highlight === "Profile" ? { backgroundColor: "lightgrey" } : {};
  return (
    <div className="menu">
      <ul>
        <li
          id="questionTab"
          style={questionTabStyle}
          onClick={() => {
            setHightlight("Questions");
            setCurrentPage("Homepage");
          }}
        >
          Questions
        </li>
        <li
          id="tagsTab"
          style={tagsTabStyle}
          onClick={() => {
            setHightlight("Tags");
            setCurrentPage("Tags");
          }}
        >
          Tags
        </li>
        <li
          id="profileTab"
          style={profileTabStyle}
          onClick={() => {
            setHightlight("Profile");
            setCurrentPage("Profile");
          }}
        >
          Profile
        </li>
      </ul>
    </div>
  );
};

export default NavigationBar;
