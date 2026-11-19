import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Placeholder } from "./screens/Placeholder";
import { Styleguide } from "./screens/Styleguide";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route
          path="home"
          element={
            <Placeholder title="Home">
              <Link to="/setup">Run setup first</Link>
            </Placeholder>
          }
        />
        <Route path="setup" element={<Placeholder title="Setup" />} />
        <Route path="contracts" element={<Placeholder title="Contracts" />} />
        <Route path="item/:id" element={<Placeholder title="Item" />} />
        <Route path="contract/:id" element={<Placeholder title="Contract" />} />
        <Route path="versions/:id" element={<Placeholder title="Versions" />} />
        <Route path="email" element={<Placeholder title="Weekly email" />} />
        <Route path="measures" element={<Placeholder title="Measures" />} />
        <Route path="privacy" element={<Placeholder title="Privacy" />} />
        <Route path="sirion" element={<Placeholder title="Sirion" />} />
        <Route path="styleguide" element={<Styleguide />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
