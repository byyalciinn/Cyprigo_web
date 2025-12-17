import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface PrivacyPolicyContentProps {
  dictionary: {
    privacyPolicy: {
      title: string;
      intro: string;
      sections: Array<{ title: string; content: string }>;
    };
  };
}

export function PrivacyPolicyContent({ dictionary }: PrivacyPolicyContentProps) {
  const { privacyPolicy } = dictionary;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <p className="text-muted-foreground leading-relaxed">
        {privacyPolicy.intro}
      </p>

      {/* Sections - dynamically rendered like mobile app */}
      {privacyPolicy.sections.map((section, index) => (
        <Card key={index} className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
