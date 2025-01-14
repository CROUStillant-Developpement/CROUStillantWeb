import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";

export default function VersionBadge() {
  return (
    <Link href="/changelog" className="flex items-center">
      <Badge variant="version" className="animate-appear text-xs">
        Version {process.env.VERSION}
      </Badge>
    </Link>
  );
}
