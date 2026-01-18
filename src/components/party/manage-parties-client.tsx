/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback, useEffect } from "react";
import PartiesTable from "./parties-table";
import PartyForm from "./party-form";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Party } from "@/types";
import { Input } from "@/components/ui/input";
import fetchPartiesAction from "@/actions/party/fetch-parties-action";

type ManagePartiesClientProps = {
  initialParties: Party[];
  initialTotal: number;
};

export default function ManagePartiesClient({
  initialParties,
  initialTotal,
}: ManagePartiesClientProps) {
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [total, setTotal] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedParty, setSelectedParty] = useState<Party | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchParties = useCallback(
    async (isNewSearch = false) => {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      const result = await fetchPartiesAction({
        query: searchQuery,
        page: currentPage,
        limit,
        excludeIndependent: true,
      });

      if (result.success && result.data) {
        if (isNewSearch) {
          setParties(result.data);
          setPage(1);
        } else {
          setParties(result.data);
        }
        setTotal(result.total);
      }
      setLoading(false);
    },
    [searchQuery, page]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchParties(true), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefresh = () => fetchParties(true);

  const handleCreateParty = () => {
    setFormMode("create");
    setSelectedParty(undefined);
    setShowForm(true);
  };

  const handleEditParty = (party: Party) => {
    setFormMode("edit");
    setSelectedParty(party);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedParty(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedParty(undefined);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex w-full sm:max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button onClick={handleCreateParty} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Party
        </Button>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Total parties: <span className="font-semibold">{total}</span>
      </div>

      <PartiesTable
        parties={parties}
        onEdit={handleEditParty}
        onRefresh={handleRefresh}
      />

      {showForm && (
        <PartyForm
          mode={formMode}
          party={selectedParty}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
