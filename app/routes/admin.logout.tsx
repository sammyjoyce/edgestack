import { redirect } from "react-router";
import { COOKIE_NAME } from "../utils/auth";

export async function loader() {
  // Clear the cookie
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    },
  });
}

export default function Logout() {
  return null;
}
