import React, { useState, useCallback } from "react";
import Button, { ButtonV2 } from "../Button";
import BoardList from "../Board";

// Old Way
class ThemeWrapperOld extends React.Component {
  state = {
    theme: "dark",
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: this.state.theme === "dark" ? "black" : "white",
        }}
      >
        <Button
          theme={this.state.theme}
          title="switch theme"
          onClick={() =>
            this.setState({
              theme: this.state.theme === "dark" ? "light" : "dark",
            })
          }
        />
      </div>
    );
  }
}
/**
 * component.cursor_state=1
 * component.states = [
 *    "dark",
 *    [100, 500]
 * ]
 */
const getResourceLogo = (type) => {
  switch (type) {
    case "foo":
      return "barr.jpg";
  }
};

// New Way
function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState("dark");
  const [dimension, setDimension] = useState({
    width: null,
    height: null,
  });

  const onButtonClick = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "dark" ? "black" : "white",
      }}
    >
      <Button theme={theme} title="switch theme" onClick={onButtonClick} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "orange",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ThemeWrapper;
