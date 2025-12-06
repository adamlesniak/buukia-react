import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import styled from "styled-components";

import { GlobalStyles } from "@/components/GlobalStyles";

import { Sidebar } from "../components/Sidebar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const AppOutletContainer = styled.div`
  display: flex;
  flex: 1;
  margin: 1em;
  margin-left: 1em;
  margin-left: 17rem;
`;

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <GlobalStyles />
      <AppContainer>
        <Sidebar />
        <AppOutletContainer>
          <Outlet />
        </AppOutletContainer>
      </AppContainer>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
});
