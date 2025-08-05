// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      time: i.number(),
      createdAt: i.date(),
      creatorId: i.string().indexed(),
      order: i.number().optional(),
    }),
  },
  links: {
    todoCreator: {
      forward: { on: "todos", has: "one", label: "creator" },
      reverse: { on: "$users", has: "many", label: "todos" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
