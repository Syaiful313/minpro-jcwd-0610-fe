import { User } from "./user";

interface payload extends User {
  token: string;
}

declare module "next-auth" {
  interface Session {
    user: { payload };
  }
}
