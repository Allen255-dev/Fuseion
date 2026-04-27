import { prisma } from "./prisma";

export async function saveMessage({
  externalId,
  role,
  parts,
  metadata,
  threadId,
  userId,
}: {
  externalId: string;
  role: string;
  parts: any;
  metadata?: any;
  threadId: string;
  userId: string;
}) {
  return await prisma.message.create({
    data: {
      externalId,
      role,
      parts,
      metadata,
      threadId,
      userId,
    },
  });
}

export async function getThread(externalId: string) {
  return await prisma.thread.findUnique({
    where: { externalId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export async function createThread({
  externalId,
  title,
  model,
  userId,
}: {
  externalId: string;
  title: string;
  model: string;
  userId: string;
}) {
  return await prisma.thread.create({
    data: {
      externalId,
      title,
      model,
      userId,
      status: "active",
    },
  });
}

export async function upsertUser({
  userId,
  email,
  name,
  picture,
}: {
  userId: string;
  email?: string;
  name?: string;
  picture?: string;
}) {
  return await prisma.user.upsert({
    where: { userId },
    update: { email, name, picture },
    create: { userId, email, name, picture },
  });
}
