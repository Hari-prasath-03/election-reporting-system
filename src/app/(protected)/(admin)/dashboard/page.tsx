import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserPlus, Flag, Vote } from "lucide-react";
import {
  getCandidatesCount,
  getConstituenciesCount,
  getPartiesCount,
  getUsersCount,
} from "@/utils";

export default async function Page() {
  const [userCnt, partyCnt, candidateCnt, constituencyCnt] = await Promise.all([
    getUsersCount(),
    getPartiesCount(),
    getCandidatesCount(),
    getConstituenciesCount(),
  ]);

  const stats = [
    {
      title: "Active Users",
      icon: UserPlus,
      value: userCnt,
      description: "Registered officers and admins",
      actionLink: "/dashboard/manage-users",
    },
    {
      title: "Political Parties",
      icon: Flag,
      value: partyCnt,
      description: "Registered political parties",
      actionLink: "/dashboard/manage-parties",
    },
    {
      title: "Candidates",
      icon: Users,
      value: candidateCnt,
      description: "Total candidates in field",
      actionLink: "/dashboard/manage-candidates",
    },
    {
      title: "Constituencies",
      icon: Vote,
      value: constituencyCnt,
      description: "Active electoral zones",
      actionLink: "/dashboard/view-constituencies",
    },
  ];

  const quickActions = [
    {
      title: "Party Registry",
      description: "Manage political parties and symbols.",
      href: "/dashboard/manage-parties",
    },
    {
      title: "Candidate List",
      description: "Manage candidates and assignments.",
      href: "/dashboard/manage-candidates",
    },
    {
      title: "Officer Management",
      description: "Control access for field officers.",
      href: "/dashboard/manage-users",
    },
    {
      title: "Counting Centers",
      description: "Manage counting centers and constituency links.",
      href: "/dashboard/counting-centers",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Management Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time Election status Reporting System.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.actionLink}>
            <Card className="transform hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {stat.value === 0 ? "Not added" : stat.value}
                </div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-4">
        Quick Actions
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all pb-5">
              <span className="sr-only">{action.title}</span>
              <CardHeader>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
