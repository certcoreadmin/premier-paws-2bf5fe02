import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Dna } from "lucide-react";
import HeatCycleTracker from "./HeatCycleTracker";
import TrialPedigreeBuilder from "./TrialPedigreeBuilder";

export default function BreedingDashboard() {
  return (
    <Tabs defaultValue="heat-cycles">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="heat-cycles">
          <Activity className="w-4 h-4 mr-2" />
          Heat Cycle Tracker
        </TabsTrigger>
        <TabsTrigger value="pedigree-builder">
          <Dna className="w-4 h-4 mr-2" />
          Trial Pedigree Builder
        </TabsTrigger>
      </TabsList>
      <TabsContent value="heat-cycles">
        <HeatCycleTracker />
      </TabsContent>
      <TabsContent value="pedigree-builder">
        <TrialPedigreeBuilder />
      </TabsContent>
    </Tabs>
  );
}