"use client";

import { useState, useCallback, useEffect } from "react";
import CandidatesTable from "./candidates-table";
import CandidateForm from "./candidate-form";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Candidate } from "@/types";
import { Input } from "@/components/ui/input";
import fetchCandidatesAction from "@/actions/candidate/fetch-candidates-action";
import { useSearchParams, useRouter } from "next/navigation";

type ManageCandidatesClientProps = {
  initialCandidates: Candidate[];
  initialTotal: number;
  parties: { id: number; name: string; short_name: string }[];
  constituencies: { id: number; name: string }[];
};

export default function ManageCandidatesClient({
  initialCandidates,
  initialTotal,
  parties,
  constituencies,
}: ManageCandidatesClientProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [total, setTotal] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCandidate, setSelectedCandidate] = useState<
    Candidate | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const searchParams = useSearchParams();
  const router = useRouter();
  const constituencyIdParam = searchParams.get("constituencyId");

  useEffect(() => {
    if (constituencyIdParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormMode("create");
      setSelectedCandidate(undefined);
      setShowForm(true);
    }
  }, [constituencyIdParam]);

  const fetchCandidates = useCallback(
    async (isNewSearch = false) => {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      const result = await fetchCandidatesAction({
        query: searchQuery,
        page: currentPage,
        limit,
      });

      if (result.success && result.data) {
        if (isNewSearch) {
          setCandidates(result.data);
          setPage(1);
        } else {
          setCandidates(result.data);
        }
        setTotal(result.total);
      }
      setLoading(false);
    },
    [searchQuery, page]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchCandidates(true), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchCandidates]);

  const handleRefresh = () => fetchCandidates(true);

  const handleCreateCandidate = () => {
    if (constituencyIdParam)
      router.replace("/dashboard/manage-candidates", { scroll: false });
    setFormMode("create");
    setSelectedCandidate(undefined);
    setShowForm(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setFormMode("edit");
    setSelectedCandidate(candidate);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCandidate(undefined);
    if (constituencyIdParam)
      router.replace("/dashboard/manage-candidates", { scroll: false });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedCandidate(undefined);
    if (constituencyIdParam) {
      router.replace("/dashboard/manage-candidates", { scroll: false });
    }
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex w-full sm:max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button onClick={handleCreateCandidate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Total candidates: <span className="font-semibold">{total}</span>
      </div>

      <CandidatesTable
        candidates={candidates}
        onEdit={handleEditCandidate}
        onRefresh={handleRefresh}
      />

      {showForm && (
        <CandidateForm
          mode={formMode}
          candidate={selectedCandidate}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          parties={parties}
          constituencies={constituencies}
          initialConstituencyId={constituencyIdParam || undefined}
        />
      )}
    </div>
  );
}
