"use client";

import { useRouter } from "next/navigation";
import { ComboboxCustom } from "@/components/ui/combobox-custom";
import { useMemo } from "react";

interface ConstituencyNavigatorProps {
  constituencies: {
    id: number;
    name: string;
    district?: string;
  }[];
  currentId: number;
}

export function ConstituencyNavigator({
  constituencies,
  currentId,
}: ConstituencyNavigatorProps) {
  const router = useRouter();

  const sortedConstituencies = useMemo(() => {
    return [...constituencies]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({
        value: c.id.toString(),
        label: c.name,
        searchTerms: `${c.name} ${c.district || ""}`,
      }));
  }, [constituencies]);

  return (
    <div className="w-full sm:w-75 [&>div>label]:hidden">
      <ComboboxCustom
        name="constituency-nav"
        label=""
        items={sortedConstituencies}
        value={currentId.toString()}
        onChange={(value) =>
          router.push(`/analytics/constituency-lead/${value}`)
        }
        placeholder="Select Constituency"
        searchPlaceholder="Search constituency..."
        modal={false}
      />
    </div>
  );
}
