"use server";

import { prisma } from "@/lib/prisma";
import { AppUser } from "@/types/user";

export async function getUsersBySearchTerm(searchTerm: string) {
 try {
   const users = await prisma.user.findMany({
     where: {
       OR: [
         {
           email: {
             startsWith: searchTerm,
             mode: "insensitive", // optional: ignore case
           },
         },
         {
           name: {
             contains: searchTerm,
             mode: "insensitive", // optional: ignore case
           },
         },
       ],
     },
   });
   const foundUsers: AppUser[] = users.map((user) => ({
     id: user.id,
     name: user.name ?? "", // fallback if null
     image: user.image ?? "", // fallback if null
     email: user.email,
   }));

   return foundUsers;
 } catch (error) {
   console.error("Error while searching users:", error);
   return [];
 }
}
