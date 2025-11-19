// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/react-native';

type BuildError = {
  from: string;
  status: number;
  message: string;
};

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    builds: i.entity({
      instantAppId: i.string(),
      code: i.string(),
      reasoning: i.string().optional(),
      slug: i.string().indexed().unique().optional(),
      error: i.json<BuildError>().optional(),
      isPreviewable: i.boolean().optional(),
      title: i.string().optional(),
    }),
  },
  links: {
    buildOwner: {
      forward: {
        on: 'builds',
        has: 'one',
        label: 'owner',
        required: true,
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'builds',
      },
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
