"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import useCreateOrganizer from "@/hooks/api/profile/useCreateOrganizer";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { validationOrganizerSchema } from "../schemas";
import OrganizerBenefitsSection from "./OrganizerBenefitsSection";

const OrganizerSection = () => {
  const { mutate: createOrganizer, isPending } = useCreateOrganizer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyWebsite: "",
      companyAddress: "",
      details: "",
      npwp: null as File | null,
    },
    validationSchema: validationOrganizerSchema,
    onSubmit: (values) => {
      if (!values.npwp) {
        toast.error("Please upload your ID verification document");
        return;
      }

      createOrganizer({
        companyName: values.companyName,
        companyWebsite: values.companyWebsite,
        companyAddress: values.companyAddress,
        details: values.details,
        npwp: values.npwp,
      });
    },
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue("npwp", file);
      setFileName(file.name);
    }
  };

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Become an Event Organizer</CardTitle>
          <CardDescription>
            Apply to host and manage events on our platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Organization Name</Label>
                {isPending || formik.isSubmitting ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter your organization or company name"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched.companyName && formik.errors.companyName ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.companyName}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyWebsite">Website (Optional)</Label>
                {isPending || formik.isSubmitting ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    placeholder="https://yourwebsite.com"
                    value={formik.values.companyWebsite}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched.companyWebsite &&
                formik.errors.companyWebsite ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.companyWebsite}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="details">Organization Description</Label>
                {isPending || formik.isSubmitting ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Tell us about your organization and the types of events you plan to host"
                    className="min-h-[120px]"
                    value={formik.values.details}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched.details && formik.errors.details ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.details}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyAddress">Address</Label>
                {isPending || formik.isSubmitting ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Input
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Address"
                    value={formik.values.companyAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched.companyAddress &&
                formik.errors.companyAddress ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.companyAddress}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label className="text-base">Verification Documents</Label>
                <p className="text-muted-foreground mb-2 text-sm">
                  Please provide documents to verify your organization's
                  identity
                </p>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="id-document">ID Verification</Label>
                      <p className="text-muted-foreground text-sm">
                        Government-issued ID of the primary contact
                      </p>
                      {fileName ? (
                        <p className="text-sm font-medium">{fileName}</p>
                      ) : (
                        <Skeleton className="h-8 w-40" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handleFileUpload}
                    >
                      {isPending || formik.isSubmitting ? (
                        <Skeleton className="h-6 w-16" />
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="my-4 w-full"
              disabled={isPending || formik.isSubmitting}
            >
              {isPending || formik.isSubmitting
                ? "Submitting Application..."
                : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <OrganizerBenefitsSection />
    </section>
  );
};

export default OrganizerSection;
