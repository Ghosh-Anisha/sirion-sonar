import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COMPANY_NAME } from "../data/drafts";
import { BrandMark } from "../components/layout/BrandMark";
import { useSkipToDemo } from "../components/welcome/useSkipToDemo";
import { Button } from "../components/ui/Button";
import { useClock } from "../state/ClockContext";
import { useOnboarding } from "../state/OnboardingContext";
import { PROCUREMENT_LEAD } from "../state/ViewerContext";
import "./Login.css";

const SIGN_IN_MS = 900;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A mock sign-in, so onboarding starts where a real one would. It asks for no password,
 * checks nothing, and sends nothing anywhere: Continue signs in as the sample procurement lead.
 */
export function Login() {
  const { dispatch } = useOnboarding();
  const { today } = useClock();
  const navigate = useNavigate();
  const skip = useSkipToDemo();
  const [email, setEmail] = useState(PROCUREMENT_LEAD.email);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<string | null>(null);

  useEffect(() => {
    if (!signingIn) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "sign-in", email: signingIn, on: today });
      navigate("/welcome?step=1");
    }, SIGN_IN_MS);
    return () => window.clearTimeout(timer);
  }, [signingIn, dispatch, navigate, today]);

  const withEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) return setError("Enter a work email, such as name@company.com.");
    setError(null);
    setSigningIn(email.trim());
  };

  return (
    <div className="login">
      <section className="login__card" aria-labelledby="login-title">
        <span className="login__mark">
          <BrandMark />
        </span>
        <h1 id="login-title">Sign in to Sirion Sonar</h1>
        <p className="muted">Set it up once for {COMPANY_NAME}. Sonar then finds the supplier contracts and keeps watch over them.</p>

        {signingIn ? (
          <p className="login__busy" role="status">
            Signing you in as {signingIn}.
          </p>
        ) : (
          <>
            <div className="login__sso">
              <Button className="button--big login__provider" data-tour="login-sso" onClick={() => setSigningIn(PROCUREMENT_LEAD.email)}>
                <span className="login__provider-mark login__provider-mark--google" aria-hidden="true">
                  G
                </span>
                Continue with Google
              </Button>
              <Button className="button--big login__provider" onClick={() => setSigningIn(PROCUREMENT_LEAD.email)}>
                <span className="login__provider-mark login__provider-mark--microsoft" aria-hidden="true" />
                Continue with Microsoft
              </Button>
            </div>

            <p className="login__or">
              <span>or use your work email</span>
            </p>

            <form className="login__form" onSubmit={withEmail} noValidate data-tour="login-email">
              <label htmlFor="login-email" className="label">
                Work email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error !== null}
                aria-describedby={error ? "login-error" : undefined}
              />
              {error && (
                <p id="login-error" className="login__error">
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" className="button--big" data-nudge="login-continue">
                Continue
              </Button>
            </form>
          </>
        )}

        <p className="login__note" role="note" data-tour="login-note">
          This is a mock sign-in for the demo. It never asks for a password, nothing is checked, and nothing leaves your browser.
        </p>
        <Link to="/home" onClick={skip} className="login__skip">
          Skip to demo
        </Link>
      </section>
    </div>
  );
}
