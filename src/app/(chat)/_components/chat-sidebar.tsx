"use client";

import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "~/components/ui/sidebar";
import Link from "next/link";
import type { Session } from "next-auth";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ThreadInterface } from "~/types/thread";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  X,
  Pin,
  Trash,
  Rocket,
  PinOff,
  Loader2,
  Settings2,
  Sparkles,
  Plus,
  PlusCircle,
  LogOut,
  HelpCircle,
  MessagesSquare,
  Bug,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
} from "~/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { regenerateThreadTitle, updateThread } from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { signOut } from "next-auth/react";
import { useThreads } from "~/hooks/use-threads";


export function ChatSidebar({ session }: { session: Session | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const userId = session?.user?.userId ?? "";
  const [isPending, startTransition] = useTransition();
  const [isRegenerating, startRegeneration] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ThreadInterface | null>(
    null,
  );
  const deleteShiftRef = useRef(false);

  const {
    results: threads,
    status,
    loadMore,
  } = useThreads(userId, "");

  const mutateThread = async (args: any) => {
    try {
      await updateThread(args);
      // In a real app, we'd use a more reactive way to update the UI
      // For now, refresh works.
      router.refresh();
    } catch (error) {
      console.error("Failed to mutate thread:", error);
    }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      status === "CanLoadMore" &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 200
    ) {
      loadMore();
    }
  };

  const filteredThreads = threads;

  function groupThreadsByDate(threads: ThreadInterface[]) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOf7DaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
    const startOf30DaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;

    const groups: Record<string, ThreadInterface[]> = {
      pinned: [],
      today: [],
      yesterday: [],
      last7: [],
      last30: [],
      older: [],
    };
    for (const thread of threads) {
      if (thread.pinned) {
        groups.pinned.push(thread);
        continue;
      }
      if (thread.createdAt >= startOfToday) {
        groups.today.push(thread);
      } else if (thread.createdAt >= startOfYesterday) {
        groups.yesterday.push(thread);
      } else if (thread.createdAt >= startOf7DaysAgo) {
        groups.last7.push(thread);
      } else if (thread.createdAt >= startOf30DaysAgo) {
        groups.last30.push(thread);
      } else {
        groups.older.push(thread);
      }
    }

    groups.pinned.sort((a, b) => b.createdAt - a.createdAt);
    return groups;
  }

  const grouped = useMemo(
    () => groupThreadsByDate(filteredThreads),
    [filteredThreads],
  );

  function renderGroup(label: string, threads: ThreadInterface[]) {
    if (!threads.length) return null;
    return (
      <SidebarGroup className="px-3 py-0">
        <SidebarGroupLabel className="px-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{label}</span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {threads.map((thread: ThreadInterface, index: number) => (
              <SidebarMenuItem key={`${thread.id}-${index}`}>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <SidebarMenuButton asChild size="default" className="h-9 transition-all duration-200 hover:bg-white/5 data-[active=true]:bg-white/10 data-[active=true]:text-primary-foreground group-data-[collapsible=icon]:!p-2">
                      <Link
                        scroll={false}
                        href={`/chat/${thread.id}`}
                        className={`w-full items-center justify-between ${pathname === `/chat/${thread.id}` ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        data-discover="true"
                      >
                        <span className="truncate">{thread.title}</span>
                        {thread.status === "streaming" && (
                          <Loader2 className="size-3 animate-spin text-muted-foreground ml-auto" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48 bg-card/95 backdrop-blur-xl border-white/10">
                    <ContextMenuItem
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                      onSelect={() => {
                        startTransition(() => {
                          void mutateThread({
                            id: thread.id,
                            pinned: !thread.pinned,
                          });
                        });
                      }}
                      disabled={isPending || isRegenerating}
                    >
                      {thread.pinned ? (
                        <>
                          <PinOff className="size-4 mr-2" />
                          Unpin Thread
                        </>
                      ) : (
                        <>
                          <Pin className="size-4 mr-2" />
                          Pin Thread
                        </>
                      )}
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                      onSelect={() => {
                        startRegeneration(async () => {
                          void mutateThread({
                            id: thread.id,
                            status: "streaming",
                          });
                          const title = await regenerateThreadTitle({
                            userId,
                            threadId: thread.id,
                          });
                          void mutateThread({
                            title,
                            id: thread.id,
                            status: "done",
                          });
                        });
                      }}
                      disabled={isPending || isRegenerating}
                    >
                      {isRegenerating ? (
                        <Loader2 className="size-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="size-4 mr-2" />
                      )}
                      Rename
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="text-red-400 focus:text-red-400 focus:bg-red-900/20 cursor-pointer"
                      onPointerDown={(e) => {
                        deleteShiftRef.current = e.shiftKey;
                      }}
                      onSelect={() => {
                        const shift = deleteShiftRef.current;
                        deleteShiftRef.current = false;
                        if (shift) {
                          startTransition(() => {
                            if (pathname === `/chat/${thread.id}`) {
                              router.push("/chat");
                            }
                            void mutateThread({
                              id: thread.id,
                              status: "deleted",
                            });
                          });
                          return;
                        }
                        setPendingDelete(thread);
                        setConfirmOpen(true);
                      }}
                      disabled={isPending || isRegenerating}
                    >
                      <Trash className="size-4 mr-2" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar collapsible="offcanvas" variant="inset" className="bg-sidebar border-r border-white/5">
      <SidebarHeader className="flex flex-col gap-4 p-4 !pt-safe min-h-[72px]">
        <div className="flex flex-col gap-3 mt-14">
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/chat");
              router.refresh();
            }}
            className="w-full justify-center gap-2.5 h-11 rounded-full bg-zinc-800/40 hover:bg-zinc-800/60 border border-white/5 text-zinc-300 hover:text-white transition-all duration-200 shadow-sm"
          >
            <PlusCircle className="size-4.5" />
            <span className="text-sm font-semibold tracking-tight">New chat</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="flex-1 relative overflow-auto min-h-0 flex-col gap-2 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        style={{
          ["--shadow-height" as unknown as string]: "16px",
          ["--scrollbar-width" as unknown as string]: "0px",
          maskImage:
            "linear-gradient(to bottom,transparent,#000 var(--shadow-height),#000 calc(100% - var(--shadow-height)),transparent 100%),linear-gradient(to left,#fff var(--scrollbar-width),transparent var(--scrollbar-width))",
          WebkitMaskImage:
            "linear-gradient(to bottom,transparent,#000 var(--shadow-height),#000 calc(100% - var(--shadow-height)),transparent 100%),linear-gradient(to left,#fff var(--scrollbar-width),transparent var(--scrollbar-width))",
        }}
        onScroll={onScroll}
      >
        {status === "LoadingFirstPage" && !threads.length ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No threads yet
          </div>
        ) : (
          <>
            {renderGroup("Pinned", grouped.pinned)}
            {renderGroup("Today", grouped.today)}
            {renderGroup("Yesterday", grouped.yesterday)}
            {renderGroup("Last 7 Days", grouped.last7)}
            {renderGroup("Last 30 Days", grouped.last30)}
            {renderGroup("Older", grouped.older)}
          </>
        )}
        {status === "LoadingMore" && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="bg-zinc-900 border border-white/5 rounded-full data-[state=open]:bg-zinc-800 data-[state=open]:text-sidebar-accent-foreground hover:bg-zinc-800 transition-all shadow-md py-6 px-4"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session.user.picture} alt={session.user.name || ""} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {session.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{session.user.email}</span>
                </div>
                <Settings2 className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card/95 backdrop-blur-xl border-white/10 shadow-xl"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => router.push('/settings')}>
                <Settings2 className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => router.push('/help')}>
                <HelpCircle className="mr-2 size-4" />
                Help Center
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => router.push('/community')}>
                <MessagesSquare className="mr-2 size-4" />
                Community
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => router.push('/feedback')}>
                <Bug className="mr-2 size-4" />
                Feedback
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-900/20"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg h-10 rounded-xl"
          >
            <Link
              href="/auth"
              className="flex items-center justify-center gap-2"
            >
              <Rocket className="size-4" />
              <span>Sign In</span>
            </Link>
          </Button>
        )}
      </SidebarFooter>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;
              {pendingDelete?.title || "this thread"}&rdquo;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="bg-transparent hover:bg-white/10 border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!pendingDelete) return;
                startTransition(() => {
                  if (pathname === `/chat/${pendingDelete.id}`) {
                    router.push("/chat");
                  }
                  void mutateThread({
                    id: pendingDelete.id,
                    status: "deleted",
                  });
                  setConfirmOpen(false);
                  setPendingDelete(null);
                });
              }}
              disabled={isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
