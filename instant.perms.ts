// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/core";

const rules = {
  todos: {
    allow: {
      view: "auth.id != null && auth.id == data.creatorId",
      create: "auth.id != null && auth.id == data.creatorId",
      update: "auth.id != null && auth.id == data.creatorId",
      delete: "auth.id != null && auth.id == data.creatorId",
    },
  },
  // Prevent unauthorized access to user data ^
  $users: {
    allow: {
      view: "auth.id != null && auth.id == data.id",
      create: "false", // Users are created automatically via auth ^
      update: "false", // Users namespace is read-only ^
      delete: "false", // Prevent user deletion ^
    },
  },
} satisfies InstantRules;

export default rules;
