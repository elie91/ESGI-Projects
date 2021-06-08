import React, {useMemo} from "react";

// Old way
class Button2 extends React.PureComponent {
  render() {
    return <button onClick={this.props.onClick}>{this.props.title}</button>;
  }
}


// New way
function Button(props) {

  return useMemo(
    () => <button style={{
            color: props.theme === "dark" ? "white" : "black",
            backgroundColor: props.theme === "dark" ? "black" : "white"
          }} onClick={props.onClick}>{props.title}</button>,
    [props.theme, props.title, props.onClick]
  );
}

// Children
/**
 * <ButtonV2 onClick={() => console.log('click')}>
 *      Change Theme
 * </ButtonV2>
 */
export function ButtonV2(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}

export default Button;