import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const logedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (logedInUser) return logedInUser;

  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress || "",
    },
  });

  return newUser;
};
