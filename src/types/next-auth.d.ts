import { User } from "./user";

interface Payload extends User {
  token: string;
}

declare module "next-auth" {
  interface Session {
    user: Payload;
  }
}
