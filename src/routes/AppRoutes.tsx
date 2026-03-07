import type { RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import SettlementDetailPage from "@/pages/SettlementDetailPage";
import SettlementsPage from "@/pages/SettlementsPage";

export const AppRoutes: RouteObject[] = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/settlements",
        element: <SettlementsPage />,
    },
    {
        path: "/settlements/:id",
        element: <SettlementDetailPage />,
    },
];
