"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function BreadcrumbComponent() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname.split("/").map((path, index, array) => {
          const href = array.slice(0, index + 1).join("/");
          return (
            <BreadcrumbItem key={path}>
              <BreadcrumbLink href={path == "" ? "/" : href}>
                <BreadcrumbPage>{path == "" ? "Home" : path}</BreadcrumbPage>
              </BreadcrumbLink>
              {index < array.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
