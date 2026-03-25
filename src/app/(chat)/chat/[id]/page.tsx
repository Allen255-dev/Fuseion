import Chat from "~/components/chat";
import { models, type Model } from "~/lib/ai/models";
import { cookies } from "next/headers";
import { auth } from "~/app/(auth)/auth";
import { redirect } from "next/navigation";
import { getDefaultModel } from "~/lib/utils";
import { queries } from "~/lib/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  const cookieStore = await cookies();
  const model = cookieStore.get("chat-model");

  let initialMessages: any[] = [];
  let thread;

  try {
    const rawMessages = await queries.listMessagesByThreadId(id);
    initialMessages = rawMessages.map((m: any) => {
      let parts = m.parts;
      if (typeof parts === 'string') {
        try {
          const parsed = JSON.parse(parts);
          if (Array.isArray(parsed)) {
            parts = parsed;
          }
        } catch {
          // Keep as string if not valid JSON
        }
      }

      return {
        id: m.external_id,
        role: m.role,
        parts: parts,
        metadata: m.metadata,
      };
    });

    thread = await queries.getThreadByUserIdAndThreadId(
      session.user.userId ?? "",
      id,
    );
  } catch (error) {
    console.error("❌ [Convex] Error fetching chat data:", error);
  }

  if (!thread || thread.status === "deleted") {
    redirect("/chat");
  }

  let selectedModel: Model;
  try {
    const parsedModel = model ? JSON.parse(model.value) : null;
    selectedModel = parsedModel ? (models.find((m) => m.id === parsedModel.id) ?? getDefaultModel()) : getDefaultModel();
  } catch {
    selectedModel = getDefaultModel();
  }

  return (
    <Chat
      id={id}
      autoResume={true}
      session={session}
      selectedModel={selectedModel}
      initialMessages={initialMessages}
    />
  );
}
