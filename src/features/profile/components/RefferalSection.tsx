"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useGetProfile from "@/hooks/api/profile/useGetProfile";
import { useToken } from "@/hooks/useToken";
import { format } from "date-fns/format";
import { useState } from "react";
import OrganizerSection from "./OrganizerSection";
import SkeletonReferral from "./SkeletonReferral";
import useGetReferrals from "@/hooks/api/referral/useGetReferrals";
import PaginationSection from "@/components/PaginationSection";
import CouponSection from "./CouponSection";

const RefferalSection = () => {
  const token = useToken();
  const { data: user, isLoading: isProfileLoading } = useGetProfile(
    token as string,
  );
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: referralsData, isLoading: isReferralsLoading } =
    useGetReferrals({
      page: currentPage,
    });

  const formattedPoints = user?.point?.toLocaleString() || "0";
  const expirationDatePoint = user?.expirationDate
    ? format(new Date(user.expirationDate), "dd/MM/yyyy")
    : null;

  const copyToClipboard = () => {
    if (user?.referralCode) {
      navigator.clipboard
        .writeText(user.referralCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isProfileLoading) {
    return <SkeletonReferral />;
  }

  return (
    <div>
      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Program</CardTitle>
            <CardDescription>
              Share your referral code with friends and earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium">Your Referral Code</p>
                  <h3 className="text-2xl font-bold">{user?.referralCode}</h3>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow focus:outline-none focus-visible:ring-2"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Points Earned</p>
                  <h3 className="text-2xl font-bold">{formattedPoints}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Points Expiry</p>
                  <p className="text-sm">
                    {expirationDatePoint ? expirationDatePoint : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 text-lg font-medium">Recent Referrals</h4>
                <div className="space-y-4">
                  {isReferralsLoading ? (
                    <p>Loading referrals...</p>
                  ) : !referralsData?.data ||
                    referralsData.data.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No referrals found.
                    </p>
                  ) : (
                    <>
                      {referralsData.data.map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{referral.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Joined on{" "}
                              {format(
                                new Date(referral.joinedOn).getTime(),
                                "dd/MM/yyyy",
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              +{referral.pointsAwarded?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      {referralsData.meta && (
                        <PaginationSection
                          page={referralsData.meta.page}
                          take={referralsData.meta.take}
                          total={referralsData.meta.total}
                          onChangePage={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <CouponSection/>

        {user?.role !== "ORGANIZER" && <OrganizerSection />}
      </section>
    </div>
  );
};

export default RefferalSection;
