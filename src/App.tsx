import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import DashboardPage from "@/pages/DashboardPage";
import PostsPage from "@/pages/PostsPage";
import PostNewPage from "@/pages/PostNewPage";
import TagsPage from "@/pages/TagsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import SeriesPage from "@/pages/SeriesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/new", element: <PostNewPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "series", element: <SeriesPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
