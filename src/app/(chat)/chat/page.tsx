import Chat from "~/components/chat";
import { models, type Model } from "~/lib/ai/models";
import { cookies } from "next/headers";
import { auth } from "~/app/(auth)/auth";
import { redirect } from "next/navigation";
import { generateUUID, getDefaultModel } from "~/lib/utils";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const model = cookieStore.get("chat-model");

  if (!model) {
    return (
      <Chat
        id={id}
        autoResume={false}
        session={session}
        selectedModel={getDefaultModel()}
      />
    );
  }

  let selectedModel: Model;
  try {
    const parsedModel = JSON.parse(model.value);

    selectedModel = models.find((m) => m.id === parsedModel.id) ?? getDefaultModel();
  } catch {
    selectedModel = getDefaultModel();
  }

  return (
    <Chat
      id={id}
      autoResume={false}
      session={session}
      selectedModel={selectedModel}
    />
  );
}
