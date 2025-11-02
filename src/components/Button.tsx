type ButtonProps = {
  "aria-pressed"?: string;
  active?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  tabIndex?: number;
  type?: "button" | "submit" | "reset";
  value?: string;
  children: React.ReactNode;
};

export function Button(props: ButtonProps) {
  return (
    <button
      className={`${props.className}${props.active ? " active" : ""}`}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      tabIndex={props.tabIndex}
      type={props.type}
      value={props.value}
    >
      {props.children}
    </button>
  );
}
