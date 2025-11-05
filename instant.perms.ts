// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from '@instantdb/react-native';

const rules = {
  $default: {
    allow: {
      $default: 'true',
    },
  },
  $users: {
    allow: {
      view: 'auth.id == data.id',
      create: 'false',
      update: 'false',
      delete: 'false',
    },
  },
  // builds: {
  // bind: [
  //   'isOwner',
  //   'auth.id != null && auth.id == data.owner',
  //   'isStillOwner',
  //   'auth.id != null && auth.id == newData.owner',
  //   'isAdmin',
  //   "auth.email != null && auth.email.endsWith('@galaxies.dev')",
  // ],
  // allow: {
  //   view: 'true',
  //   create: 'isOwner',
  //   update: 'isOwner && isStillOwner',
  //   delete: 'isOwner || isAdmin',
  // },
  // },
  /**
   * Welcome to Instant's permission system!
   * Right now your rules are empty. To start filling them in, check out the docs:
   * https://www.instantdb.com/docs/permissions
   *
   * Here's an example to give you a feel:
   * posts: {
   *   allow: {
   *     view: "true",
   *     create: "isOwner",
   *     update: "isOwner",
   *     delete: "isOwner",
   *   },
   *   bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
   * },
   */
} satisfies InstantRules;

export default rules;
