import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SkeletonReferral = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-3/4" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium">Your Referral Code</p>
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Points Earned</p>
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Points Expiry</p>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 text-lg font-medium">
                <Skeleton className="h-6 w-32" />
              </h4>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-3/4" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonReferral;
