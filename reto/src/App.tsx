import AppMenu from "@components/AppMenu";
import { Outlet } from "react-router";

function App() {
  return <>
  <AppMenu />
  <Outlet />
  </>;}

export default App;
