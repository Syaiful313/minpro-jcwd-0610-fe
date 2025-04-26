"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useGetCoupons from "@/hooks/api/coupon/useGetCoupons";
import { format } from "date-fns";
import { useState } from "react";

const CouponSection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: couponsData, isLoading } = useGetCoupons({
    page: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            View and manage all your available discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground text-sm">
                Loading coupons...
              </p>
            ) : !couponsData?.data || couponsData.data.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No coupons available.
              </p>
            ) : (
              <>
                {couponsData.data.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{coupon.code}</p>
                        <Badge
                          variant={
                            coupon.isUsed === true || coupon.isUsed === null
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {coupon.isUsed === true || coupon.isUsed === null
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{coupon.discount}%</p>
                      <p className="text-muted-foreground text-xs">
                        Expires:{" "}
                        {format(new Date(coupon.expirationDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                ))}

                {couponsData.meta && (
                  <PaginationSection
                    page={couponsData.meta.page}
                    take={couponsData.meta.take}
                    total={couponsData.meta.total}
                    onChangePage={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CouponSection;
