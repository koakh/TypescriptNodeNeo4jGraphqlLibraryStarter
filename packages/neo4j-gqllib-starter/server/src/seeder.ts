import faker from 'faker';
import { appConstants as c } from './app/constants';
import { createDebugger } from './app/debugger';
import * as neo4j from './app/neo4j';
import { ogm } from './gql';
import { hashPassword } from './utils/authentication';

const debug = createDebugger('Seeder');
const User = ogm.model('User');
const Blog = ogm.model('Blog');
const Post = ogm.model('Post');
const Comment = ogm.model('Comment');

const defaultEmail = 'admin@admin.com';
const defaultPassword = 'password';

async function main() {
  debug('Seeding Started');

  await neo4j.connect();

  await Promise.all([User, Blog, Post, Comment].map((m) => m.delete({})));

  const { users } = await User.create({
    input: await Promise.all(
      [
        [defaultEmail, defaultPassword, c.authentication.defaultAdminRole],
        [faker.internet.email(), faker.internet.password(), c.authentication.defaultUserRole],
        [faker.internet.email(), faker.internet.password(), c.authentication.defaultUserRole],
      ].map(async ([email, password, roles]) => {
        return {
          email,
          password: await hashPassword(password as string),
          roles,
        };
      })
    ),
  });

  await Blog.create({
    input: users.map((user) => {
      return {
        name: faker.lorem.word(6),
        description: faker.lorem.paragraph(),
        creator: {
          connect: { where: { node: { id: user.id } } },
        },
        posts: {
          create: new Array(3).fill(null).map(() => ({
            node: {
              title: faker.lorem.word(),
              content: faker.lorem.paragraphs(4),
              author: {
                connect: { where: { node: { id: user.id } } },
              },
              comments: {
                create: new Array(3).fill(null).map(() => {
                  const u = users[Math.floor(Math.random() * users.length)];

                  return {
                    node: {
                      content: faker.lorem.paragraph(),
                      author: {
                        connect: { where: { node: { id: u.id } } },
                      },
                    }
                  };
                }),
              },
            }
          })),
        },
        tags: {
          create: new Array(3).fill(null).map(() => {
            const u = users[Math.floor(Math.random() * users.length)];

            return {
              node: {
                name: faker.name.jobType(),
                creator: {
                  connect: { where: { node: { id: u.id } } },
                },
              }
            };
          })
        }
      };
    }),
  });

  await neo4j.disconnect();

  debug('Seeding Finished');
}

main();
