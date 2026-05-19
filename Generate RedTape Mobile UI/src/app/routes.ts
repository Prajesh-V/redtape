import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomeScreen } from "./components/HomeScreen";
import { LearnScreen } from "./components/LearnScreen";
import { FindLawyerScreen } from "./components/FindLawyerScreen";
import { AIScannerScreen } from "./components/AIScannerScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomeScreen },
      { path: "learn", Component: LearnScreen },
      { path: "find-lawyer", Component: FindLawyerScreen },
      { path: "ai-scanner", Component: AIScannerScreen },
    ],
  },
]);
