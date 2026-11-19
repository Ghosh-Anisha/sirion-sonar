import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AccessLog } from "./screens/AccessLog";
import { Architecture } from "./screens/Architecture";
import { Assumptions } from "./screens/Assumptions";
import { Contract } from "./screens/Contract";
import { Contracts } from "./screens/Contracts";
import { Email } from "./screens/Email";
import { Home } from "./screens/Home";
import { Item } from "./screens/Item";
import { Login } from "./screens/Login";
import { Measures } from "./screens/Measures";
import { Privacy } from "./screens/Privacy";
import { Problem } from "./screens/Problem";
import { Sirion } from "./screens/Sirion";
import { Start } from "./screens/Start";
import { Stakeholders } from "./screens/Stakeholders";
import { Summary } from "./screens/Summary";
import { Styleguide } from "./screens/Styleguide";
import { Versions } from "./screens/Versions";
import { Welcome } from "./screens/Welcome";
import { Why } from "./screens/Why";
import { ClockProvider } from "./state/ClockContext";
import { DemoStateProvider } from "./state/DemoStateContext";
import { OnboardingProvider } from "./state/OnboardingContext";
import { GuideProvider } from "./state/GuideContext";
import { ThinkingProvider } from "./state/ThinkingContext";
import { ViewerProvider } from "./state/ViewerContext";

export function App() {
  return (
    <ClockProvider>
      <OnboardingProvider>
        <DemoStateProvider>
          <ViewerProvider>
            <ThinkingProvider>
              <GuideProvider>
                <Routes>
                  <Route element={<AppShell nav={false} topBar={false} />}>
                    <Route path="login" element={<Login />} />
                  </Route>
                  <Route element={<AppShell nav={false} />}>
                    <Route index element={<Start />} />
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="setup" element={<Navigate to="/welcome" replace />} />
                  </Route>
                  <Route element={<AppShell />}>
                    <Route path="home" element={<Home />} />
                    <Route path="access" element={<AccessLog />} />
                    <Route path="contracts" element={<Contracts />} />
                    <Route path="item/:id" element={<Item />} />
                    <Route path="contract/:id" element={<Contract />} />
                    <Route path="versions/:id" element={<Versions />} />
                    <Route path="email" element={<Email />} />
                    <Route path="measures" element={<Measures />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="sirion" element={<Sirion />} />
                    <Route path="architecture" element={<Architecture />} />
                    <Route path="why" element={<Why />} />
                    <Route path="problem" element={<Problem />} />
                    <Route path="stakeholders" element={<Stakeholders />} />
                    <Route path="assumptions" element={<Assumptions />} />
                    <Route path="summary" element={<Summary />} />
                    <Route path="styleguide" element={<Styleguide />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Route>
                </Routes>
              </GuideProvider>
            </ThinkingProvider>
          </ViewerProvider>
        </DemoStateProvider>
      </OnboardingProvider>
    </ClockProvider>
  );
}
