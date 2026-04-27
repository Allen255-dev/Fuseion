import { NextResponse } from "next/server";

export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "rate_limit_daily"
  | "rate_limit_monthly"
  | "offline"
  | "unsupported_provider"
  | "internal_server_error"
  | "pro_required"
  | "limit_reached"
  | "aborted";

export type Surface =
  | "chat"
  | "chat_free"
  | "chat_pro"
  | "auth"
  | "api"
  | "stream"
  | "database"
  | "history"
  | "vote"
  | "document"
  | "suggestions";

export type ErrorCode = `${ErrorType}:${Surface}`;

export type ErrorVisibility = "response" | "log" | "none";

export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  database: "log",
  chat: "response",
  chat_free: "response",
  chat_pro: "response",
  auth: "response",
  stream: "response",
  api: "response",
  history: "response",
  vote: "response",
  document: "response",
  suggestions: "response",
};

export class ChatSDKError extends Error {
  public type: ErrorType;
  public surface: Surface;
  public statusCode: number;

  constructor(errorCode: ErrorCode, cause?: string) {
    super();

    const safeErrorCode =
      typeof errorCode === "string" ? errorCode : "internal_server_error:api";
    const [type, surface] = safeErrorCode.split(":");

    this.type = (type || "internal_server_error") as ErrorType;
    this.cause = cause;
    this.surface = (surface || "api") as Surface;
    
    // For custom errors like pro blocks, use the cause as the main message
    // For protocol/provider errors like rate limits, use the friendly message (the cause will be shown separately)
    const isCustomError = safeErrorCode.includes("pro_required") || safeErrorCode.includes("limit_reached");
    this.message = (isCustomError && cause) ? cause : getMessageByErrorCode(safeErrorCode as ErrorCode);
    
    this.statusCode = getStatusCodeByType(this.type);
  }

  public toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`;
    const visibility = visibilityBySurface[this.surface];

    const { message, cause, statusCode } = this;

    if (visibility === "log") {
      console.error({
        code,
        message,
        cause,
      });

      return NextResponse.json(
        { code: "", message: "Something went wrong. Please try again later." },
        { status: statusCode },
      );
    }

    return NextResponse.json({ code, message, cause }, { status: statusCode });
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  if (errorCode.includes("database")) {
    return "An error occurred while executing a database query.";
  }

  switch (errorCode) {
    case "bad_request:api":
      return "The request couldn't be processed. Please check your input and try again.";
    case "forbidden:api":
      return "Access denied due to captcha protection.";
    case "unauthorized:api":
      return "You need to provide an API key to use this feature.";
    case "unsupported_provider:api":
      return "The requested provider is not supported. Please check the provider and try again.";
    case "internal_server_error:api":
      return "An error occurred while processing your request. Please try again later.";
    case "rate_limit:api":
      return "The AI provider's rate limit or quota has been reached. Please try again in a few moments, or switch to a different model.";

    case "unauthorized:auth":
      return "You need to sign in to send messages.";
    case "forbidden:auth":
      return "Your account does not have access to this feature.";

    case "rate_limit_daily:chat_free":
      return "You have exceeded your maximum number of messages for the day. Please upgrade to a paid plan to continue using the chat.";
    case "rate_limit_monthly:chat_free":
      return "You have exceeded your maximum number of messages for the month. Please upgrade to a paid plan to continue using the chat.";

    case "rate_limit_daily:chat_pro":
      return "You have exceeded your maximum number of messages for the day. Kindly purchase additional credits to continue using the chat.";
    case "rate_limit_monthly:chat_pro":
      return "You have exceeded your maximum number of messages for the month. Kindly purchase additional credits to continue using the chat.";

    case "not_found:chat":
      return "The requested chat was not found. Please check the chat ID and try again.";
    case "forbidden:chat":
      return "This chat belongs to another user. Please check the chat ID and try again.";
    case "unauthorized:chat":
      return "You need to sign in to view this chat. Please sign in and try again.";
    case "offline:chat":
      return "We're having trouble sending your message. Please check your internet connection and try again.";

    case "aborted:chat":
      return "The chat request was aborted by the client. Please try again.";

    case "not_found:document":
      return "The requested document was not found. Please check the document ID and try again.";
    case "forbidden:document":
      return "This document belongs to another user. Please check the document ID and try again.";
    case "unauthorized:document":
      return "You need to sign in to view this document. Please sign in and try again.";
    case "bad_request:document":
      return "The request to create or update the document was invalid. Please check your input and try again.";

    case "pro_required:api":
      return "This model requires a Pro subscription. Please upgrade to continue.";
    case "limit_reached:api":
      return "You have reached your tier limit. Please upgrade to continue.";

    default:
      return "Something went wrong. Please try again later.";
  }
}

function getStatusCodeByType(type: ErrorType) {
  switch (type) {
    case "bad_request":
      return 400;
    case "unauthorized":
      return 401;
    case "forbidden":
      return 403;
    case "not_found":
      return 404;
    case "rate_limit":
      return 429;
    case "rate_limit_daily":
      return 429;
    case "rate_limit_monthly":
      return 429;
    case "offline":
      return 503;
    default:
      return 500;
  }
}
