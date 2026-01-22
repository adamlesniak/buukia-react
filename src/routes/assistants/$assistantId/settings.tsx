import { createFileRoute } from "@tanstack/react-router";

import AssistantSettings from "@/containers/AssistantSettings";

export const Route = createFileRoute("/assistants/$assistantId/settings")({
  component: AssistantSettings,
});
