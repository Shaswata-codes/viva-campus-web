import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageCircle, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

interface Feedback {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const fetchFeedback = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load feedback");
    } else {
      setFeedbackList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    const { error } = await supabase.from("feedback").insert({
      title,
      message,
      user_id: user.id,
    });

    if (error) {
      toast.error("Failed to submit feedback");
    } else {
      toast.success("Feedback submitted successfully!");
      setOpen(false);
      setTitle("");
      setMessage("");
      fetchFeedback();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Feedback & Suggestions</h1>
            <p className="text-muted-foreground">Share your thoughts with us</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Feedback</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-title">Title</Label>
                  <Input
                    id="feedback-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-message">Message</Label>
                  <Textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Submit Feedback</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading feedback...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {feedbackList.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{feedback.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(feedback.created_at), "PPp")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feedback.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && feedbackList.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No feedback submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
