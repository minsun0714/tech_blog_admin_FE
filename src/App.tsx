import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import PostsPage from "@/pages/PostsPage";
import TagsPage from "@/pages/TagsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import SeriesPage from "@/pages/SeriesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/posts" replace /> },
      { path: "posts", element: <PostsPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "series", element: <SeriesPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
