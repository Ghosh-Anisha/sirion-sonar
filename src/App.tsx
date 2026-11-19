import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Contract } from "./screens/Contract";
import { Contracts } from "./screens/Contracts";
import { Home } from "./screens/Home";
import { Item } from "./screens/Item";
import { Placeholder } from "./screens/Placeholder";
import { Styleguide } from "./screens/Styleguide";
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
              <Route path="setup" element={<Placeholder title="Setup" />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="item/:id" element={<Item />} />
              <Route path="contract/:id" element={<Contract />} />
              <Route path="versions/:id" element={<Placeholder title="Versions" />} />
              <Route path="email" element={<Placeholder title="Weekly email" />} />
              <Route path="measures" element={<Placeholder title="Measures" />} />
              <Route path="privacy" element={<Placeholder title="Privacy" />} />
              <Route path="sirion" element={<Placeholder title="Sirion" />} />
              <Route path="styleguide" element={<Styleguide />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </ViewerProvider>
      </DemoStateProvider>
    </ClockProvider>
  );
}
