import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Database,
  Settings,
  Share2,
  Server,
  Shield,
  Clock,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

interface PrivacyPolicyContentProps {
  dictionary: {
    privacyPolicy: {
      title: string;
      lastUpdated: string;
      introduction: { title: string; content: string };
      dataCollection: { title: string; content: string; items: string[] };
      dataUsage: { title: string; content: string; items: string[] };
      dataSharing: { title: string; content: string; items: string[] };
      thirdPartyServices: { title: string; content: string; items: string[] };
      dataSecurity: { title: string; content: string };
      dataRetention: { title: string; content: string };
      userRights: { title: string; content: string; items: string[] };
      childrenPrivacy: { title: string; content: string };
      changes: { title: string; content: string };
      contact: { title: string; content: string; email: string };
    };
  };
}

export function PrivacyPolicyContent({ dictionary }: PrivacyPolicyContentProps) {
  const { privacyPolicy } = dictionary;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.introduction.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {privacyPolicy.introduction.content}
          </p>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.dataCollection.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{privacyPolicy.dataCollection.content}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            {privacyPolicy.dataCollection.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Data Usage */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.dataUsage.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{privacyPolicy.dataUsage.content}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            {privacyPolicy.dataUsage.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.dataSharing.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{privacyPolicy.dataSharing.content}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            {privacyPolicy.dataSharing.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Third Party Services */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.thirdPartyServices.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{privacyPolicy.thirdPartyServices.content}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            {privacyPolicy.thirdPartyServices.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.dataSecurity.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {privacyPolicy.dataSecurity.content}
          </p>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.dataRetention.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {privacyPolicy.dataRetention.content}
          </p>
        </CardContent>
      </Card>

      {/* User Rights */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.userRights.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{privacyPolicy.userRights.content}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            {privacyPolicy.userRights.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Children's Privacy */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Baby className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.childrenPrivacy.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {privacyPolicy.childrenPrivacy.content}
          </p>
        </CardContent>
      </Card>

      {/* Policy Changes */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.changes.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {privacyPolicy.changes.content}
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{privacyPolicy.contact.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">{privacyPolicy.contact.content}</p>
          <p className="text-primary font-medium">{privacyPolicy.contact.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
