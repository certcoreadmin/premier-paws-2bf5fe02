import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Dna } from "lucide-react";

// Recursive component to render each node in the pedigree
const PedigreeNode = ({ dog, generation }) => {
  if (!dog) return null;

  const genderColor = dog.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50';
  const genderBorder = dog.gender === 'male' ? 'border-blue-200' : 'border-pink-200';

  return (
    <div className="flex items-center">
      <Card className={`w-48 text-xs shrink-0 ${genderColor} ${genderBorder}`}>
        <CardContent className="p-2">
          <p className="font-bold truncate">{dog.name}</p>
          <p className="text-stone-600 truncate">{dog.registration_info?.registration_name || 'N/A'}</p>
        </CardContent>
      </Card>
      {generation > 0 && (
        <div className="flex flex-col justify-around h-full pl-4 border-l-2 border-stone-300 ml-2">
          <PedigreeNode dog={dog.sire} generation={generation - 1} />
          <PedigreeNode dog={dog.dam} generation={generation - 1} />
        </div>
      )}
    </div>
  );
};

export default function PedigreeChart({ pedigreeData, generations = 3 }) {
  if (!pedigreeData) {
    return (
      <Card className="flex items-center justify-center h-64 bg-stone-50">
        <div className="text-center text-stone-500">
          <Dna className="w-10 h-10 mx-auto mb-2" />
          <p>Select a Sire and Dam to generate a trial pedigree.</p>
        </div>
      </Card>
    );
  }

  return <PedigreeNode dog={pedigreeData} generation={generations} />;
}