// model Post {
//   id String @id @default(uuid())
//   name String @db.VarChar(80)
//   message String @db.VarChar(500)
//   imagePath String? @db.Text
//   createdAt DateTime @default(now())

//   @@index([createdAt])
//   @@map("posts")
// }

export type PostDTO = {
  id: string;
  name: string;
  messagem: string;
  imagePath: string | null;
  createdAt: string;
};

export type CreatePostInput = {
  name: string;
  messagem: string;
  imagePath: string | null;
};
