import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, CreditCard, Ticket, Users2 } from "lucide-react";

const OrganizerBenefitsSection = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Organizer Benefits</CardTitle>
          <CardDescription>
            Why become an event organizer on our platform?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Users2 className="text-primary h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Reach a Wider Audience</h4>
                <p className="text-muted-foreground text-sm">
                  Access our growing community of event attendees and expand
                  your reach.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <BarChart3 className="text-primary h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Powerful Analytics</h4>
                <p className="text-muted-foreground text-sm">
                  Get detailed insights into your event performance and attendee
                  demographics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <CreditCard className="text-primary h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Simplified Payments</h4>
                <p className="text-muted-foreground text-sm">
                  Secure payment processing and automated payouts for your
                  events.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Ticket className="text-primary h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Ticket Management</h4>
                <p className="text-muted-foreground text-sm">
                  Easy-to-use tools for creating and managing different ticket
                  types.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerBenefitsSection;
