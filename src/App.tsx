import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Contract } from "./screens/Contract";
import { Contracts } from "./screens/Contracts";
import { Email } from "./screens/Email";
import { Home } from "./screens/Home";
import { Item } from "./screens/Item";
import { Measures } from "./screens/Measures";
import { Privacy } from "./screens/Privacy";
import { Setup } from "./screens/Setup";
import { Sirion } from "./screens/Sirion";
import { Styleguide } from "./screens/Styleguide";
import { Versions } from "./screens/Versions";
import { ClockProvider } from "./state/ClockContext";
import { DemoStateProvider } from "./state/DemoStateContext";
import { ViewerProvider } from "./state/ViewerContext";

export function App() {
  return (
    <ClockProvider>
      <DemoStateProvider>
        <ViewerProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="setup" element={<Setup />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="item/:id" element={<Item />} />
              <Route path="contract/:id" element={<Contract />} />
              <Route path="versions/:id" element={<Versions />} />
              <Route path="email" element={<Email />} />
              <Route path="measures" element={<Measures />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="sirion" element={<Sirion />} />
              <Route path="styleguide" element={<Styleguide />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </ViewerProvider>
      </DemoStateProvider>
    </ClockProvider>
  );
}
