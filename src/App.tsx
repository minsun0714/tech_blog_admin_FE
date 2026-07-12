import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import RootLayout from "@/components/RootLayout";
import CategoriesPage from "@/pages/CategoriesPage";
import DashboardPage from "@/pages/DashboardPage";
import PostEditPage from "@/pages/PostEditPage";
import PostNewPage from "@/pages/PostNewPage";
import PostsPage from "@/pages/PostsPage";
import SeriesPage from "@/pages/SeriesPage";
import TagsPage from "@/pages/TagsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/new", element: <PostNewPage /> },
      { path: "posts/:id/edit", element: <PostEditPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "series", element: <SeriesPage /> },
      { path: "*", element: <div>404 Not Found</div> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
    </>
  );
}
