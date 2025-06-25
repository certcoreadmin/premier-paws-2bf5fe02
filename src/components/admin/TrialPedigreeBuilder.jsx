import React, { useState, useEffect, useCallback } from "react";
import { Dog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dna, GitCompareArrows, AlertCircle } from "lucide-react";
import PedigreeChart from "./PedigreeChart";

const MAX_GENERATIONS = 3;

export default function TrialPedigreeBuilder() {
  const [allParents, setAllParents] = useState([]);
  const [sires, setSires] = useState([]);
  const [dams, setDams] = useState([]);
  const [selectedSireId, setSelectedSireId] = useState("");
  const [selectedDamId, setSelectedDamId] = useState("");
  const [trialPedigree, setTrialPedigree] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commonAncestors, setCommonAncestors] = useState([]);

  useEffect(() => {
    const fetchParents = async () => {
      const parents = await Dog.filter({ type: "parent" });
      setAllParents(parents);
      setSires(parents.filter(p => p.gender === 'male'));
      setDams(parents.filter(p => p.gender === 'female'));
    };
    fetchParents();
  }, []);

  const buildPedigreeTree = useCallback(async (dogId, generation) => {
    if (!dogId || generation < 0) return null;

    const dog = allParents.find(p => p.id === dogId);
    if (!dog) return null;
    
    const [sire, dam] = await Promise.all([
      buildPedigreeTree(dog.pedigree?.sire_id, generation - 1),
      buildPedigreeTree(dog.pedigree?.dam_id, generation - 1)
    ]);
    
    return { ...dog, sire, dam };
  }, [allParents]);
  
  const getAncestors = (dog, ancestors = new Set()) => {
    if (!dog) return ancestors;
    ancestors.add(dog.id);
    if (dog.sire) getAncestors(dog.sire, ancestors);
    if (dog.dam) getAncestors(dog.dam, ancestors);
    return ancestors;
  };

  const handleGeneratePedigree = useCallback(async () => {
    if (!selectedSireId || !selectedDamId) return;

    setIsLoading(true);
    const [sireTree, damTree] = await Promise.all([
      buildPedigreeTree(selectedSireId, MAX_GENERATIONS),
      buildPedigreeTree(selectedDamId, MAX_GENERATIONS)
    ]);

    const trialPuppy = {
      name: "Trial Puppy",
      gender: "unknown",
      sire: sireTree,
      dam: damTree,
    };
    setTrialPedigree(trialPuppy);
    
    const sireAncestors = getAncestors(sireTree);
    const damAncestors = getAncestors(damTree);
    const common = [...sireAncestors].filter(id => damAncestors.has(id));
    setCommonAncestors(common.map(id => allParents.find(p => p.id === id)?.name));

    setIsLoading(false);
  }, [selectedSireId, selectedDamId, buildPedigreeTree, allParents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-purple-600" />
          Trial Pedigree Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="font-medium">Select Sire (Father)</label>
            <Select value={selectedSireId} onValueChange={setSelectedSireId}>
              <SelectTrigger><SelectValue placeholder="Choose a sire..." /></SelectTrigger>
              <SelectContent>
                {sires.map(sire => <SelectItem key={sire.id} value={sire.id}>{sire.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium">Select Dam (Mother)</label>
            <Select value={selectedDamId} onValueChange={setSelectedDamId}>
              <SelectTrigger><SelectValue placeholder="Choose a dam..." /></SelectTrigger>
              <SelectContent>
                {dams.map(dam => <SelectItem key={dam.id} value={dam.id}>{dam.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGeneratePedigree} disabled={!selectedSireId || !selectedDamId || isLoading}>
            <GitCompareArrows className="w-4 h-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Pedigree'}
          </Button>
        </div>
        
        {commonAncestors.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-semibold">Common Ancestors Found</h4>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              This pairing has common ancestors, which will result in a higher Coefficient of Inbreeding (COI).
              Common relatives: {commonAncestors.join(', ')}
            </p>
          </div>
        )}

        <div className="overflow-x-auto p-1">
          <PedigreeChart pedigreeData={trialPedigree} />
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <h4 className="font-semibold text-purple-800">Coefficient of Inbreeding (COI)</h4>
            <p className="text-2xl font-bold text-purple-600 my-2">
                {commonAncestors.length > 0 ? "~ 12.5% (Example)" : "0.00%"}
            </p>
            <p className="text-purple-700 text-sm">COI calculation is a simplified example based on found common ancestors. Professional software is recommended for precise calculations.</p>
        </div>
      </CardContent>
    </Card>
  );
}