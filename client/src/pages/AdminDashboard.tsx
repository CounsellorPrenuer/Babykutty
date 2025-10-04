import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Calendar,
  Mail,
  CreditCard,
  Download,
  FileText,
  LogOut,
} from "lucide-react";
import { useLocation } from "wouter";

interface Stats {
  totalBookings: number;
  pending: number;
  contacted: number;
  completed: number;
  contactForms: number;
  leadDownloads: number;
  totalPayments: number;
  revenue: number;
  investments: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  planName: string | null;
  amount: number | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}

interface Payment {
  id: string;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  planName: string;
  amount: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const { data: statsData, isLoading: isLoadingStats, isError: isErrorStats, error: errorStats } = useQuery<{ success: boolean; stats: Stats }>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: leadsData, isLoading: isLoadingLeads, isError: isErrorLeads, error: errorLeads } = useQuery<{ success: boolean; leads: Lead[] }>({
    queryKey: ["/api/admin/leads"],
  });

  const { data: contactsData, isLoading: isLoadingContacts, isError: isErrorContacts, error: errorContacts } = useQuery<{ success: boolean; contacts: Contact[] }>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: paymentsData, isLoading: isLoadingPayments, isError: isErrorPayments, error: errorPayments } = useQuery<{ success: boolean; payments: Payment[] }>({
    queryKey: ["/api/admin/payments"],
  });

  const stats = statsData?.stats || {
    totalBookings: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
    contactForms: 0,
    leadDownloads: 0,
    totalPayments: 0,
    revenue: 0,
    investments: 0,
  };

  const leads = leadsData?.leads || [];
  const contacts = contactsData?.contacts || [];
  const payments = paymentsData?.payments || [];

  const isLoading = isLoadingStats || isLoadingLeads || isLoadingContacts || isLoadingPayments;
  const hasError = isErrorStats || isErrorLeads || isErrorContacts || isErrorPayments;

  const handleExportAll = () => {
    const data = {
      stats,
      leads,
      contacts,
      payments,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSection = (section: string, data: any[]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${section}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Failed to load dashboard data. Please try again.
            </p>
            {isErrorStats && (
              <p className="text-sm text-red-600">Stats: {(errorStats as Error)?.message || 'Unknown error'}</p>
            )}
            {isErrorLeads && (
              <p className="text-sm text-red-600">Leads: {(errorLeads as Error)?.message || 'Unknown error'}</p>
            )}
            {isErrorContacts && (
              <p className="text-sm text-red-600">Contacts: {(errorContacts as Error)?.message || 'Unknown error'}</p>
            )}
            {isErrorPayments && (
              <p className="text-sm text-red-600">Payments: {(errorPayments as Error)?.message || 'Unknown error'}</p>
            )}
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Retry
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <p className="font-sans text-muted-foreground mt-2">
              Manage all customer data, bookings, and submissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExportAll}
              variant="default"
              className="bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground"
              data-testid="button-export-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid" data-testid="tabs-navigation">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <Mail className="w-4 h-4 mr-2" />
              Contact Forms
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">
              <Download className="w-4 h-4 mr-2" />
              Lead Downloads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground" data-testid="stat-total-bookings">
                    {stats.totalBookings}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600" data-testid="stat-pending">
                    {stats.pending}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Contacted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600" data-testid="stat-contacted">
                    {stats.contacted}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600" data-testid="stat-completed">
                    {stats.completed}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Contact Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600" data-testid="stat-contact-forms">
                    {stats.contactForms}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Lead Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600" data-testid="stat-lead-downloads">
                    {stats.leadDownloads}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600" data-testid="stat-total-payments">
                    {stats.totalPayments}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600" data-testid="stat-revenue">
                    ₹{stats.revenue.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600" data-testid="stat-investments">
                    {stats.investments}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportSection("bookings", payments)}
                    data-testid="button-export-bookings"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="border-b pb-3 last:border-0" data-testid={`booking-${payment.id}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{payment.name || "N/A"}</p>
                              <p className="text-sm text-muted-foreground">{payment.planName}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Contact Forms</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportSection("contacts", contacts)}
                    data-testid="button-export-contacts"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {contacts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No contact forms yet</p>
                  ) : (
                    <div className="space-y-3">
                      {contacts.slice(0, 5).map((contact) => (
                        <div key={contact.id} className="border-b pb-3 last:border-0" data-testid={`contact-${contact.id}`}>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportSection("payments", payments)}
                    data-testid="button-export-payments"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No payments yet</p>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="border-b pb-3 last:border-0" data-testid={`payment-${payment.id}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{payment.name || "N/A"}</p>
                              <p className="text-sm text-muted-foreground">₹{payment.amount.toLocaleString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Lead Downloads</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportSection("leads", leads)}
                    data-testid="button-export-leads"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {leads.length === 0 ? (
                    <div className="text-center py-8">
                      <Download className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No downloads yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="border-b pb-3 last:border-0" data-testid={`lead-${lead.id}`}>
                          <p className="font-semibold">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.source}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bookings available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Phone</th>
                          <th className="text-left py-3 px-4">Plan</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b" data-testid={`booking-row-${payment.id}`}>
                            <td className="py-3 px-4">{payment.name || "N/A"}</td>
                            <td className="py-3 px-4">{payment.email || "N/A"}</td>
                            <td className="py-3 px-4">{payment.phone || "N/A"}</td>
                            <td className="py-3 px-4">{payment.planName}</td>
                            <td className="py-3 px-4">₹{payment.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                payment.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>All Contact Forms</CardTitle>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No contact forms available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Phone</th>
                          <th className="text-left py-3 px-4">Message</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr key={contact.id} className="border-b" data-testid={`contact-row-${contact.id}`}>
                            <td className="py-3 px-4">{contact.name}</td>
                            <td className="py-3 px-4">{contact.email}</td>
                            <td className="py-3 px-4">{contact.phone || "N/A"}</td>
                            <td className="py-3 px-4 max-w-xs truncate">{contact.message}</td>
                            <td className="py-3 px-4">{new Date(contact.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>All Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No payments available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Plan</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b" data-testid={`payment-row-${payment.id}`}>
                            <td className="py-3 px-4">{payment.name || "N/A"}</td>
                            <td className="py-3 px-4">{payment.email || "N/A"}</td>
                            <td className="py-3 px-4">{payment.planName}</td>
                            <td className="py-3 px-4">₹{payment.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                payment.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>All Lead Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No leads available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Phone</th>
                          <th className="text-left py-3 px-4">Source</th>
                          <th className="text-left py-3 px-4">Plan</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-b" data-testid={`lead-row-${lead.id}`}>
                            <td className="py-3 px-4">{lead.name}</td>
                            <td className="py-3 px-4">{lead.email}</td>
                            <td className="py-3 px-4">{lead.phone || "N/A"}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                {lead.source}
                              </span>
                            </td>
                            <td className="py-3 px-4">{lead.planName || "N/A"}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                lead.status === "new" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
