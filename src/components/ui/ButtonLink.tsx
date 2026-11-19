import { Link, type LinkProps } from "react-router-dom";
import type { ButtonVariant } from "./Button";
import "./Button.css";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
}

/** A link that looks like a button, for actions that go to another screen. */
export function ButtonLink({ variant = "secondary", className, ...rest }: ButtonLinkProps) {
  const classes = ["button", `button--${variant}`, className].filter(Boolean).join(" ");
  return <Link className={classes} {...rest} />;
}
