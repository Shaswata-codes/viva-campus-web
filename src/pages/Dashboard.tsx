import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, MessageCircle, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  event_date: string;
  category: string;
}

const Dashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    myComplaints: 0,
    myFeedback: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch upcoming events
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);

      setUpcomingEvents(events || []);

      // Fetch stats
      const { count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      const { count: complaintsCount } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      const { count: feedbackCount } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      setStats({
        totalEvents: eventsCount || 0,
        myComplaints: complaintsCount || 0,
        myFeedback: feedbackCount || 0,
      });
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">Here's what's happening on campus</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Active campus events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Complaints</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myComplaints}</div>
              <p className="text-xs text-muted-foreground">Submitted requests</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Feedback</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myFeedback}</div>
              <p className="text-xs text-muted-foreground">Suggestions shared</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss out on these events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? (
                <>
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.event_date), "PPp")}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    </div>
                  ))}
                  <Link to="/events">
                    <Button variant="outline" className="w-full">View All Events</Button>
                  </Link>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/events">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Browse Events
                </Button>
              </Link>
              <Link to="/complaints">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Submit Complaint
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Share Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
